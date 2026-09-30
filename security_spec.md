# Big Tree Outdoor Lighting Inspection — Zero-Trust Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Global Default-Deny Invariant**: All unlisted paths (`/{document=**}`) are strictly denied (`allow read, write: if false;`).
2. **Verified Identity Invariant**: Every write operation across all collections requires `request.auth != null && request.auth.token.email_verified == true`.
3. **Path Variable Hardening Invariant**: Every single-document target operation (`get`, `create`, `update`, `delete`) validates the document ID parameter via `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
4. **PII Split-Collection Isolation Invariant**: Staff non-PII profiles (`/staff_profiles/{userId}`) are separated from staff PII (`/staff_private/{userId}`). Reading `/staff_private/{userId}` is strictly limited to `isOwner(userId) || isAdmin()`, and `allow list` is disabled (`false`).
5. **Atomicity Guarantee Invariant (`existsAfter`)**: Creating or updating a `/staff_private/{userId}` document requires that the corresponding `/staff_profiles/{userId}` document exists after the transaction/batch (`existsAfter(/databases/$(database)/documents/staff_profiles/$(userId))`).
6. **Self-Assigned Role Prevention Invariant**: Regular staff cannot create `/staff_profiles/{userId}` with `staffRole == 'Admin'` unless `isAdmin()` is true. Only admins (`addy@bigtree.com.my` with verified email or existing `/admins/{uid}`) can create/update/delete `/admins/{adminUid}`.
7. **Temporal Integrity & Immortal Fields Invariant**: On `create`, `createdAt == request.time && updatedAt == request.time`. On `update`, `createdAt == existing().createdAt`, `uid == existing().uid` (or `createdBy == existing().createdBy`), and `updatedAt == request.time`.
8. **Total Array & Schema Guard Invariant**: `InspectionPeriod` documents (`/periods/{periodId}`) must strictly match required/allowed keys (`hasAll` and `hasOnly`), enforce `orgId == 'bigtree_outdoor'`, constrain `zones` to a bounded list (`zones is list && zones.size() >= 1 && zones.size() <= 50 && zones[0] is map`), and verify `updatedBy == request.auth.uid`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

### Payload 1: Shadow Field Injection on `/periods/2026_8`
```json
{
  "periodId": "2026_8",
  "orgId": "bigtree_outdoor",
  "year": 2026,
  "month": 8,
  "zoneCount": 31,
  "zones": [{"zoneNo": 1}],
  "createdBy": "staff_uid_1",
  "updatedBy": "staff_uid_1",
  "updatedByName": "Nusir",
  "lastAction": "Initial seed",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP",
  "isVerifiedOverride": true
}
```
*Expected Result*: `PERMISSION_DENIED` (Rejected by `hasOnly` strict key validation).

### Payload 2: Identity Spoofing (`createdBy` / `updatedBy` mismatch) on `/periods/2026_8`
```json
{
  "periodId": "2026_8",
  "orgId": "bigtree_outdoor",
  "year": 2026,
  "month": 8,
  "zoneCount": 31,
  "zones": [{"zoneNo": 1}],
  "createdBy": "spoofed_other_user_uid",
  "updatedBy": "spoofed_other_user_uid",
  "updatedByName": "Spoofer",
  "lastAction": "Spoof write",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP"
}
```
*Expected Result*: `PERMISSION_DENIED` (Rejected because `updatedBy != request.auth.uid` and `createdBy != request.auth.uid`).

### Payload 3: Unverified Email Spoof Attack on Admin Account (`addy@bigtree.com.my`, `email_verified: false`)
```json
{
  "uid": "attacker_uid",
  "grantedBy": "attacker_uid",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP"
}
```
*Expected Result*: `PERMISSION_DENIED` (Rejected because `request.auth.token.email_verified == true` is mandatory).

### Payload 4: Privilege Escalation — Self-Assigning `'Admin'` Role in `/staff_profiles/{userId}`
```json
{
  "uid": "regular_staff_uid",
  "displayName": "Nusir",
  "staffRole": "Admin",
  "department": "Operations",
  "assignedInspectorName": "Nusir",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP"
}
```
*Expected Result*: `PERMISSION_DENIED` (Non-admin users are forbidden from setting `staffRole == 'Admin'`).

### Payload 5: Cross-User PII Read on `/staff_private/{otherUserId}`
```json
{
  "operation": "get",
  "path": "/staff_private/victim_staff_uid",
  "auth": { "uid": "curious_staff_uid", "email_verified": true }
}
```
*Expected Result*: `PERMISSION_DENIED` (PII read restricted strictly to `isOwner(userId) || isAdmin()`).

### Payload 6: Orphaned Private Info Write Without Public Profile (`existsAfter` Violation)
```json
{
  "uid": "staff_uid_2",
  "email": "yana@bigtree.com.my",
  "lastLoginLabel": "2026-08-10 09:00",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP"
}
```
*Expected Result*: `PERMISSION_DENIED` when `/staff_profiles/staff_uid_2` does not exist after the write batch.

### Payload 7: Immortal Field Mutation (`createdBy` / `createdAt` Tampering on Update)
```json
{
  "periodId": "2026_8",
  "orgId": "bigtree_outdoor",
  "year": 2026,
  "month": 8,
  "zoneCount": 31,
  "zones": [{"zoneNo": 1}],
  "createdBy": "hijacked_creator_uid",
  "updatedBy": "staff_uid_1",
  "updatedByName": "Nusir",
  "lastAction": "Tampered creator",
  "createdAt": "2020-01-01T00:00:00Z",
  "updatedAt": "SERVER_TIMESTAMP"
}
```
*Expected Result*: `PERMISSION_DENIED` (`createdBy` and `createdAt` must equal `existing()`).

### Payload 8: Forged Client Timestamp (`updatedAt` != `request.time`)
```json
{
  "uid": "staff_uid_1",
  "displayName": "Nusir",
  "staffRole": "Senior Lighting Specialist",
  "department": "Lighting Audit",
  "assignedInspectorName": "Nusir",
  "createdAt": "2026-08-01T00:00:00Z",
  "updatedAt": "2026-08-01T00:00:00Z"
}
```
*Expected Result*: `PERMISSION_DENIED` (`createdAt == request.time && updatedAt == request.time` required).

### Payload 9: Array Exhaustion / Empty Array Poisoning on `/periods/2026_8`
```json
{
  "periodId": "2026_8",
  "orgId": "bigtree_outdoor",
  "year": 2026,
  "month": 8,
  "zoneCount": 0,
  "zones": ["invalid_string_element"],
  "createdBy": "staff_uid_1",
  "updatedBy": "staff_uid_1",
  "updatedByName": "Nusir",
  "lastAction": "Poison array",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP"
}
```
*Expected Result*: `PERMISSION_DENIED` (`zones[0] is map` and `zoneCount >= 1` required).

### Payload 10: Value Poisoning — Oversized String on `lastAction` (> 120 chars)
```json
{
  "lastAction": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}
```
*Expected Result*: `PERMISSION_DENIED` (`lastAction.size() <= 120` enforced in `isValidInspectionPeriod`).

### Payload 11: Path Variable Poisoning on `/periods/{maliciousId}`
```json
{
  "path": "/periods/2026_8$malicious!id",
  "operation": "get"
}
```
*Expected Result*: `PERMISSION_DENIED` (`isValidId(periodId)` rejects characters outside `^[a-zA-Z0-9_\-]+$`).

### Payload 12: Unauthorized Collection Scraping (`list` on `/periods` or `/staff_private`)
```json
{
  "path": "/periods",
  "operation": "list",
  "auth": { "uid": "staff_uid_1", "email_verified": true }
}
```
*Expected Result*: `PERMISSION_DENIED` (`allow list: if false;` on `/periods` and `/staff_private`).

---

## 3. Security Test Suite (`firestore.rules.test.ts`)

See `/firestore.rules.test.ts` in the project root for the complete test suite verifying all 12 adversarial payloads.

/**
 * Big Tree Outdoor Lighting Inspection — Firestore Security Rules TDD Test Runner
 * Verifies that all "Dirty Dozen" adversarial payloads are rejected with PERMISSION_DENIED.
 */

export interface AuthContext {
  uid: string;
  token: {
    email?: string;
    email_verified?: boolean;
  };
}

export interface RuleEvalRequest {
  auth: AuthContext | null;
  time: string;
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  resourceData?: Record<string, unknown>;
  existingData?: Record<string, unknown>;
  staffProfileExistsAfter?: boolean;
  isAdminDocExists?: boolean;
}

const ID_REGEX = /^[a-zA-Z0-9_\-]+$/;
const STAFF_ROLES = [
  'Admin',
  'Senior Lighting Specialist',
  'Field Inspection Engineer',
  'Infrastructure Maintenance Tech',
  'Highways & Expressways Specialist',
  'Regional Audit Lead',
  'Staff Inspector',
];

function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && ID_REGEX.test(id);
}

function isSignedIn(req: RuleEvalRequest): boolean {
  return req.auth !== null;
}

function isVerifiedUser(req: RuleEvalRequest): boolean {
  return isSignedIn(req) && req.auth?.token?.email_verified === true;
}

function isAdmin(req: RuleEvalRequest): boolean {
  return (
    isSignedIn(req) &&
    ((req.auth?.token?.email === 'addy@bigtree.com.my' && req.auth?.token?.email_verified === true) ||
      req.isAdminDocExists === true)
  );
}

function hasAllAndOnlyKeys(data: Record<string, unknown>, keys: string[]): boolean {
  const actualKeys = Object.keys(data);
  if (actualKeys.length !== keys.length) return false;
  return keys.every((k) => Object.prototype.hasOwnProperty.call(data, k));
}

function isValidAdminRecord(data: Record<string, unknown>, req: RuleEvalRequest): boolean {
  return (
    hasAllAndOnlyKeys(data, ['uid', 'grantedBy', 'createdAt', 'updatedAt']) &&
    typeof data.uid === 'string' &&
    data.uid.length >= 1 &&
    data.uid.length <= 128 &&
    ID_REGEX.test(data.uid) &&
    typeof data.grantedBy === 'string' &&
    data.grantedBy.length >= 1 &&
    data.grantedBy.length <= 128 &&
    ID_REGEX.test(data.grantedBy) &&
    data.grantedBy === req.auth?.uid
  );
}

function isValidStaffPublicProfile(data: Record<string, unknown>, req: RuleEvalRequest): boolean {
  return (
    hasAllAndOnlyKeys(data, [
      'uid',
      'displayName',
      'staffRole',
      'department',
      'assignedInspectorName',
      'createdAt',
      'updatedAt',
    ]) &&
    typeof data.uid === 'string' &&
    data.uid.length >= 1 &&
    data.uid.length <= 128 &&
    ID_REGEX.test(data.uid) &&
    data.uid === req.auth?.uid &&
    typeof data.displayName === 'string' &&
    data.displayName.length >= 1 &&
    data.displayName.length <= 100 &&
    typeof data.staffRole === 'string' &&
    data.staffRole.length >= 1 &&
    data.staffRole.length <= 60 &&
    STAFF_ROLES.includes(data.staffRole) &&
    typeof data.department === 'string' &&
    data.department.length >= 1 &&
    data.department.length <= 100 &&
    typeof data.assignedInspectorName === 'string' &&
    data.assignedInspectorName.length >= 1 &&
    data.assignedInspectorName.length <= 60
  );
}

function isValidStaffPrivateInfo(data: Record<string, unknown>, req: RuleEvalRequest): boolean {
  return (
    hasAllAndOnlyKeys(data, ['uid', 'email', 'lastLoginLabel', 'createdAt', 'updatedAt']) &&
    typeof data.uid === 'string' &&
    data.uid.length >= 1 &&
    data.uid.length <= 128 &&
    ID_REGEX.test(data.uid) &&
    data.uid === req.auth?.uid &&
    typeof data.email === 'string' &&
    data.email.length >= 3 &&
    data.email.length <= 150 &&
    typeof data.lastLoginLabel === 'string' &&
    data.lastLoginLabel.length >= 1 &&
    data.lastLoginLabel.length <= 80
  );
}

function isValidInspectionPeriod(data: Record<string, unknown>, req: RuleEvalRequest): boolean {
  return (
    hasAllAndOnlyKeys(data, [
      'periodId',
      'orgId',
      'year',
      'month',
      'zoneCount',
      'zones',
      'createdBy',
      'updatedBy',
      'updatedByName',
      'lastAction',
      'createdAt',
      'updatedAt',
    ]) &&
    typeof data.periodId === 'string' &&
    data.periodId.length >= 5 &&
    data.periodId.length <= 20 &&
    ID_REGEX.test(data.periodId) &&
    typeof data.orgId === 'string' &&
    data.orgId.length >= 1 &&
    data.orgId.length <= 40 &&
    data.orgId === 'bigtree_outdoor' &&
    typeof data.year === 'number' &&
    data.year >= 2020 &&
    data.year <= 2035 &&
    typeof data.month === 'number' &&
    data.month >= 1 &&
    data.month <= 12 &&
    typeof data.zoneCount === 'number' &&
    data.zoneCount >= 1 &&
    data.zoneCount <= 50 &&
    Array.isArray(data.zones) &&
    data.zones.length >= 1 &&
    data.zones.length <= 50 &&
    typeof data.zones[0] === 'object' &&
    data.zones[0] !== null &&
    !Array.isArray(data.zones[0]) &&
    typeof data.createdBy === 'string' &&
    data.createdBy.length >= 1 &&
    data.createdBy.length <= 128 &&
    ID_REGEX.test(data.createdBy) &&
    typeof data.updatedBy === 'string' &&
    data.updatedBy.length >= 1 &&
    data.updatedBy.length <= 128 &&
    ID_REGEX.test(data.updatedBy) &&
    data.updatedBy === req.auth?.uid &&
    typeof data.updatedByName === 'string' &&
    data.updatedByName.length >= 1 &&
    data.updatedByName.length <= 100 &&
    typeof data.lastAction === 'string' &&
    data.lastAction.length >= 1 &&
    data.lastAction.length <= 120
  );
}

export function evaluateRule(req: RuleEvalRequest): 'ALLOWED' | 'PERMISSION_DENIED' {
  const segments = req.path.split('/').filter(Boolean);
  if (segments.length === 1) {
    // Collection list operations
    if (req.operation === 'list') {
      return 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  const [collectionName, docId] = segments;
  const data = req.resourceData || {};
  const existing = req.existingData || {};

  if (collectionName === 'admins') {
    if (req.operation === 'get') {
      return isSignedIn(req) && isValidId(docId) && (req.auth?.uid === docId || isAdmin(req))
        ? 'ALLOWED'
        : 'PERMISSION_DENIED';
    }
    if (req.operation === 'create') {
      return isSignedIn(req) &&
        isVerifiedUser(req) &&
        isValidId(docId) &&
        isValidAdminRecord(data, req) &&
        data.uid === docId &&
        data.createdAt === req.time &&
        data.updatedAt === req.time &&
        isAdmin(req)
        ? 'ALLOWED'
        : 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  if (collectionName === 'staff_profiles') {
    if (req.operation === 'get') {
      return isSignedIn(req) && isVerifiedUser(req) && isValidId(docId) ? 'ALLOWED' : 'PERMISSION_DENIED';
    }
    if (req.operation === 'create') {
      return isSignedIn(req) &&
        isVerifiedUser(req) &&
        isValidId(docId) &&
        req.auth?.uid === docId &&
        isValidStaffPublicProfile(data, req) &&
        data.createdAt === req.time &&
        data.updatedAt === req.time &&
        (data.staffRole !== 'Admin' || isAdmin(req))
        ? 'ALLOWED'
        : 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  if (collectionName === 'staff_private') {
    if (req.operation === 'get') {
      return isSignedIn(req) &&
        isVerifiedUser(req) &&
        isValidId(docId) &&
        (req.auth?.uid === docId || isAdmin(req))
        ? 'ALLOWED'
        : 'PERMISSION_DENIED';
    }
    if (req.operation === 'create') {
      return isSignedIn(req) &&
        isVerifiedUser(req) &&
        isValidId(docId) &&
        req.auth?.uid === docId &&
        isValidStaffPrivateInfo(data, req) &&
        data.createdAt === req.time &&
        data.updatedAt === req.time &&
        req.staffProfileExistsAfter === true
        ? 'ALLOWED'
        : 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  if (collectionName === 'periods') {
    if (req.operation === 'get') {
      return isSignedIn(req) && isVerifiedUser(req) && isValidId(docId) ? 'ALLOWED' : 'PERMISSION_DENIED';
    }
    if (req.operation === 'create') {
      return isSignedIn(req) &&
        isVerifiedUser(req) &&
        isValidId(docId) &&
        isValidInspectionPeriod(data, req) &&
        data.periodId === docId &&
        data.createdBy === req.auth?.uid &&
        data.createdAt === req.time &&
        data.updatedAt === req.time
        ? 'ALLOWED'
        : 'PERMISSION_DENIED';
    }
    if (req.operation === 'update') {
      return isSignedIn(req) &&
        isVerifiedUser(req) &&
        isValidId(docId) &&
        isValidInspectionPeriod(data, req) &&
        data.periodId === existing.periodId &&
        data.orgId === existing.orgId &&
        data.year === existing.year &&
        data.month === existing.month &&
        data.createdBy === existing.createdBy &&
        data.createdAt === existing.createdAt &&
        data.updatedAt === req.time
        ? 'ALLOWED'
        : 'PERMISSION_DENIED';
    }
    return 'PERMISSION_DENIED';
  }

  return 'PERMISSION_DENIED';
}

export function runDirtyDozenSecurityTests(): { passed: number; failed: number } {
  const serverNow = '2026-08-15T10:00:00Z';
  const verifiedStaffAuth: AuthContext = {
    uid: 'staff_uid_1',
    token: { email: 'nusir@bigtree.com.my', email_verified: true },
  };

  const dirtyDozenTests: { name: string; req: RuleEvalRequest }[] = [
    {
      name: '1. Shadow Field Injection on /periods/2026_8',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/periods/2026_8',
        operation: 'create',
        resourceData: {
          periodId: '2026_8',
          orgId: 'bigtree_outdoor',
          year: 2026,
          month: 8,
          zoneCount: 31,
          zones: [{ zoneNo: 1 }],
          createdBy: 'staff_uid_1',
          updatedBy: 'staff_uid_1',
          updatedByName: 'Nusir',
          lastAction: 'Init',
          createdAt: serverNow,
          updatedAt: serverNow,
          ghostField: true,
        },
      },
    },
    {
      name: '2. Identity Spoofing (createdBy/updatedBy mismatch)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/periods/2026_8',
        operation: 'create',
        resourceData: {
          periodId: '2026_8',
          orgId: 'bigtree_outdoor',
          year: 2026,
          month: 8,
          zoneCount: 31,
          zones: [{ zoneNo: 1 }],
          createdBy: 'spoofed_uid',
          updatedBy: 'spoofed_uid',
          updatedByName: 'Nusir',
          lastAction: 'Init',
          createdAt: serverNow,
          updatedAt: serverNow,
        },
      },
    },
    {
      name: '3. Unverified Email Spoof Attack on Admin',
      req: {
        auth: {
          uid: 'attacker_uid',
          token: { email: 'addy@bigtree.com.my', email_verified: false },
        },
        time: serverNow,
        path: '/admins/attacker_uid',
        operation: 'create',
        resourceData: {
          uid: 'attacker_uid',
          grantedBy: 'attacker_uid',
          createdAt: serverNow,
          updatedAt: serverNow,
        },
      },
    },
    {
      name: '4. Privilege Escalation (Self-Assigning Admin Role)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/staff_profiles/staff_uid_1',
        operation: 'create',
        resourceData: {
          uid: 'staff_uid_1',
          displayName: 'Nusir',
          staffRole: 'Admin',
          department: 'Audit',
          assignedInspectorName: 'Nusir',
          createdAt: serverNow,
          updatedAt: serverNow,
        },
      },
    },
    {
      name: '5. Cross-User PII Read on /staff_private/victim_uid',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/staff_private/victim_uid',
        operation: 'get',
      },
    },
    {
      name: '6. Orphaned Private Info Write Without Public Profile (existsAfter)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/staff_private/staff_uid_1',
        operation: 'create',
        staffProfileExistsAfter: false,
        resourceData: {
          uid: 'staff_uid_1',
          email: 'nusir@bigtree.com.my',
          lastLoginLabel: '2026-08-15',
          createdAt: serverNow,
          updatedAt: serverNow,
        },
      },
    },
    {
      name: '7. Immortal Field Mutation (createdBy Tampering on Update)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/periods/2026_8',
        operation: 'update',
        existingData: {
          periodId: '2026_8',
          orgId: 'bigtree_outdoor',
          year: 2026,
          month: 8,
          createdBy: 'original_creator_uid',
          createdAt: '2026-08-01T00:00:00Z',
        },
        resourceData: {
          periodId: '2026_8',
          orgId: 'bigtree_outdoor',
          year: 2026,
          month: 8,
          zoneCount: 31,
          zones: [{ zoneNo: 1 }],
          createdBy: 'staff_uid_1',
          updatedBy: 'staff_uid_1',
          updatedByName: 'Nusir',
          lastAction: 'Update',
          createdAt: '2026-08-01T00:00:00Z',
          updatedAt: serverNow,
        },
      },
    },
    {
      name: '8. Forged Client Timestamp (updatedAt != request.time)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/staff_profiles/staff_uid_1',
        operation: 'create',
        resourceData: {
          uid: 'staff_uid_1',
          displayName: 'Nusir',
          staffRole: 'Senior Lighting Specialist',
          department: 'Audit',
          assignedInspectorName: 'Nusir',
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2020-01-01T00:00:00Z',
        },
      },
    },
    {
      name: '9. Array Poisoning (Non-map element in zones array)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/periods/2026_8',
        operation: 'create',
        resourceData: {
          periodId: '2026_8',
          orgId: 'bigtree_outdoor',
          year: 2026,
          month: 8,
          zoneCount: 1,
          zones: ['not_a_map'],
          createdBy: 'staff_uid_1',
          updatedBy: 'staff_uid_1',
          updatedByName: 'Nusir',
          lastAction: 'Init',
          createdAt: serverNow,
          updatedAt: serverNow,
        },
      },
    },
    {
      name: '10. Value Poisoning (Oversized string > 120 chars on lastAction)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/periods/2026_8',
        operation: 'create',
        resourceData: {
          periodId: '2026_8',
          orgId: 'bigtree_outdoor',
          year: 2026,
          month: 8,
          zoneCount: 31,
          zones: [{ zoneNo: 1 }],
          createdBy: 'staff_uid_1',
          updatedBy: 'staff_uid_1',
          updatedByName: 'Nusir',
          lastAction: 'X'.repeat(200),
          createdAt: serverNow,
          updatedAt: serverNow,
        },
      },
    },
    {
      name: '11. Path Variable Poisoning on /periods/2026_8$bad!',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/periods/2026_8$bad!',
        operation: 'get',
      },
    },
    {
      name: '12. Unauthorized Collection Scraping (list on /periods)',
      req: {
        auth: verifiedStaffAuth,
        time: serverNow,
        path: '/periods',
        operation: 'list',
      },
    },
  ];

  let passed = 0;
  let failed = 0;
  for (const test of dirtyDozenTests) {
    const res = evaluateRule(test.req);
    if (res === 'PERMISSION_DENIED') {
      passed++;
    } else {
      failed++;
      console.error(`FAILED: ${test.name} returned ${res}`);
    }
  }
  return { passed, failed };
}

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ZoneData } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// ============================================================================
// Validate Connection to Firestore on Boot
// ============================================================================
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// ============================================================================
// Structured Firestore Error Handler (Mandatory Skill Pattern)
// ============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// Defensive Sanitization & Blueprint Constraint Helpers
// ============================================================================
const ID_PATTERN = /^[a-zA-Z0-9_\-]+$/;

export function sanitizeId(id: string, maxLen = 128): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, maxLen);
  return cleaned.length > 0 ? cleaned : 'default_id';
}

export function sanitizeString(val: string | undefined | null, fallback: string, maxLen: number): string {
  const trimmed = (val || '').trim();
  const nonEmpty = trimmed.length > 0 ? trimmed : fallback;
  return nonEmpty.slice(0, maxLen);
}

/**
 * Recursively strips `undefined` values so Firestore never throws on optional fields.
 */
export function sanitizeForFirestore<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof value === 'object' && !(value instanceof Timestamp)) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        result[k] = sanitizeForFirestore(v);
      }
    }
    return result as T;
  }
  return value;
}

// ============================================================================
// Staff Profile Types & Helpers
// ============================================================================
export type StaffRoleType =
  | 'Admin'
  | 'Senior Lighting Specialist'
  | 'Field Inspection Engineer'
  | 'Infrastructure Maintenance Tech'
  | 'Highways & Expressways Specialist'
  | 'Regional Audit Lead'
  | 'Staff Inspector';

export const ALLOWED_STAFF_ROLES: StaffRoleType[] = [
  'Admin',
  'Senior Lighting Specialist',
  'Field Inspection Engineer',
  'Infrastructure Maintenance Tech',
  'Highways & Expressways Specialist',
  'Regional Audit Lead',
  'Staff Inspector',
];

export interface StaffPublicProfile {
  uid: string;
  displayName: string;
  staffRole: StaffRoleType;
  department: string;
  assignedInspectorName: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PeriodCloudMetadata {
  periodId: string;
  updatedBy: string;
  updatedByName: string;
  lastAction: string;
  updatedAtIso?: string;
}

function inferInspectorFromUser(email?: string | null, displayName?: string | null): {
  inspectorName: string;
  defaultRole: StaffRoleType;
} {
  const combined = `${email || ''} ${displayName || ''}`.toLowerCase();
  if (email?.toLowerCase() === 'addy@bigtree.com.my') {
    return { inspectorName: 'All Zones (Admin)', defaultRole: 'Admin' };
  }
  if (combined.includes('nusir')) {
    return { inspectorName: 'Nusir', defaultRole: 'Senior Lighting Specialist' };
  }
  if (combined.includes('yana')) {
    return { inspectorName: 'Yana', defaultRole: 'Field Inspection Engineer' };
  }
  if (combined.includes('fadrul')) {
    return { inspectorName: 'Fadrul', defaultRole: 'Infrastructure Maintenance Tech' };
  }
  if (combined.includes('asyaqif')) {
    return { inspectorName: 'Asyaqif', defaultRole: 'Highways & Expressways Specialist' };
  }
  if (combined.includes('ray')) {
    return { inspectorName: 'Ray', defaultRole: 'Regional Audit Lead' };
  }
  return { inspectorName: 'All Zones', defaultRole: 'Staff Inspector' };
}

// ============================================================================
// Authentication (Google Sign-In & Sign-Out)
// ============================================================================
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  if (result.user) {
    await syncStaffProfileOnLogin(result.user);
  }
  return result;
};

export const logout = async () => {
  await signOut(auth);
};

/**
 * Atomically creates or updates `/staff_profiles/{uid}` (non-PII) and `/staff_private/{uid}` (PII)
 * in a single batch so `existsAfter` security rule invariant is always satisfied.
 */
export const syncStaffProfileOnLogin = async (user: User): Promise<StaffPublicProfile | null> => {
  if (!user?.uid || !ID_PATTERN.test(user.uid)) return null;

  const uid = sanitizeId(user.uid, 128);
  const publicPath = `staff_profiles/${uid}`;
  const privatePath = `staff_private/${uid}`;
  const publicRef = doc(db, 'staff_profiles', uid);
  const privateRef = doc(db, 'staff_private', uid);

  try {
    const [pubSnap, privSnap] = await Promise.all([getDoc(publicRef), getDoc(privateRef)]);
    const { inspectorName, defaultRole } = inferInspectorFromUser(user.email, user.displayName);
    const displayName = sanitizeString(
      user.displayName || user.email?.split('@')[0],
      'Big Tree Staff',
      100
    );
    const emailStr = sanitizeString(user.email, 'staff@bigtree.com.my', 150);
    const nowLabel = sanitizeString(new Date().toLocaleString('en-MY'), 'Active Session', 80);

    const batch = writeBatch(db);

    let profileResult: StaffPublicProfile;

    if (!pubSnap.exists()) {
      profileResult = {
        uid,
        displayName,
        staffRole: defaultRole,
        department: 'Big Tree Outdoor — Infrastructure & Lighting Audit',
        assignedInspectorName: sanitizeString(inspectorName, 'All Zones', 60),
      };
      batch.set(publicRef, {
        ...profileResult,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const existingPub = pubSnap.data() as StaffPublicProfile;
      profileResult = {
        uid: existingPub.uid,
        displayName: sanitizeString(existingPub.displayName || displayName, 'Big Tree Staff', 100),
        staffRole: ALLOWED_STAFF_ROLES.includes(existingPub.staffRole)
          ? existingPub.staffRole
          : defaultRole,
        department: sanitizeString(
          existingPub.department,
          'Big Tree Outdoor — Infrastructure & Lighting Audit',
          100
        ),
        assignedInspectorName: sanitizeString(
          existingPub.assignedInspectorName || inspectorName,
          'All Zones',
          60
        ),
      };
      batch.update(publicRef, {
        displayName: profileResult.displayName,
        department: profileResult.department,
        assignedInspectorName: profileResult.assignedInspectorName,
        updatedAt: serverTimestamp(),
      });
    }

    if (!privSnap.exists()) {
      batch.set(privateRef, {
        uid,
        email: emailStr,
        lastLoginLabel: nowLabel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.update(privateRef, {
        email: emailStr,
        lastLoginLabel: nowLabel,
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    return profileResult;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${publicPath} & ${privatePath}`);
  }
};

export const subscribeToStaffProfile = (
  userId: string,
  callback: (profile: StaffPublicProfile | null) => void
) => {
  const uid = sanitizeId(userId, 128);
  const path = `staff_profiles/${uid}`;
  const ref = doc(db, 'staff_profiles', uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as StaffPublicProfile);
      } else {
        callback(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};

export const updateStaffProfileDetails = async (
  userId: string,
  updates: {
    displayName: string;
    staffRole: StaffRoleType;
    department: string;
    assignedInspectorName: string;
  }
) => {
  const uid = sanitizeId(userId, 128);
  const path = `staff_profiles/${uid}`;
  const ref = doc(db, 'staff_profiles', uid);
  const isUserAdmin = auth.currentUser?.email?.toLowerCase() === 'addy@bigtree.com.my';
  const safeRole: StaffRoleType =
    updates.staffRole === 'Admin' && !isUserAdmin ? 'Staff Inspector' : updates.staffRole;

  try {
    await updateDoc(ref, {
      displayName: sanitizeString(updates.displayName, 'Big Tree Staff', 100),
      staffRole: safeRole,
      department: sanitizeString(
        updates.department,
        'Big Tree Outdoor — Infrastructure & Lighting Audit',
        100
      ),
      assignedInspectorName: sanitizeString(updates.assignedInspectorName, 'All Zones', 60),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// ============================================================================
// Inspection Period Firestore Operations (/periods/{periodId})
// ============================================================================
export const subscribeToZones = (
  year: number,
  month: number,
  callback: (zones: ZoneData[] | null, meta?: PeriodCloudMetadata) => void,
  onError?: (error: Error) => void
) => {
  const periodId = sanitizeId(`${year}_${month}`, 20);
  const path = `periods/${periodId}`;
  const periodRef = doc(db, 'periods', periodId);

  return onSnapshot(
    periodRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      const data = snapshot.data();
      const rawZones = Array.isArray(data.zones) ? (data.zones as ZoneData[]) : [];
      const sorted = [...rawZones].sort((a, b) => a.zoneNo - b.zoneNo);
      const updatedAtTs = data.updatedAt as Timestamp | undefined;
      const meta: PeriodCloudMetadata = {
        periodId: String(data.periodId || periodId),
        updatedBy: String(data.updatedBy || ''),
        updatedByName: String(data.updatedByName || 'Staff'),
        lastAction: String(data.lastAction || 'Synced'),
        updatedAtIso: updatedAtTs?.toDate ? updatedAtTs.toDate().toLocaleString('en-MY') : undefined,
      };
      callback(sorted, meta);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};

export const saveZonesToFirestore = async (
  year: number,
  month: number,
  zones: ZoneData[],
  actionDescription = 'Updated inspection period schedule'
) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const periodId = sanitizeId(`${year}_${month}`, 20);
  const path = `periods/${periodId}`;
  const periodRef = doc(db, 'periods', periodId);

  const boundedZones = sanitizeForFirestore(zones.slice(0, 50));
  if (boundedZones.length === 0) return;

  const safeYear = Math.min(2035, Math.max(2020, Math.round(year)));
  const safeMonth = Math.min(12, Math.max(1, Math.round(month)));
  const uid = sanitizeId(currentUser.uid, 128);
  const userName = sanitizeString(
    currentUser.displayName || currentUser.email?.split('@')[0],
    'Big Tree Staff',
    100
  );
  const safeAction = sanitizeString(actionDescription, 'Updated inspection schedule', 120);

  try {
    const existingSnap = await getDoc(periodRef);
    if (!existingSnap.exists()) {
      await setDoc(periodRef, {
        periodId,
        orgId: 'bigtree_outdoor',
        year: safeYear,
        month: safeMonth,
        zoneCount: boundedZones.length,
        zones: boundedZones,
        createdBy: uid,
        updatedBy: uid,
        updatedByName: userName,
        lastAction: safeAction,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(periodRef, {
        zoneCount: boundedZones.length,
        zones: boundedZones,
        updatedBy: uid,
        updatedByName: userName,
        lastAction: safeAction,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const saveZoneToFirestore = async (
  year: number,
  month: number,
  updatedZone: ZoneData,
  allZones?: ZoneData[]
) => {
  const periodId = sanitizeId(`${year}_${month}`, 20);
  const path = `periods/${periodId}`;
  const periodRef = doc(db, 'periods', periodId);

  try {
    let baseZones = allZones;
    if (!baseZones || baseZones.length === 0) {
      const snap = await getDoc(periodRef);
      baseZones = snap.exists() && Array.isArray(snap.data().zones) ? (snap.data().zones as ZoneData[]) : [];
    }
    const existsInList = baseZones.some((z) => z.zoneNo === updatedZone.zoneNo || z.id === updatedZone.id);
    const mergedZones = existsInList
      ? baseZones.map((z) =>
          z.zoneNo === updatedZone.zoneNo || z.id === updatedZone.id ? updatedZone : z
        )
      : [...baseZones, updatedZone];

    mergedZones.sort((a, b) => a.zoneNo - b.zoneNo);
    await saveZonesToFirestore(
      year,
      month,
      mergedZones,
      `Updated Zone ${updatedZone.zoneNo} (${updatedZone.status})`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const resetDataInFirestore = async (
  year: number,
  month: number,
  initialZones: ZoneData[]
) => {
  await saveZonesToFirestore(year, month, initialZones, 'Reset period schedule to default dataset');
};

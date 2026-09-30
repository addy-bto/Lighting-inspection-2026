import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  LogOut,
  Save,
  Database,
  CheckCircle2,
  Building2,
  Mail,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  StaffPublicProfile,
  StaffRoleType,
  ALLOWED_STAFF_ROLES,
  updateStaffProfileDetails,
  PeriodCloudMetadata,
} from '../lib/firebase';

interface StaffProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  staffProfile: StaffPublicProfile | null;
  cloudMeta?: PeriodCloudMetadata | null;
  onSignOut: () => void;
  onFilterMyZones?: (inspectorName: string) => void;
  onForceCloudSync?: () => Promise<void>;
}

const INSPECTOR_OPTIONS = ['All Zones', 'Nusir', 'Yana', 'Fadrul', 'Asyaqif', 'Ray'];

export const StaffProfileModal: React.FC<StaffProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  staffProfile,
  cloudMeta,
  onSignOut,
  onFilterMyZones,
  onForceCloudSync,
}) => {
  const isUserAdmin = user.email?.toLowerCase() === 'addy@bigtree.com.my';

  const [displayName, setDisplayName] = useState(
    staffProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Big Tree Staff'
  );
  const [staffRole, setStaffRole] = useState<StaffRoleType>(
    staffProfile?.staffRole || (isUserAdmin ? 'Admin' : 'Staff Inspector')
  );
  const [department, setDepartment] = useState(
    staffProfile?.department || 'Big Tree Outdoor — Infrastructure & Lighting Audit'
  );
  const [assignedInspectorName, setAssignedInspectorName] = useState(
    staffProfile?.assignedInspectorName || 'All Zones'
  );
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (staffProfile) {
      setDisplayName(staffProfile.displayName);
      setStaffRole(staffProfile.staffRole);
      setDepartment(staffProfile.department);
      setAssignedInspectorName(staffProfile.assignedInspectorName);
    }
  }, [staffProfile]);

  if (!isOpen) return null;

  const availableRoles = isUserAdmin
    ? ALLOWED_STAFF_ROLES
    : ALLOWED_STAFF_ROLES.filter((r) => r !== 'Admin');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotice(null);
      await updateStaffProfileDetails(user.uid, {
        displayName,
        staffRole,
        department,
        assignedInspectorName,
      });
      setNotice('Profil staf berjaya dikemaskini dalam Firebase Cloud!');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: unknown) {
      console.error('Failed to update staff profile:', err);
      setNotice('Ralat semasa menyimpan profil staf.');
    } finally {
      setSaving(false);
    }
  };

  const handleManualSync = async () => {
    if (!onForceCloudSync) return;
    try {
      setSyncing(true);
      await onForceCloudSync();
      setNotice('Semua data pemeriksaan telah disegerakkan ke Firebase Firestore!');
      setTimeout(() => setNotice(null), 3500);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#032014] border-2 border-emerald-500/50 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="bg-[#02180f] px-6 py-4 border-b border-emerald-800/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-400/50 flex items-center justify-center text-amber-400 font-black">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                FIREBASE STAFF ACCESS & CLOUD SYNC
              </span>
              <h3 className="text-base font-black text-white">Profil Staf & Status Pangkalan Data</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-900/60 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
          {/* Active Account Summary */}
          <div className="bg-[#02150d] border border-emerald-700/50 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-11 h-11 rounded-xl border border-emerald-400/60 object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-emerald-800 text-amber-300 font-black flex items-center justify-center text-sm border border-emerald-500/50 shrink-0">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white truncate">{displayName}</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-900 text-emerald-300 border border-emerald-600/50">
                    {staffRole}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-300/80 truncate mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified
            </span>
          </div>

          {notice && (
            <div className="p-3 bg-emerald-900/70 border border-emerald-400/50 rounded-xl text-xs font-bold text-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {/* Editable Staff Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                Nama Paparan Staf
              </label>
              <input
                type="text"
                value={displayName}
                maxLength={100}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#042416] border border-emerald-600/50 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                Jawatan Operasi
              </label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as StaffRoleType)}
                className="w-full bg-[#042416] border border-emerald-600/50 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role} className="bg-[#042416] text-white">
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                Jadual Pemeriksa Lapangan (Roster)
              </label>
              <select
                value={assignedInspectorName}
                onChange={(e) => setAssignedInspectorName(e.target.value)}
                className="w-full bg-[#042416] border border-emerald-600/50 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {INSPECTOR_OPTIONS.map((insp) => (
                  <option key={insp} value={insp} className="bg-[#042416] text-white">
                    {insp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                Unit / Jabatan
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={department}
                  maxLength={100}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#042416] border border-emerald-600/50 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cloud Database Status Box */}
          <div className="bg-[#02150d] border border-emerald-800/70 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Status Pangkalan Data Firebase Firestore</span>
              </div>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={syncing}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/50 text-[11px] font-bold transition cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Sekarang'}</span>
              </button>
            </div>
            {cloudMeta ? (
              <div className="text-[11px] text-emerald-200/80 space-y-0.5">
                <p>
                  Kemaskini Terakhir oleh:{' '}
                  <strong className="text-white">{cloudMeta.updatedByName}</strong> (
                  {cloudMeta.updatedAtIso || 'Masa nyata'})
                </p>
                <p>
                  Tindakan: <span className="text-amber-300 font-semibold">{cloudMeta.lastAction}</span>
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-200/80">
                Disambungkan secara masa nyata dengan koleksi <code className="text-amber-300">/periods</code>.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-emerald-800/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-500/50 text-xs font-extrabold transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out Akaun</span>
              </button>

              {onFilterMyZones && assignedInspectorName !== 'All Zones' && (
                <button
                  type="button"
                  onClick={() => {
                    onFilterMyZones(assignedInspectorName);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-400/40 text-xs font-bold transition cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Tapis Zon {assignedInspectorName}</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

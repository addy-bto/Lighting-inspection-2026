import React, { useState } from 'react';
import { Lock, KeyRound, CheckCircle2, AlertCircle, RotateCcw, X, ShieldAlert } from 'lucide-react';
import { ViewMode } from './Header';

interface PasscodeModalProps {
  isOpen: boolean;
  targetView: ViewMode | null;
  onClose: () => void;
  onUnlock: (view: ViewMode, unlockAll?: boolean) => void;
  onResetLocks: () => void;
}

const VIEW_TITLES: Record<ViewMode, string> = {
  dashboard: 'Executive Dashboard',
  table: 'Schedule Table (31 Zones)',
  map: 'Billboard Map (31 Zones)',
  roster: 'Inspectors & Workload',
  analytics: 'Analytics & Metrics',
  checklist: 'Checklist Form (W2 & W4)',
  report: 'Formal Report (PDF)',
};

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  targetView,
  onClose,
  onUnlock,
  onResetLocks,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !targetView) return null;

  const targetTitle = VIEW_TITLES[targetView] || targetView;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPasscode = passcode.trim();

    if (cleanPasscode === '123456' || cleanPasscode === '171171') {
      setError(null);
      setSuccess(`Passcode Verified! Access granted to ${targetTitle}.`);
      setTimeout(() => {
        onUnlock(targetView, true); // Unlock all tabs
        setPasscode('');
        setSuccess(null);
        onClose();
      }, 400);
    } else {
      setError('Invalid passcode! Please enter a valid security passcode to unlock access.');
      setSuccess(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
              Security Authentication
            </span>
            <h2 className="text-lg font-extrabold text-white mt-0.5">
              Locked View: {targetTitle}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          Please enter the security passcode to unlock the{' '}
          <strong className="text-amber-300">{targetTitle}</strong> section.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Passcode:
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(null);
              }}
              placeholder="Enter security passcode..."
              autoFocus
              className="w-full bg-slate-950 text-amber-300 font-mono text-center tracking-widest font-extrabold text-lg rounded-xl px-4 py-3 border-2 border-slate-700 focus:border-amber-400 focus:outline-none transition shadow-inner placeholder:text-slate-600 placeholder:text-xs placeholder:font-sans placeholder:tracking-normal"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs p-3 rounded-xl animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs p-3 rounded-xl animate-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl py-2.5 px-4 text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify & Unlock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

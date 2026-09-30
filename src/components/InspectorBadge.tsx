import React from 'react';
import { INSPECTORS } from '../data/initialData';
import { InspectorName } from '../types';

interface InspectorBadgeProps {
  name: InspectorName;
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
}

export const InspectorBadge: React.FC<InspectorBadgeProps> = ({ name, size = 'md', showRole = false }) => {
  const inspector = INSPECTORS[name] || {
    name,
    role: 'Inspector',
    color: {
      bg: 'bg-slate-100 text-slate-800 border-slate-200',
      text: 'text-slate-700',
      border: 'border-slate-300',
      badgeBg: 'bg-slate-200 text-slate-800',
      hex: '#64748b',
    },
  };

  const initial = name.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  const avatarSizes = {
    sm: 'w-3.5 h-3.5 text-[9px]',
    md: 'w-4 h-4 text-[10px]',
    lg: 'w-5 h-5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${inspector.color.bg} ${inspector.color.border} ${sizeClasses[size]} transition-all shadow-2xs hover:brightness-95 cursor-default`}
      title={`${inspector.name} (${inspector.role})`}
    >
      <span
        className={`inline-flex items-center justify-center rounded-full bg-white/80 font-bold ${inspector.color.text} ${avatarSizes[size]} border border-black/5 shadow-2xs`}
      >
        {initial}
      </span>
      <span>{inspector.name}</span>
      {showRole && <span className="opacity-75 text-[10px] font-normal">({inspector.role})</span>}
    </span>
  );
};

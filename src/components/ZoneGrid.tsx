import React from 'react';
import { ChevronRight, Camera } from 'lucide-react';
import { ZoneData } from '../types';
import { InspectorBadge } from './InspectorBadge';
import { getSiteCodeRange } from '../utils/siteHelpers';
import { getMonthInfo } from '../utils/dateHelpers';

interface ZoneGridProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  onOpenWeeklyPhotoReport?: (zoneNo: number) => void;
  selectedYear?: number;
  selectedMonth?: number;
  searchQuery?: string;
}

export const ZoneGrid: React.FC<ZoneGridProps> = ({
  zones,
  onSelectZone,
  onOpenWeeklyPhotoReport,
  selectedYear = 2026,
  selectedMonth = 8,
  searchQuery = '',
}) => {
  const monthInfo = getMonthInfo(selectedYear, selectedMonth);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {zones.map((zone) => {
        const workingSites = zone.sites?.filter((s) => s.status.trim().toLowerCase() === 'lighted' || s.status.trim().toLowerCase() === 'working').length ?? (zone.siteCount - zone.defectCount);
        const progressPct = Math.round((workingSites / (zone.siteCount || 1)) * 100);

        return (
          <div
            key={zone.id}
            onClick={() => onSelectZone(zone)}
            className="bg-[#031e13]/95 rounded-2xl border border-emerald-600/30 p-5 hover:border-amber-400/60 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group backdrop-blur-md"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#01120b] text-amber-400 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                    {zone.zoneNo}
                  </span>
                  <div>
                    <h3 className="font-black text-white text-sm group-hover:text-amber-300 transition-colors line-clamp-1">
                      {zone.description}
                    </h3>
                    <span className="text-[11px] text-emerald-200/70 font-medium">{zone.region}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    zone.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : zone.status === 'In Progress'
                      ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                      : 'bg-[#01120b] text-slate-400 border-slate-700'
                  }`}
                >
                  {zone.status}
                </span>
              </div>

              {/* Site Code Range Tag */}
              <div className="my-3 bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  📍 Site Range ({zone.siteCount}):
                </span>
                <span className="font-mono font-bold text-amber-300 text-xs bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/40">
                  {getSiteCodeRange(zone)}
                </span>
              </div>

              {/* Matching Sites Pill Highlight */}
              {searchQuery.trim().length > 0 && zone.sites && (() => {
                const q = searchQuery.toLowerCase().trim();
                const matched = zone.sites.filter(
                  (s) =>
                    s.siteCode.toLowerCase().includes(q) ||
                    s.name.toLowerCase().includes(q) ||
                    s.id.toLowerCase().includes(q) ||
                    (s.notes && s.notes.toLowerCase().includes(q))
                );
                if (matched.length === 0) return null;
                return (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {matched.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/90 border border-amber-400/60 rounded px-2 py-0.5 shadow-xs"
                      >
                        <span className="font-mono underline font-extrabold">{s.siteCode}</span>: {s.name}
                      </span>
                    ))}
                  </div>
                );
              })()}

              {/* Inspector Assignments */}
              <div className="bg-[#01120b] rounded-xl p-3 my-3 border border-emerald-800/40 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider">
                    WEEK 2 ({monthInfo.week2Range})
                  </div>
                  <InspectorBadge name={zone.week2Inspector} size="sm" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider">
                    WEEK 4 ({monthInfo.week4Range})
                  </div>
                  <InspectorBadge name={zone.week4Inspector} size="sm" />
                </div>
              </div>
            </div>

            {/* Footer Metrics */}
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-1.5">
                <span>Audit Progress ({workingSites}/{zone.siteCount})</span>
                <span className="font-black text-white tabular-nums">{progressPct}%</span>
              </div>

              <div className="w-full bg-[#01120b] rounded-full h-1.5 overflow-hidden border border-emerald-900/50">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    zone.defectCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="text-[11px]">
                  {zone.defectCount > 0 ? (
                    <strong className="text-rose-300 font-bold">⚠️ {zone.defectCount} defect logged</strong>
                  ) : (
                    <span className="text-emerald-400 font-bold">✓ All lights normal</span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  {onOpenWeeklyPhotoReport && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenWeeklyPhotoReport(zone.zoneNo);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 hover:bg-amber-900 px-2 py-1 rounded-lg border border-amber-500/40 cursor-pointer transition shadow-2xs"
                      title={`Weekly Photo Report for Zone ${zone.zoneNo}`}
                    >
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>Photos</span>
                    </button>
                  )}
                  <span className="text-amber-400 font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};


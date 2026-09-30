import React from 'react';
import { MapPin, AlertTriangle, CheckCircle2, Clock, ArrowRight, FileText, Camera, Sparkles } from 'lucide-react';
import { ZoneData } from '../types';

interface MetricsCardsProps {
  zones: ZoneData[];
  onViewReport?: (mode?: 'detailed' | 'summary' | 'status_summary' | 'weekly_photos', statusFilter?: string) => void;
  onOpenWeeklyPhotoReport?: () => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ zones, onViewReport, onOpenWeeklyPhotoReport }) => {
  const totalZones = zones.length;
  
  // Calculate specific metrics
  let totalSites = 0;
  let totalInspectionsDone = 0;
  let totalDefects = 0;

  zones.forEach(z => {
    if (z.sites) {
      totalSites += z.sites.length;
      z.sites.forEach(s => {
        // Count inspections (expecting 2 per month: week 2 and week 4)
        if (s.week2Report) totalInspectionsDone++;
        if (s.week4Report) totalInspectionsDone++;

        // Count defects (if either report has an issue)
        const hasIssue = (s.week2Report && s.week2Report.status !== 'Lighted' && s.week2Report.status !== 'Partially Lit') ||
                         (s.week4Report && s.week4Report.status !== 'Lighted' && s.week4Report.status !== 'Partially Lit');
        if (hasIssue) totalDefects++;
      });
    }
  });

  const totalInspectionsRequired = totalSites * 2;
  const pendingInspections = Math.max(0, totalInspectionsRequired - totalInspectionsDone);
  const completionPct = totalInspectionsRequired > 0 ? Math.round((totalInspectionsDone / totalInspectionsRequired) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {/* 1. Total Sites */}
      <div className="bg-[#052115]/90 rounded-2xl border border-emerald-600/30 border-l-4 border-l-amber-400 p-4 shadow-xl shadow-emerald-950/40 backdrop-blur-md hover:border-amber-400/60 transition group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Total Sites</span>
            <div className="p-2 bg-amber-400/10 rounded-xl text-amber-400 border border-amber-400/20 group-hover:scale-110 transition">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tabular-nums">
              {totalSites} <span className="text-xs font-medium text-emerald-200/70">Sites</span>
            </span>
            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 tabular-nums">
              {totalZones} ZONES
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-200/70 truncate">Across all nationwide advertising corridors</p>
        </div>

        {onViewReport && (
          <div className="mt-3 pt-2.5 border-t border-emerald-900/60">
            <button
              type="button"
              onClick={() => onViewReport('summary')}
              className="w-full text-left text-[11px] font-semibold text-amber-300/90 hover:text-amber-200 flex items-center justify-between transition cursor-pointer"
            >
              <span>31 Zones Schedule Matrix</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Inspections Done (Completed & In Progress) */}
      <div className="bg-[#052115]/90 rounded-2xl border border-emerald-500/40 border-l-4 border-l-emerald-400 p-4 shadow-xl shadow-emerald-950/40 backdrop-blur-md hover:border-emerald-400/70 transition group flex flex-col justify-between ring-1 ring-emerald-500/20">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Inspections Done</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live status tracking" />
            </div>
            <div className="p-2 bg-emerald-400/10 rounded-xl text-emerald-400 border border-emerald-400/20 group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tabular-nums">
              {totalInspectionsDone} <span className="text-xs font-medium text-emerald-200/70">Audited</span>
            </span>
            <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-500/40 tabular-nums">
              {completionPct}% COMPLETE
            </span>
          </div>
          <div className="mt-2.5 w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            ></div>
          </div>
        </div>

        {(onViewReport || onOpenWeeklyPhotoReport) && (
          <div className="mt-3 pt-2.5 border-t border-emerald-900/60 space-y-1.5">
            <button
              type="button"
              onClick={() => onOpenWeeklyPhotoReport ? onOpenWeeklyPhotoReport() : onViewReport?.('weekly_photos', 'ALL')}
              className="w-full text-left text-[11px] font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-300 flex items-center justify-between transition cursor-pointer shadow-md"
              title="Generate Weekly Lighting Inspection Report with Photos for Every Week & Every Zone"
            >
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-950" />
                Weekly Photo & Status Report
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>

            {onViewReport && (
              <button
                type="button"
                onClick={() => onViewReport('status_summary', 'ALL')}
                className="w-full text-left text-[11px] font-bold text-emerald-200 hover:text-white bg-emerald-900/50 hover:bg-emerald-900/80 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 flex items-center justify-between transition cursor-pointer shadow-xs"
                title="View comprehensive zone inspection status audit report"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Zone Status Audit Report
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Pending Inspections */}
      <div className="bg-[#052115]/90 rounded-2xl border border-emerald-600/30 border-l-4 border-l-sky-400 p-4 shadow-xl shadow-emerald-950/40 backdrop-blur-md hover:border-sky-400/60 transition group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Pending Inspections</span>
            <div className="p-2 bg-sky-400/10 rounded-xl text-sky-400 border border-sky-400/20 group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tabular-nums">
              {pendingInspections} <span className="text-xs font-medium text-emerald-200/70">Remaining</span>
            </span>
            <span className="text-[10px] font-extrabold text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-500/40">
              WEEK 2 & 4
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-200/70 truncate">
            Scheduled for field technician dispatch
          </p>
        </div>

        {onViewReport && (
          <div className="mt-3 pt-2.5 border-t border-emerald-900/60">
            <button
              type="button"
              onClick={() => onViewReport('status_summary', 'In Progress')}
              className="w-full text-left text-[11px] font-semibold text-sky-300 hover:text-sky-200 flex items-center justify-between transition cursor-pointer"
            >
              <span>View In Progress & Pending Zones</span>
              <ArrowRight className="w-3 h-3 text-sky-400" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Total Defects / Issues */}
      <div className="bg-[#052115]/90 rounded-2xl border border-emerald-600/30 border-l-4 border-l-rose-500 p-4 shadow-xl shadow-emerald-950/40 backdrop-blur-md hover:border-rose-400/60 transition group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Lighting Defects</span>
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20 group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tabular-nums">
              {totalDefects} <span className="text-xs font-medium text-emerald-200/70">Issues</span>
            </span>
            <span className="text-[10px] font-extrabold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40">
              {totalDefects > 0 ? 'ACTION REQUIRED' : 'NOMINAL'}
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-200/70 truncate">
            Sites requiring electrical or lamp service
          </p>
        </div>

        {onViewReport && (
          <div className="mt-3 pt-2.5 border-t border-emerald-900/60">
            <button
              type="button"
              onClick={() => onViewReport('status_summary', 'Needs Maintenance')}
              className="w-full text-left text-[11px] font-semibold text-rose-300 hover:text-rose-200 flex items-center justify-between transition cursor-pointer"
            >
              <span>Filter Zones with Issues</span>
              <ArrowRight className="w-3 h-3 text-rose-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

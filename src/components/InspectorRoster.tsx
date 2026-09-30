import React from 'react';
import { Phone, Mail, MapPin, CheckCircle2, Shield, Calendar, Award } from 'lucide-react';
import { INSPECTORS } from '../data/initialData';
import { ZoneData } from '../types';
import { InspectorBadge } from './InspectorBadge';

interface InspectorRosterProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  onFilterByInspector?: (inspectorName: string) => void;
}

export const InspectorRoster: React.FC<InspectorRosterProps> = ({ zones, onSelectZone, onFilterByInspector }) => {
  return (
    <div className="space-y-6 my-4">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
              <Award className="w-3.5 h-3.5" /> FIELD SPECIALISTS TEAM • AUGUST 2026
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Lighting Inspectors Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              5 field specialists responsible for executing periodic inspections for Week 2 (1–15 Aug) & Week 4 (16–31 Aug) across 31 lighting zones in the Klang Valley region.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/90 rounded-xl p-3 text-center border border-slate-700 min-w-[100px]">
              <span className="block text-2xl font-bold text-emerald-400">5</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Inspectors</span>
            </div>
            <div className="bg-slate-800/90 rounded-xl p-3 text-center border border-slate-700 min-w-[100px]">
              <span className="block text-2xl font-bold text-white">278</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Sites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inspector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(INSPECTORS).map((inspector) => {
          // Calculate active workload from zone data
          const assignedZones = zones.filter(
            (z) => z.week2Inspector === inspector.name || z.week4Inspector === inspector.name
          );
          const totalAssignedSites = assignedZones.reduce((sum, z) => sum + z.siteCount, 0);
          const totalDefectsFound = assignedZones.reduce((sum, z) => sum + z.defectCount, 0);

          return (
            <div
              key={inspector.name}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Color Accent */}
                <div className={`p-4 border-b ${inspector.color.bg} ${inspector.color.border}`}>
                  <div className="flex items-center justify-between">
                    <InspectorBadge name={inspector.name} size="lg" />
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 text-slate-800 border border-slate-200 shadow-2xs">
                      {assignedZones.length} Zones
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-3">{inspector.role}</h3>
                </div>

                {/* Contact & Metrics */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inspector.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inspector.email}</span>
                    </div>
                  </div>

                  {/* Workload Stats Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <span className="block text-lg font-bold text-slate-900">{totalAssignedSites}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Monitored Sites</span>
                    </div>
                    <div>
                      <span className={`block text-lg font-bold ${totalDefectsFound > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {totalDefectsFound}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Defects Logged</span>
                    </div>
                  </div>

                  {/* Assigned Zones Pill List */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Assigned Zones ({assignedZones.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedZones.map((z) => (
                        <button
                          key={z.id}
                          onClick={() => onSelectZone(z)}
                          className="text-[11px] font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 px-2 py-1 rounded-md transition cursor-pointer border border-slate-200 line-clamp-1"
                        >
                          Z{z.zoneNo}: {z.description.replace(/Zone \d+ \(/, '').replace(/\)/, '')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Week 2 & Week 4 Schedule</span>
                {onFilterByInspector ? (
                  <button
                    onClick={() => onFilterByInspector(inspector.name)}
                    className="font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md shadow-2xs transition cursor-pointer text-[11px]"
                  >
                    Filter Zone Schedule →
                  </button>
                ) : (
                  <span className="font-semibold text-emerald-700">✓ Active Duty</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

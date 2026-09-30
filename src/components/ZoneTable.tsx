import React, { useState } from 'react';
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Filter,
  Eye,
  Camera,
} from 'lucide-react';
import { ZoneData, InspectionStatus } from '../types';
import { InspectorBadge } from './InspectorBadge';
import { getSiteCodeRange } from '../utils/siteHelpers';
import { getMonthInfo } from '../utils/dateHelpers';

interface ZoneTableProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  onEditZone?: (zone: ZoneData) => void;
  onOpenWeeklyPhotoReport?: (zoneNo: number) => void;
  selectedInspectorFilter: string;
  onInspectorFilterChange: (inspector: string) => void;
  selectedRegionFilter: string;
  onRegionFilterChange: (region: string) => void;
  selectedStatusFilter: string;
  onStatusFilterChange: (status: string) => void;
  selectedYear?: number;
  selectedMonth?: number;
  searchQuery?: string;
}

type SortField = 'zoneNo' | 'description' | 'siteCount' | 'week2Inspector' | 'week4Inspector' | 'status';

export const ZoneTable: React.FC<ZoneTableProps> = ({
  zones,
  onSelectZone,
  onOpenWeeklyPhotoReport,
  selectedInspectorFilter,
  onInspectorFilterChange,
  selectedRegionFilter,
  onRegionFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  selectedYear = 2026,
  selectedMonth = 8,
  searchQuery = '',
}) => {
  const [sortField, setSortField] = useState<SortField>('zoneNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const monthInfo = getMonthInfo(selectedYear, selectedMonth);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedZones = [...zones].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-950/80 text-blue-300 border border-blue-500/50 shadow-xs">
            <Clock className="w-3 h-3 text-blue-400" />
            In Progress
          </span>
        );
      case 'Needs Maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Issue Found
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="w-3 h-3 text-slate-400" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-[#031e13]/95 rounded-2xl border border-emerald-600/30 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Filter Bar */}
      <div className="p-4 bg-[#01120b] border-b border-emerald-800/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Filter Data ({monthInfo.monthLabelEn} {selectedYear}):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Inspector Filter */}
          <select
            value={selectedInspectorFilter}
            onChange={(e) => onInspectorFilterChange(e.target.value)}
            className="bg-[#042416] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
          >
            <option value="ALL">All Inspectors (5)</option>
            <option value="Nusir">Nusir (7 Zones)</option>
            <option value="Yana">Yana (5 Zones)</option>
            <option value="Fadrul">Fadrul (7 Zones)</option>
            <option value="Asyaqif">Asyaqif (5 Zones)</option>
            <option value="Ray">Ray (7 Zones)</option>
          </select>

          {/* Region Filter */}
          <select
            value={selectedRegionFilter}
            onChange={(e) => onRegionFilterChange(e.target.value)}
            className="bg-[#042416] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
          >
            <option value="ALL">All Regions</option>
            <option value="Kuala Lumpur / City">Kuala Lumpur / City</option>
            <option value="Highways & Expressway">Highways & Expressway</option>
            <option value="Petaling Jaya & Subang">Petaling Jaya & Subang</option>
            <option value="South & Outskirts">South & Outskirts (KLIA/Bangi)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-[#042416] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
          >
            <option value="ALL">All Lighting Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Needs Maintenance">Needs Maintenance (Has Defect)</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#02180f] text-emerald-300 font-extrabold uppercase tracking-wider border-b border-emerald-800">
              <th
                onClick={() => handleSort('zoneNo')}
                className="py-3.5 px-3 sm:px-4 cursor-pointer hover:bg-emerald-900/40 transition w-16 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>NO</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('description')}
                className="py-3.5 px-4 cursor-pointer hover:bg-emerald-900/40 transition min-w-[240px]"
              >
                <div className="flex items-center gap-1">
                  <span>DESCRIPTION (ZONE / SITE LOCATION)</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                </div>
              </th>

              <th className="py-3.5 px-3 text-center min-w-[140px]">
                <span>WEEK 2 ({monthInfo.week2Range})</span>
              </th>

              <th className="py-3.5 px-3 text-center min-w-[140px]">
                <span>WEEK 4 ({monthInfo.week4Range})</span>
              </th>

              <th
                onClick={() => handleSort('siteCount')}
                className="py-3.5 px-3 cursor-pointer hover:bg-emerald-900/40 transition text-center min-w-[100px]"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>SITES</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-4 cursor-pointer hover:bg-emerald-900/40 transition text-center min-w-[130px]"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 text-right min-w-[100px]">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-900/40 font-normal text-slate-200">
            {sortedZones.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                  No zones found matching the selected filters.
                </td>
              </tr>
            ) : (
              sortedZones.map((zone, index) => (
                <tr
                  key={zone.id}
                  className={`hover:bg-emerald-900/30 transition-colors ${
                    index % 2 === 0 ? 'bg-[#031e13]/60' : 'bg-[#02180f]/40'
                  }`}
                >
                  {/* Zone No */}
                  <td className="py-3.5 px-3 text-center font-black text-amber-300 border-r border-slate-800/60">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-amber-400 text-xs font-bold border border-emerald-500/30">
                      {zone.zoneNo}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 border-r border-slate-800/60">
                    <div
                      onClick={() => onSelectZone(zone)}
                      className="font-bold text-white hover:text-amber-300 cursor-pointer flex items-center gap-2 group transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:text-amber-300 transition shrink-0" />
                      <span>{zone.description}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 text-amber-200 border border-amber-500/40 px-2 py-0.5 rounded shadow-2xs">
                        📍 {getSiteCodeRange(zone)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{zone.region}</span>
                      {zone.defectCount > 0 && (
                        <span className="text-[10px] text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40 font-bold">
                          ⚠️ {zone.defectCount} defect{zone.defectCount > 1 ? 's' : ''}
                        </span>
                      )}
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
                        <div className="mt-2 flex flex-wrap gap-1">
                          {matched.map((s) => (
                            <span
                              key={s.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectZone(zone);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/90 border border-amber-400/60 rounded px-2 py-0.5 cursor-pointer hover:bg-amber-900 transition shadow-xs"
                              title={`Click to view details for site ${s.siteCode}`}
                            >
                              <span className="font-mono underline font-extrabold">{s.siteCode}</span>: {s.name}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                  </td>

                  {/* Week 2 Inspector */}
                  <td className="py-3.5 px-3 text-center border-r border-slate-800/60">
                    <div className="flex flex-col items-center gap-1">
                      <InspectorBadge name={zone.week2Inspector} size="sm" />
                    </div>
                  </td>

                  {/* Week 4 Inspector */}
                  <td className="py-3.5 px-3 text-center border-r border-slate-800/60">
                    <div className="flex flex-col items-center gap-1">
                      <InspectorBadge name={zone.week4Inspector} size="sm" />
                    </div>
                  </td>

                  {/* Sites Count & UP Code Range */}
                  <td className="py-3.5 px-3 text-center border-r border-slate-800/60">
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold text-xs">
                        {zone.siteCount} Sites
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded font-semibold border border-slate-700">
                        {getSiteCodeRange(zone)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center border-r border-slate-800/60">
                    {getStatusBadge(zone.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onOpenWeeklyPhotoReport && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenWeeklyPhotoReport(zone.zoneNo);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer border border-amber-400/40 shadow-xs"
                          title={`Weekly Lighting Photo Report for Zone ${zone.zoneNo}`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Photos</span>
                        </button>
                      )}
                      <button
                        onClick={() => onSelectZone(zone)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Audit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-slate-950/90 border-t border-emerald-900/60 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <strong className="text-amber-300">{sortedZones.length}</strong> of {zones.length} ZONES ({monthInfo.monthLabelEn} {selectedYear})
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> In Progress</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Pending</span>
        </div>
      </div>
    </div>
  );
};

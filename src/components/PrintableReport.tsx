import React, { useState, useEffect } from 'react';
import { ZoneData } from '../types';
import { 
  ShieldCheck, 
  Printer, 
  Download, 
  Camera, 
  X, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import { getSiteCodeRange } from '../utils/siteHelpers';
import { getMonthInfo, MONTHS, YEARS } from '../utils/dateHelpers';
import { WeeklyPhotoReportView } from './WeeklyPhotoReportView';

interface PrintableReportProps {
  zones: ZoneData[];
  onPrint: () => void;
  onExportCSV: () => void;
  selectedYear?: number;
  selectedMonth?: number;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  initialReportMode?: 'detailed' | 'summary' | 'status_summary' | 'weekly_photos';
  initialStatusFilter?: string;
  initialZoneNo?: number;
  initialWeek?: 'all' | 'week1' | 'week2' | 'week3' | 'week4';
  onSaveZone?: (updatedZone: ZoneData) => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  zones,
  onPrint,
  onExportCSV,
  selectedYear = 2026,
  selectedMonth = 8,
  onYearChange,
  onMonthChange,
  initialReportMode = 'weekly_photos',
  initialStatusFilter = 'ALL',
  initialZoneNo = 0,
  initialWeek = 'all',
  onSaveZone,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [reportMode, setReportMode] = useState<'detailed' | 'summary' | 'status_summary' | 'weekly_photos'>(initialReportMode);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [selectedZoneNo, setSelectedZoneNo] = useState<number>(initialZoneNo);
  const [selectedSiteCode, setSelectedSiteCode] = useState<string>('ALL');
  const [selectedWeek, setSelectedWeek] = useState<'all' | 'week1' | 'week2' | 'week3' | 'week4'>(initialWeek);
  const [activeZoomImg, setActiveZoomImg] = useState<string | null>(null);

  // Sync if initial props change
  useEffect(() => {
    if (initialReportMode) setReportMode(initialReportMode);
  }, [initialReportMode]);

  useEffect(() => {
    if (initialZoneNo !== undefined) setSelectedZoneNo(initialZoneNo);
  }, [initialZoneNo]);

  useEffect(() => {
    if (initialWeek) setSelectedWeek(initialWeek);
  }, [initialWeek]);

  useEffect(() => {
    if (initialStatusFilter) setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);

  const monthInfo = getMonthInfo(selectedYear, selectedMonth);

  // When selectedZoneNo changes, reset selectedSiteCode if not 'ALL'
  const handleZoneChange = (zoneNo: number) => {
    setSelectedZoneNo(zoneNo);
    setSelectedSiteCode('ALL');
  };

  // Get list of available sites based on selected zone
  const activeZone = zones.find((z) => z.zoneNo === selectedZoneNo);
  const availableSites = selectedZoneNo === 0 
    ? zones.flatMap((z) => z.sites)
    : (activeZone ? activeZone.sites : []);

  const totalSites = zones.reduce((sum, z) => sum + z.siteCount, 0);
  const totalDefects = zones.reduce((sum, z) => sum + z.defectCount, 0);
  const completedCount = zones.filter((z) => z.status === 'Completed').length;

  // Filtered zones for detailed view (filtered by zone AND by selected site)
  const displayZones = (selectedZoneNo === 0 ? zones : zones.filter((z) => z.zoneNo === selectedZoneNo))
    .map((z) => {
      if (selectedSiteCode === 'ALL') return z;
      const filteredSites = z.sites.filter((s) => s.siteCode === selectedSiteCode);
      return {
        ...z,
        sites: filteredSites,
      };
    })
    .filter((z) => z.sites.length > 0);

  // -------------------------------------------------------------
  // ZONE INSPECTION STATUS STATS
  // -------------------------------------------------------------
  interface ZoneStatusStat {
    zone: ZoneData;
    totalSites: number;
    w2Inspected: number;
    w4Inspected: number;
    totalDone: number;
    totalReq: number;
    pct: number;
    w2Status: 'Completed' | 'In Progress' | 'Pending';
    w4Status: 'Completed' | 'In Progress' | 'Pending';
    overallStatus: 'Completed' | 'In Progress' | 'Pending';
    defectCount: number;
    lightedCount: number;
    lastDate: string;
  }

  const allZoneStats: ZoneStatusStat[] = zones.map((zone) => {
    const totalSites = zone.sites ? zone.sites.length : zone.siteCount;
    const w2Inspected = zone.sites ? zone.sites.filter((s) => !!s.week2Report).length : 0;
    const w4Inspected = zone.sites ? zone.sites.filter((s) => !!s.week4Report).length : 0;
    const totalDone = w2Inspected + w4Inspected;
    const totalReq = totalSites * 2;
    const pct = totalReq > 0 ? Math.round((totalDone / totalReq) * 100) : 0;

    const w2Status: 'Completed' | 'In Progress' | 'Pending' =
      w2Inspected >= totalSites && totalSites > 0
        ? 'Completed'
        : w2Inspected > 0
        ? 'In Progress'
        : 'Pending';

    const w4Status: 'Completed' | 'In Progress' | 'Pending' =
      w4Inspected >= totalSites && totalSites > 0
        ? 'Completed'
        : w4Inspected > 0
        ? 'In Progress'
        : 'Pending';

    let overallStatus: 'Completed' | 'In Progress' | 'Pending' = 'Pending';
    if (pct === 100 || (zone.status === 'Completed' && totalSites > 0)) {
      overallStatus = 'Completed';
    } else if (totalDone > 0 || zone.status === 'In Progress') {
      overallStatus = 'In Progress';
    }

    const defectCount = zone.defectCount || 0;
    const lightedCount = Math.max(0, totalSites - defectCount);
    const lastDate =
      zone.lastInspected ||
      zone.sites?.find((s) => s.week4Report?.inspectionDate || s.week2Report?.inspectionDate)?.week4Report?.inspectionDate ||
      zone.sites?.find((s) => s.week2Report?.inspectionDate)?.week2Report?.inspectionDate ||
      '';

    return {
      zone,
      totalSites,
      w2Inspected,
      w4Inspected,
      totalDone,
      totalReq,
      pct,
      w2Status,
      w4Status,
      overallStatus,
      defectCount,
      lightedCount,
      lastDate,
    };
  });

  const completedZonesList = allZoneStats.filter((s) => s.overallStatus === 'Completed');
  const inProgressZonesList = allZoneStats.filter((s) => s.overallStatus === 'In Progress');
  const pendingZonesList = allZoneStats.filter((s) => s.overallStatus === 'Pending');
  const needsMaintenanceList = allZoneStats.filter((s) => s.defectCount > 0);
  const totalInspectionsDoneAll = allZoneStats.reduce((sum, s) => sum + s.totalDone, 0);
  const totalInspectionsRequiredAll = allZoneStats.reduce((sum, s) => sum + s.totalReq, 0);
  const overallCompletionPctAll =
    totalInspectionsRequiredAll > 0
      ? Math.round((totalInspectionsDoneAll / totalInspectionsRequiredAll) * 100)
      : 0;

  // Filtered zone stats for display in status_summary mode
  const displayStatusZones = allZoneStats.filter((item) => {
    if (selectedZoneNo !== 0 && item.zone.zoneNo !== selectedZoneNo) return false;
    if (statusFilter === 'Completed') return item.overallStatus === 'Completed';
    if (statusFilter === 'In Progress') return item.overallStatus === 'In Progress';
    if (statusFilter === 'Pending') return item.overallStatus === 'Pending';
    if (statusFilter === 'Needs Maintenance') return item.defectCount > 0;
    return true;
  });

  const handleInternalExportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (reportMode === 'detailed') {
      headers = [
        'Zone No', 'Zone Description', 'Region', 'Site Code', 'Site Name', 'Fixture Type', 
        'Week 2 Inspector', 'Week 2 Status', 'Week 2 Defect Priority', 'Week 2 Weather', 'Week 2 Maintenance Log', 'Week 2 Notes',
        'Week 4 Inspector', 'Week 4 Status', 'Week 4 Defect Priority', 'Week 4 Weather', 'Week 4 Maintenance Log', 'Week 4 Notes'
      ];
      displayZones.forEach(zone => {
        zone.sites.forEach(site => {
          rows.push([
            zone.zoneNo,
            `"${zone.description.replace(/"/g, '""')}"`,
            `"${zone.region}"`,
            site.siteCode,
            `"${site.name.replace(/"/g, '""')}"`,
            site.fixtureType,
            `"${site.week2Report?.inspector || zone.week2Inspector}"`,
            `"${site.week2Report?.status || 'Pending'}"`,
            `"${site.week2Report?.defectPriority || ''}"`,
            `"${site.week2Report?.weatherCondition || ''}"`,
            `"${site.week2Report?.maintenanceLog || ''}"`,
            `"${(site.week2Report?.notes || '').replace(/"/g, '""')}"`,
            `"${site.week4Report?.inspector || zone.week4Inspector}"`,
            `"${site.week4Report?.status || 'Pending'}"`,
            `"${site.week4Report?.defectPriority || ''}"`,
            `"${site.week4Report?.weatherCondition || ''}"`,
            `"${site.week4Report?.maintenanceLog || ''}"`,
            `"${(site.week4Report?.notes || '').replace(/"/g, '""')}"`
          ]);
        });
      });
    } else if (reportMode === 'status_summary') {
      headers = [
        'No',
        'Zone Description',
        'Region',
        'Total Sites',
        'Week 2 Status',
        'Week 2 Inspector',
        'Week 2 Inspected Count',
        'Week 4 Status',
        'Week 4 Inspector',
        'Week 4 Inspected Count',
        'Overall Status',
        'Completion %',
        'Total Inspections Done',
        'Total Required',
        'Defect Count',
        'Lighted Count',
        'Last Inspected Date',
        'Remarks'
      ];
      rows = displayStatusZones.map((item) => [
        item.zone.zoneNo,
        `"${item.zone.description.replace(/"/g, '""')}"`,
        `"${item.zone.region}"`,
        item.totalSites,
        `"${item.w2Status}"`,
        `"${item.zone.week2Inspector}"`,
        `"${item.w2Inspected}/${item.totalSites}"`,
        `"${item.w4Status}"`,
        `"${item.zone.week4Inspector}"`,
        `"${item.w4Inspected}/${item.totalSites}"`,
        `"${item.overallStatus}"`,
        `"${item.pct}%"`,
        item.totalDone,
        item.totalReq,
        item.defectCount,
        item.lightedCount,
        `"${item.lastDate}"`,
        `"${(item.zone.remarks || '').replace(/"/g, '""')}"`
      ]);
    } else {
      headers = ['No', 'Description', 'Week 2 Inspector', 'Week 4 Inspector', 'Total Sites', 'Region', 'Status', 'Defect Count', 'Remarks'];
      rows = displayZones.map((z) => [
        z.zoneNo,
        `"${z.description.replace(/"/g, '""')}"`,
        `"${z.week2Inspector}"`,
        `"${z.week4Inspector}"`,
        z.siteCount,
        `"${z.region}"`,
        `"${z.status}"`,
        z.defectCount,
        `"${(z.remarks || '').replace(/"/g, '""')}"`,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lighting_Inspection_${reportMode}_${monthInfo.monthLabelEn}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAnnual = reportPeriod === 'annual';

  return (
    <div className="space-y-6 my-4">
      {/* Non-Printable Control & Filter Bar */}
      <div className="bg-[#031e13] text-slate-100 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl border border-emerald-600/30 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Official Report Generator
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                {monthInfo.monthLabelEn} {selectedYear}
              </span>
            </div>
            <h2 className="font-black text-base sm:text-lg text-white flex items-center gap-2 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Lighting Inspection Report & Zone Status Generator
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Generate zone status audit reports (Completed, In Progress, Pending), detailed site inspection cards with photo evidence, or formal monthly schedule matrices.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInternalExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#042416] hover:bg-[#073621] text-emerald-200 border border-emerald-500/40 text-xs font-semibold rounded-lg transition cursor-pointer"
              title="Export report view to CSV / Excel spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black rounded-lg shadow-md transition cursor-pointer"
              title="Print Report / Save PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Period Selector */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              Report Period:
            </label>
            <div className="flex items-center bg-[#042416] p-1 rounded-xl border border-emerald-600/30">
              <button
                type="button"
                onClick={() => setReportPeriod('monthly')}
                className={`flex-1 py-1.5 px-1.5 rounded-lg font-bold transition cursor-pointer text-center text-xs ${
                  reportPeriod === 'monthly'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                Monthly ({monthInfo.monthLabelEn.slice(0, 3)})
              </button>
              <button
                type="button"
                onClick={() => setReportPeriod('annual')}
                className={`flex-1 py-1.5 px-1.5 rounded-lg font-bold transition cursor-pointer text-center text-xs ${
                  reportPeriod === 'annual'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                Annual ({selectedYear})
              </button>
            </div>
          </div>

          {/* Month Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              Select Month:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange?.(Number(e.target.value))}
              disabled={reportPeriod === 'annual'}
              className="w-full bg-[#042416] text-amber-300 font-extrabold border border-emerald-500/40 rounded-xl p-2 focus:outline-hidden focus:border-amber-400 disabled:opacity-40 disabled:text-slate-400 cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value} className="bg-[#042416] text-white">
                  {m.labelEn} ({m.code})
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              Select Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange?.(Number(e.target.value))}
              className="w-full bg-[#042416] text-amber-300 font-extrabold border border-emerald-500/40 rounded-xl p-2 focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-[#042416] text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Report View Format Switcher */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Report View Format:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-[#042416] p-1 rounded-xl border border-emerald-600/30">
              <button
                type="button"
                onClick={() => setReportMode('weekly_photos')}
                className={`py-1.5 px-2 rounded-lg font-bold transition cursor-pointer text-center text-xs flex items-center justify-center gap-1 ${
                  reportMode === 'weekly_photos'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md font-black ring-1 ring-amber-500'
                    : 'text-amber-300 hover:text-white'
                }`}
                title="Weekly Lighting Inspection Report with Photo Evidence for Every Week & Every Zone"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Weekly Photo Report</span>
              </button>

              <button
                type="button"
                onClick={() => setReportMode('status_summary')}
                className={`py-1.5 px-2 rounded-lg font-bold transition cursor-pointer text-center text-xs flex items-center justify-center gap-1 ${
                  reportMode === 'status_summary'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Zone progress audit report: inspections completed, in progress, and scheduled"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zone Status Audit</span>
              </button>

              <button
                type="button"
                onClick={() => setReportMode('detailed')}
                className={`py-1.5 px-2 rounded-lg font-bold transition cursor-pointer text-center text-xs flex items-center justify-center gap-1 ${
                  reportMode === 'detailed'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Site Audit Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setReportMode('summary')}
                className={`py-1.5 px-2 rounded-lg font-bold transition cursor-pointer text-center text-xs flex items-center justify-center gap-1 ${
                  reportMode === 'summary'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Schedule Matrix (31)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filters Bar (shown for non-weekly_photos modes) */}
        {reportMode !== 'weekly_photos' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-800/60 text-xs">
          {/* Status Filter */}
          {reportMode === 'status_summary' ? (
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Filter by Zone Status:
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'bg-[#042416] text-emerald-200 hover:text-white border border-emerald-600/30'
                  }`}
                >
                  All Statuses ({allZoneStats.length} Zones)
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Completed')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'Completed'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                      : 'bg-emerald-950/60 text-emerald-300 hover:text-emerald-100 border border-emerald-500/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Completed ({completedZonesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('In Progress')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'In Progress'
                      ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
                      : 'bg-sky-950/60 text-sky-300 hover:text-sky-100 border border-sky-500/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  In Progress ({inProgressZonesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Pending')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'Pending'
                      ? 'bg-slate-600 text-white font-black shadow-sm'
                      : 'bg-[#042416] text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Pending ({pendingZonesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Needs Maintenance')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'Needs Maintenance'
                      ? 'bg-rose-500 text-white font-black shadow-sm'
                      : 'bg-rose-950/60 text-rose-300 hover:text-rose-100 border border-rose-500/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Defects Found ({needsMaintenanceList.length})
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Zone Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Select Inspection Zone:
                </label>
                <select
                  value={selectedZoneNo}
                  onChange={(e) => handleZoneChange(Number(e.target.value))}
                  className="w-full bg-[#042416] text-white font-bold border border-emerald-600/30 rounded-xl p-2 focus:outline-hidden focus:border-amber-400 disabled:opacity-50"
                >
                  <option value={0}>All 31 Zones (Full Report)</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.zoneNo} className="bg-[#042416] text-white">
                      Zone {z.zoneNo}: {z.description} ({z.siteCount} Sites)
                    </option>
                  ))}
                </select>
              </div>

              {/* Site Selector */}
              <div>
                <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Select Specific Site:
                </label>
                <select
                  value={selectedSiteCode}
                  onChange={(e) => setSelectedSiteCode(e.target.value)}
                  disabled={reportMode === 'summary'}
                  className="w-full bg-[#042416] text-white font-bold border border-emerald-600/30 rounded-xl p-2 focus:outline-hidden focus:border-amber-400 disabled:opacity-40 cursor-pointer"
                >
                  <option value="ALL" className="bg-[#042416] text-white">
                    {selectedZoneNo === 0 ? 'All Sites' : `All Sites (${availableSites.length} Sites in Zone ${selectedZoneNo})`}
                  </option>
                  {availableSites.map((s) => (
                    <option key={s.id} value={s.siteCode} className="bg-[#042416] text-white">
                      📍 {s.siteCode} — {s.name} ({s.fixtureType})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Week Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Inspection Week:
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value as 'all' | 'week2' | 'week4')}
              className="w-full bg-[#042416] text-white font-bold border border-emerald-600/30 rounded-xl p-2 focus:outline-hidden focus:border-amber-400 disabled:opacity-50 cursor-pointer"
            >
              <option value="all" className="bg-[#042416] text-white">Both Weeks (Week 2 & Week 4)</option>
              <option value="week2" className="bg-[#042416] text-white">Week 2 ({monthInfo.week2Range}/{selectedYear})</option>
              <option value="week4" className="bg-[#042416] text-white">Week 4 ({monthInfo.week4Range}/{selectedYear})</option>
            </select>
          </div>
        </div>
        )}
      </div>

      {reportMode === 'weekly_photos' ? (
        <WeeklyPhotoReportView
          zones={zones}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          initialZoneNo={selectedZoneNo}
          initialWeek={selectedWeek}
          onSaveZone={onSaveZone}
          onPrint={onPrint}
          onExportCSV={handleInternalExportCSV}
        />
      ) : (
        /* Actual Printable Document Container */
        <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 sm:p-10 shadow-lg max-w-5xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none print:rounded-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-emerald-950 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-xl border-2 border-emerald-900 hover:border-amber-500 p-0.5 overflow-hidden shrink-0 bg-[#032014] shadow-xs block transition"
                title="Visit Big Tree Outdoor Sdn Bhd Official Website"
              >
                <img
                  src="/src/assets/images/bigtree_outdoor_logo_1785723315856.jpg"
                  alt="Big Tree Outdoor Sdn Bhd Logo"
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </a>
              <div>
                <a
                  href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold tracking-widest text-emerald-800 hover:text-emerald-600 uppercase mb-0.5 inline-block transition"
                >
                  BIG TREE OUTDOOR SDN BHD
                </a>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {reportMode === 'status_summary'
                    ? 'LIGHTING INSPECTION ZONE STATUS REPORT (INSPECTIONS DONE)'
                    : 'LIGHTING AUDIT & INSPECTION REPORT'}
                </h1>
                <div className="text-sm font-bold text-slate-700 mt-0.5 uppercase flex flex-wrap items-center gap-2">
                  <span className="bg-[#042416] text-emerald-300 px-2.5 py-0.5 rounded text-xs font-black">
                    {isAnnual ? `OFFICIAL ANNUAL REPORT ${selectedYear}` : `OFFICIAL MONTHLY REPORT — ${monthInfo.monthLabelEn.toUpperCase()} ${selectedYear}`}
                  </span>
                  <span>
                    {selectedZoneNo === 0 ? 'ZONE 1-31 (ALL ZONES)' : `ZONE ${selectedZoneNo}`}
                    {selectedSiteCode !== 'ALL' && ` • SITE: ${selectedSiteCode}`}
                  </span>
                  {reportMode === 'status_summary' && (
                    <span className="text-emerald-800 font-extrabold">
                      • ZONE AUDIT STATUS: COMPLETED, IN PROGRESS & PENDING
                    </span>
                  )}
                  {reportMode === 'detailed' && (
                    <span className="text-slate-500 font-normal">
                      ({selectedWeek === 'week2' ? `Week 2: ${monthInfo.week2Range}` : selectedWeek === 'week4' ? `Week 4: ${monthInfo.week4Range}` : 'Week 2 & Week 4'})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 text-right text-xs font-mono space-y-1">
              <div>
                <strong>DOC ID:</strong> {isAnnual ? `BT-LI-ANNUAL-${selectedYear}` : monthInfo.docPrefix}-{reportMode === 'status_summary' ? 'STATUS-ZALL' : `Z${selectedZoneNo || 'ALL'}`}
                {selectedSiteCode !== 'ALL' && `-${selectedSiteCode}`}
              </div>
              <div>
                <strong>SCOPE:</strong> {isAnnual ? `ANNUAL AUDIT ${selectedYear}` : `${selectedWeek === 'all' ? 'W2 & W4 ' : selectedWeek === 'week2' ? 'WEEK 2 ' : 'WEEK 4 '}${monthInfo.monthLabelEn.toUpperCase()} ${selectedYear}`}
              </div>
              <div><strong>STATUS:</strong> <span className="text-emerald-700 font-bold">VERIFIED OFFICIAL AUDIT</span></div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODE 1: ZONE INSPECTION STATUS REPORT
            ------------------------------------------------------------- */}
        {reportMode === 'status_summary' ? (
          <div className="space-y-6">
            {/* Executive Status KPI Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  1. EXECUTIVE ZONE INSPECTION PROGRESS SUMMARY ({monthInfo.monthLabelEn.toUpperCase()} {selectedYear})
                </h2>
                <span className="text-xs font-mono font-bold text-slate-600">
                  Last Updated: {monthInfo.lastDay - 1} {monthInfo.monthLabelEn} {selectedYear}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Completed */}
                <div className="bg-emerald-50 border-2 border-emerald-400/80 rounded-xl p-3.5 text-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                      Completed Zones
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-900 tabular-nums">{completedZonesList.length}</span>
                    <span className="text-xs font-bold text-emerald-700">/ {zones.length} Zones</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    {Math.round((completedZonesList.length / zones.length) * 100)}% of zones 100% completed and fully inspected
                  </p>
                </div>

                {/* 2. In Progress */}
                <div className="bg-sky-50 border-2 border-sky-400/80 rounded-xl p-3.5 text-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800">
                      In Progress Zones
                    </span>
                    <Clock className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-sky-900 tabular-nums">{inProgressZonesList.length}</span>
                    <span className="text-xs font-bold text-sky-700">/ {zones.length} Zones</span>
                  </div>
                  <p className="text-[11px] text-sky-700 mt-1">
                    {Math.round((inProgressZonesList.length / zones.length) * 100)}% of zones in active field audit phase
                  </p>
                </div>

                {/* 3. Pending */}
                <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3.5 text-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                      Pending / Scheduled
                    </span>
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900 tabular-nums">{pendingZonesList.length}</span>
                    <span className="text-xs font-bold text-slate-600">/ {zones.length} Zones</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {Math.round((pendingZonesList.length / zones.length) * 100)}% of zones awaiting field audit cycle
                  </p>
                </div>

                {/* 4. Inspections Done */}
                <div className="bg-amber-50 border-2 border-amber-400/80 rounded-xl p-3.5 text-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                      Total Inspections Done
                    </span>
                    <Activity className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-amber-950 tabular-nums">{totalInspectionsDoneAll}</span>
                    <span className="text-xs font-bold text-amber-800">/ {totalInspectionsRequiredAll} Records</span>
                  </div>
                  <div className="mt-2 w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-600 h-1.5 rounded-full"
                      style={{ width: `${overallCompletionPctAll}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    {overallCompletionPctAll}% overall W2 & W4 audit progress
                  </p>
                </div>
              </div>
            </div>

            {/* Official Table: Zone Inspection Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded-md border border-slate-200 w-full flex items-center justify-between">
                  <span>2. 31 ZONES LIGHTING INSPECTION & FIELD AUDIT STATUS</span>
                  <span className="text-[11px] font-mono text-slate-600">
                    Displaying: {displayStatusZones.length} of {allZoneStats.length} Zones
                  </span>
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-[#032014] text-emerald-100 font-extrabold uppercase tracking-wider">
                      <th className="p-2 border border-slate-400 text-center w-10">NO</th>
                      <th className="p-2 border border-slate-400 min-w-[200px]">ZONE LOCATION & HIGHWAY CORRIDOR</th>
                      <th className="p-2 border border-slate-400 text-center w-14">SITES</th>
                      <th className="p-2 border border-slate-400 text-center min-w-[140px]">
                        WEEK 2 ({monthInfo.week2Range})
                      </th>
                      <th className="p-2 border border-slate-400 text-center min-w-[140px]">
                        WEEK 4 ({monthInfo.week4Range})
                      </th>
                      <th className="p-2 border border-slate-400 text-center min-w-[140px]">
                        OVERALL STATUS
                      </th>
                      <th className="p-2 border border-slate-400 text-center w-24">LIGHTING CONDITION</th>
                      <th className="p-2 border border-slate-400 min-w-[160px]">REMARKS & ACTION LOG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {displayStatusZones.map((item) => {
                      const isComplete = item.overallStatus === 'Completed';
                      const isInProg = item.overallStatus === 'In Progress';

                      return (
                        <tr
                          key={item.zone.id}
                          className={`hover:bg-slate-100 transition ${
                            isComplete ? 'bg-emerald-50/40' : isInProg ? 'bg-sky-50/30' : 'bg-white'
                          }`}
                        >
                          {/* 1. Zone No */}
                          <td className="p-2 border border-slate-300 text-center font-black text-slate-900">
                            Z{item.zone.zoneNo}
                          </td>

                          {/* 2. Description & Location */}
                          <td className="p-2 border border-slate-300 font-semibold text-slate-900">
                            <div className="font-bold text-xs">{item.zone.description}</div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-slate-600">
                              <span className="bg-slate-200 px-1.5 py-0.2 rounded font-bold text-slate-800">
                                {getSiteCodeRange(item.zone)}
                              </span>
                              <span>• {item.zone.region}</span>
                            </div>
                          </td>

                          {/* 3. Total Sites */}
                          <td className="p-2 border border-slate-300 text-center font-bold text-slate-900 tabular-nums">
                            {item.totalSites}
                          </td>

                          {/* 4. Week 2 Inspection */}
                          <td className="p-2 border border-slate-300 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  item.w2Status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : item.w2Status === 'In Progress'
                                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                                }`}
                              >
                                {item.w2Status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {item.w2Status === 'In Progress' && <Clock className="w-3 h-3 text-sky-600" />}
                                {item.w2Status.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-bold text-slate-700">
                                {item.zone.week2Inspector} ({item.w2Inspected}/{item.totalSites} done)
                              </span>
                            </div>
                          </td>

                          {/* 5. Week 4 Inspection */}
                          <td className="p-2 border border-slate-300 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  item.w4Status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : item.w4Status === 'In Progress'
                                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                                }`}
                              >
                                {item.w4Status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {item.w4Status === 'In Progress' && <Clock className="w-3 h-3 text-sky-600" />}
                                {item.w4Status.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-bold text-slate-700">
                                {item.zone.week4Inspector} ({item.w4Inspected}/{item.totalSites} done)
                              </span>
                            </div>
                          </td>

                          {/* 6. Overall Status Badge & Progress */}
                          <td className="p-2 border border-slate-300 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide ${
                                  isComplete
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : isInProg
                                    ? 'bg-sky-700 text-white shadow-xs'
                                    : 'bg-slate-700 text-white'
                                }`}
                              >
                                {item.overallStatus.toUpperCase()} ({item.pct}%)
                              </span>
                              <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    isComplete ? 'bg-emerald-600' : isInProg ? 'bg-sky-500' : 'bg-slate-400'
                                  }`}
                                  style={{ width: `${item.pct}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* 7. Lighting Status & Defects */}
                          <td className="p-2 border border-slate-300 text-center font-bold">
                            {item.defectCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-black">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                {item.defectCount} Defect{item.defectCount > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-bold">
                                {item.lightedCount} Lit
                              </span>
                            )}
                          </td>

                          {/* 8. Remarks / Action */}
                          <td className="p-2 border border-slate-300 text-slate-700 text-[10px]">
                            {item.defectCount > 0 ? (
                              <span className="text-rose-700 font-semibold">
                                Maintenance action required on fixture or electrical cables.
                              </span>
                            ) : isComplete ? (
                              <span className="text-emerald-800 font-medium">
                                Inspection complete. All lighting fixtures operational.
                              </span>
                            ) : isInProg ? (
                              <span className="text-sky-800 font-medium">
                                Partial inspection completed. Awaiting remaining sites.
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">
                                Scheduled for upcoming field audit cycle.
                              </span>
                            )}
                            {item.lastDate && (
                              <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                                Audit Date: {item.lastDate}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : reportMode === 'detailed' ? (
          /* -------------------------------------------------------------
              MODE 2: DETAILED ZONE & WEEK REPORT MODE WITH PHOTOS
              ------------------------------------------------------------- */
          <div className="space-y-8">
            {displayZones.map((zone) => {
              const weekList: ('week2' | 'week4')[] =
                selectedWeek === 'all' ? ['week2', 'week4'] : [selectedWeek];

              return (
                <div key={zone.id} className="space-y-6 page-break-inside-avoid border-b-2 border-slate-200 pb-8 last:border-b-0">
                  {/* Zone Header Banner */}
                  <div className="bg-[#032014] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded uppercase">
                          ZONE {zone.zoneNo}
                        </span>
                        <h2 className="font-extrabold text-lg text-white">{zone.description}</h2>
                      </div>
                      <p className="text-xs text-emerald-200/80 mt-1 font-mono">
                        Site Code: {getSiteCodeRange(zone)} | Region: {zone.region} | Total Sites: {zone.siteCount}
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono bg-[#052b1b] p-2.5 rounded-lg border border-emerald-700/50">
                      <div>W2 Inspector: <strong className="text-emerald-300">{zone.week2Inspector}</strong></div>
                      <div>W4 Inspector: <strong className="text-emerald-300">{zone.week4Inspector}</strong></div>
                    </div>
                  </div>

                  {/* Render Weeks for this zone */}
                  {weekList.map((wk) => {
                    const isW2 = wk === 'week2';
                    const wkTitle = isW2
                      ? `WEEK 2 (${monthInfo.week2Range}/${selectedYear})`
                      : `WEEK 4 (${monthInfo.week4Range}/${selectedYear})`;
                    const wkInspector = isW2 ? zone.week2Inspector : zone.week4Inspector;

                    return (
                      <div key={wk} className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                            {wkTitle} — LIGHTING INSPECTION REPORT
                          </span>
                          <span className="text-xs font-semibold text-slate-600 font-mono">
                            Inspection Officer: {wkInspector}
                          </span>
                        </div>

                        {/* Site Inspection Cards */}
                        <div className="grid grid-cols-1 gap-4">
                          {zone.sites.map((site, sIdx) => {
                            const rep = isW2 ? site.week2Report : site.week4Report;
                            const statusVal = rep?.status || site.status || 'Lighted';
                            const luxVal = rep?.luxLevel ?? site.luxLevel ?? (statusVal === 'Lighted' ? 140 : 25);
                            const remarkVal = rep?.notes || site.notes || 'Lighting satisfactory.';
                            const chk = rep?.checklistItems || {
                              fixtureSecure: true,
                              poleAligned: true,
                              timerFunctioning: true,
                              wiringOk: true,
                              noVandalism: true,
                            };
                            const sitePhotos = rep?.photos || (rep?.photoUrl ? [rep.photoUrl, '', ''] : site.photos || ['', '', '']);

                            const isOK = statusVal === 'Lighted' || statusVal === 'Working';

                            return (
                              <div
                                key={site.id}
                                className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3 print:bg-white print:border-slate-400"
                              >
                                {/* Card Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                  <div>
                                    <span className="font-mono font-extrabold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 mr-2">
                                      #{sIdx + 1} • {site.siteCode}
                                    </span>
                                    <span className="font-bold text-xs text-slate-900">{site.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono ml-2">
                                      ({site.fixtureType})
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                                        isOK
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                                      }`}
                                    >
                                      {statusVal}
                                    </span>
                                    <span className="text-[11px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold tabular-nums">
                                      {luxVal} LUX
                                    </span>
                                  </div>
                                </div>

                                {/* Checklist & Verification grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                                  <div className="flex items-center gap-1.5">
                                    {chk.fixtureSecure ? (
                                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                    )}
                                    <span className={chk.fixtureSecure ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                                      Fixture Secure
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {chk.poleAligned ? (
                                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                    )}
                                    <span className={chk.poleAligned ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                                      Pole Aligned
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {chk.timerFunctioning ? (
                                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                    )}
                                    <span className={chk.timerFunctioning ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                                      Timer OK
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {chk.wiringOk ? (
                                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                    )}
                                    <span className={chk.wiringOk ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                                      Wiring Safe
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {chk.noVandalism ? (
                                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                    )}
                                    <span className={chk.noVandalism ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                                      No Vandalism
                                    </span>
                                  </div>
                                </div>

                                {/* Photo Proof Section */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Camera className="w-3 h-3 text-emerald-600" />
                                    Field Inspection Photo Evidence (Day, Night Illumination & Control Unit/Timer Box)
                                  </span>

                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { label: 'Day Inspection', img: sitePhotos[0] },
                                      { label: 'Night Illumination', img: sitePhotos[1] },
                                      { label: 'Control Unit / Timer', img: sitePhotos[2] },
                                    ].map((pCard, pIdx) => (
                                      <div
                                        key={pIdx}
                                        className="bg-white border border-slate-200 rounded-lg p-1.5 text-center relative group"
                                      >
                                        <div className="text-[9px] font-bold text-slate-600 truncate mb-1">
                                          {pCard.label}
                                        </div>

                                        {pCard.img ? (
                                          <div className="relative aspect-4/3 rounded overflow-hidden bg-slate-900">
                                            <img
                                              src={pCard.img}
                                              alt={pCard.label}
                                              className="w-full h-full object-cover"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => setActiveZoomImg(pCard.img)}
                                              className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition cursor-pointer print:hidden"
                                            >
                                              Zoom Photo
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="aspect-4/3 rounded bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[9px] italic">
                                            <Camera className="w-4 h-4 mb-0.5 text-slate-300" />
                                            No Photo Uploaded
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Inspector Remarks */}
                                <div className="text-[11px] bg-slate-100 p-2 rounded-lg border border-slate-200">
                                  <strong className="text-slate-700">Remarks / Findings: </strong>
                                  <span className="text-slate-900">{remarkVal}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          /* -------------------------------------------------------------
              MODE 3: SUMMARY MATRIX 31 ZONES MODE
              ------------------------------------------------------------- */
          <>
            {/* Executive Summary Box */}
            <div className="mb-8">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 bg-slate-100 p-2 rounded-md border border-slate-200">
                1. EXECUTIVE AUDIT SUMMARY
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="block text-slate-500 font-semibold text-[10px] uppercase">Total Zones</span>
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">31 Zones</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="block text-slate-500 font-semibold text-[10px] uppercase">Total Sites</span>
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">{totalSites} Sites</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="block text-slate-500 font-semibold text-[10px] uppercase">Audit Completion Rate</span>
                  <span className="text-xl font-extrabold text-emerald-700 tabular-nums">
                    {Math.round((completedCount / zones.length) * 100)}%
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="block text-slate-500 font-semibold text-[10px] uppercase">Defect / Fault Count</span>
                  <span className="text-xl font-extrabold text-amber-700 tabular-nums">{totalDefects} Issues</span>
                </div>
              </div>
            </div>

            {/* Table Section: Complete Zones Matrix */}
            <div className="mb-8">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 bg-slate-100 p-2 rounded-md border border-slate-200">
                2. LIGHTING INSPECTION SCHEDULE ({isAnnual ? `ANNUAL AUDIT SUMMARY ${selectedYear}` : `${monthInfo.monthLabelEn.toUpperCase()} ${selectedYear}`})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-[#032014] text-emerald-100 font-bold uppercase tracking-wider">
                      <th className="p-2 border border-slate-400 text-center w-10">NO</th>
                      <th className="p-2 border border-slate-400">DESCRIPTION (ZONE / SITE)</th>
                      {(selectedWeek === 'all' || selectedWeek === 'week2') && (
                        <th className="p-2 border border-slate-400 text-center">WEEK 2 ({monthInfo.week2Range})</th>
                      )}
                      {(selectedWeek === 'all' || selectedWeek === 'week4') && (
                        <th className="p-2 border border-slate-400 text-center">WEEK 4 ({monthInfo.week4Range})</th>
                      )}
                      <th className="p-2 border border-slate-400 text-center w-16">SITES</th>
                      <th className="p-2 border border-slate-400 text-center w-24">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {displayZones.map((zone) => (
                      <tr key={zone.id} className="even:bg-slate-50">
                        <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                          {zone.zoneNo}
                        </td>
                        <td className="p-2 border border-slate-300 font-medium text-slate-900">
                          <div>{zone.description}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100 px-1 py-0.2 rounded border border-amber-300">
                              {getSiteCodeRange(zone)}
                            </span>
                            <span className="text-[10px] text-slate-500">{zone.region}</span>
                          </div>
                        </td>
                        {(selectedWeek === 'all' || selectedWeek === 'week2') && (
                          <td className="p-2 border border-slate-300 text-center font-semibold text-slate-800">
                            {zone.week2Inspector}
                          </td>
                        )}
                        {(selectedWeek === 'all' || selectedWeek === 'week4') && (
                          <td className="p-2 border border-slate-300 text-center font-semibold text-slate-800">
                            {zone.week4Inspector}
                          </td>
                        )}
                        <td className="p-2 border border-slate-300 text-center font-bold text-slate-900 tabular-nums">
                          {zone.siteCount}
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-bold">
                          <span
                            className={
                              zone.status === 'Completed'
                                ? 'text-emerald-700'
                                : zone.status === 'In Progress'
                                ? 'text-blue-700'
                                : 'text-amber-700'
                            }
                          >
                            {zone.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Signature Block */}
        <div className="mt-12 pt-6 border-t-2 border-slate-300 page-break-inside-avoid">
          <div className="text-xs font-bold text-slate-900 uppercase mb-6">
            REPORT VERIFICATION & APPROVAL
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs border-t border-slate-200 pt-6">
            {/* Inspector Signature */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified By</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-36 border-b-2 border-slate-900 flex items-center justify-center font-serif italic text-lg opacity-85 text-slate-900">
                  Marzahaidi C.A.
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Marzahaidi Bin Che Ani</p>
                  <p className="text-xs text-slate-500">Verified By • Bigtree Outdoor Sdn Bhd</p>
                  <p className="text-[10px] text-slate-400">
                    Issued: {isAnnual ? `31 December ${selectedYear}` : `${monthInfo.lastDay - 1} ${monthInfo.monthLabelEn} ${selectedYear}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Management Endorsement */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved By</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-36 border-b-2 border-slate-900 flex items-center justify-center font-serif italic text-lg opacity-85 text-slate-900">
                  K. Razali
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Khairul Razali</p>
                  <p className="text-xs text-slate-500">Operations Director • Bigtree Outdoor Sdn Bhd</p>
                  <p className="text-[10px] text-slate-400">Official Seal & Audit Stamp</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Zooming Proof Photos */}
        {activeZoomImg && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
            <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl p-2 border border-slate-700 shadow-2xl">
              <button
                type="button"
                onClick={() => setActiveZoomImg(null)}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full cursor-pointer z-10 transition shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activeZoomImg}
                alt="Zoomed evidence"
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

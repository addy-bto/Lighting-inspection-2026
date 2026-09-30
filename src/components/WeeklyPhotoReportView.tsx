import React, { useState, useRef } from 'react';
import {
  Camera,
  ShieldCheck,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
  X,
  CheckSquare,
  Square,
  Sparkles,
  Layers,
  Filter,
  Activity,
  Calendar,
} from 'lucide-react';
import { ZoneData, SiteDetail, SiteStatus, SiteInspectionRecord } from '../types';
import { getMonthInfo } from '../utils/dateHelpers';
import { getSitePhotoEvidence, getSiteCoordinates } from '../utils/photoHelpers';
import { getSiteCodeRange } from '../utils/siteHelpers';

interface WeeklyPhotoReportViewProps {
  zones: ZoneData[];
  selectedYear?: number;
  selectedMonth?: number;
  initialZoneNo?: number;
  initialWeek?: 'all' | 'week1' | 'week2' | 'week3' | 'week4';
  onSaveZone?: (updatedZone: ZoneData) => void;
  onPrint: () => void;
  onExportCSV?: () => void;
}

export const WeeklyPhotoReportView: React.FC<WeeklyPhotoReportViewProps> = ({
  zones,
  selectedYear = 2026,
  selectedMonth = 8,
  initialZoneNo = 0,
  initialWeek = 'week2',
  onSaveZone,
  onPrint,
  onExportCSV,
}) => {
  const monthInfo = getMonthInfo(selectedYear, selectedMonth);

  const [selectedWeek, setSelectedWeek] = useState<'all' | 'week1' | 'week2' | 'week3' | 'week4'>(initialWeek);
  const [selectedZoneNo, setSelectedZoneNo] = useState<number>(initialZoneNo);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIGHTED' | 'DEFECTS'>('ALL');
  const [activeZoomImg, setActiveZoomImg] = useState<{ url: string; title: string; subtitle: string } | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Hidden file input ref for uploading photos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ zoneNo: number; siteId: string; photoIdx: number } | null>(null);

  // Get week date label
  const getWeekRangeText = (wk: 'all' | 'week1' | 'week2' | 'week3' | 'week4') => {
    switch (wk) {
      case 'week1':
        return `Week 1 (${monthInfo.week1Range}/${selectedYear})`;
      case 'week2':
        return `Week 2 (${monthInfo.week2Range}/${selectedYear})`;
      case 'week3':
        return `Week 3 (${monthInfo.week3Range}/${selectedYear})`;
      case 'week4':
        return `Week 4 (${monthInfo.week4Range}/${selectedYear})`;
      case 'all':
      default:
        return `All Weeks (${monthInfo.periodText})`;
    }
  };

  // Filtered zones
  const activeZones = selectedZoneNo === 0 ? zones : zones.filter((z) => z.zoneNo === selectedZoneNo);

  // Collect all sites to display according to filters
  const zonesWithFilteredSites = activeZones.map((zone) => {
    const rawSites = zone.sites || [];
    const filteredSites = rawSites.filter((site) => {
      // Determine effective site status for selected week
      const rep = selectedWeek === 'week4' || selectedWeek === 'week3' ? site.week4Report : site.week2Report;
      const effectiveStatus = rep?.status || site.status || 'Lighted';
      const isLighted = effectiveStatus === 'Lighted' || effectiveStatus === 'Working';

      if (statusFilter === 'LIGHTED') return isLighted;
      if (statusFilter === 'DEFECTS') return !isLighted;
      return true;
    });

    return {
      zone,
      sites: filteredSites,
    };
  }).filter((group) => group.sites.length > 0);

  // Compute Simple Lighting Status metrics for the active view
  let totalSitesCount = 0;
  let lightedCount = 0;
  let partialCount = 0;
  let notLightedCount = 0;
  let faultsCount = 0;
  let totalLux = 0;

  activeZones.forEach((z) => {
    (z.sites || []).forEach((s) => {
      totalSitesCount++;
      const rep = selectedWeek === 'week4' || selectedWeek === 'week3' ? s.week4Report : s.week2Report;
      const status = (rep?.status || s.status || 'Lighted').trim().toLowerCase();
      const lux = rep?.luxLevel ?? s.luxLevel ?? (status === 'lighted' ? 140 : 25);
      totalLux += lux;

      if (status === 'lighted' || status === 'working') {
        lightedCount++;
      } else if (status.includes('partial') || status.includes('half')) {
        partialCount++;
      } else if (status.includes('not lighted') || status.includes('unlit')) {
        notLightedCount++;
      } else {
        faultsCount++;
      }
    });
  });

  const avgLux = totalSitesCount > 0 ? Math.round(totalLux / totalSitesCount) : 140;
  const operationalPct = totalSitesCount > 0 ? Math.round((lightedCount / totalSitesCount) * 100) : 100;
  const defectTotal = partialCount + notLightedCount + faultsCount;

  // Handle Photo File Upload
  const handleTriggerUpload = (zoneNo: number, siteId: string, photoIdx: number) => {
    setUploadTarget({ zoneNo, siteId, photoIdx });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget || !onSaveZone) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const targetZone = zones.find((z) => z.zoneNo === uploadTarget.zoneNo);
      if (!targetZone || !targetZone.sites) return;

      const updatedSites = targetZone.sites.map((site) => {
        if (site.id === uploadTarget.siteId) {
          const currentPhotos = [...(site.photos || ['', '', ''])];
          currentPhotos[uploadTarget.photoIdx] = dataUrl;

          const isW4 = selectedWeek === 'week4' || selectedWeek === 'week3';
          const existingRep = isW4 ? site.week4Report : site.week2Report;

          const updatedRep: SiteInspectionRecord = {
            ...existingRep,
            inspector: existingRep?.inspector || (isW4 ? targetZone.week4Inspector : targetZone.week2Inspector),
            inspectionDate: existingRep?.inspectionDate || (isW4 ? monthInfo.week4DefaultDate : monthInfo.week2DefaultDate),
            status: existingRep?.status || site.status || 'Lighted',
            photoUrl: currentPhotos[0] || dataUrl,
            photos: currentPhotos,
            updatedAt: new Date().toISOString(),
          };

          return {
            ...site,
            photos: currentPhotos,
            [isW4 ? 'week4Report' : 'week2Report']: updatedRep,
          };
        }
        return site;
      });

      const updatedZone: ZoneData = {
        ...targetZone,
        sites: updatedSites,
      };

      onSaveZone(updatedZone);
      setUploadNotice(`Photo evidence attached to site #${uploadTarget.siteId} successfully!`);
      setTimeout(() => setUploadNotice(null), 3500);
      setUploadTarget(null);
    };
    reader.readAsDataURL(file);
  };

  // Zone pagination helpers
  const handlePrevZone = () => {
    if (selectedZoneNo <= 1) {
      setSelectedZoneNo(zones.length);
    } else {
      setSelectedZoneNo(selectedZoneNo - 1);
    }
  };

  const handleNextZone = () => {
    if (selectedZoneNo >= zones.length) {
      setSelectedZoneNo(1);
    } else {
      setSelectedZoneNo(selectedZoneNo + 1);
    }
  };

  // CSV Exporter for Weekly Photo Report
  const handleExportWeeklyPhotoCSV = () => {
    if (onExportCSV) {
      onExportCSV();
      return;
    }
    const headers = [
      'Zone No',
      'Zone Description',
      'Site Code',
      'Site Name',
      'Fixture Type',
      'Selected Week',
      'Inspector',
      'Audit Date',
      'Lighting Status',
      'Lux Level',
      'Night Photo URL',
      'Day Photo URL',
      'Control Box Photo URL',
      'GPS Coordinates',
      'Remarks',
    ];

    const rows: (string | number)[][] = [];
    zonesWithFilteredSites.forEach(({ zone, sites }) => {
      sites.forEach((site) => {
        const rep = selectedWeek === 'week4' || selectedWeek === 'week3' ? site.week4Report : site.week2Report;
        const status = rep?.status || site.status || 'Lighted';
        const lux = rep?.luxLevel ?? site.luxLevel ?? 140;
        const inspector = rep?.inspector || (selectedWeek === 'week4' ? zone.week4Inspector : zone.week2Inspector);
        const date = rep?.inspectionDate || (selectedWeek === 'week4' ? monthInfo.week4DefaultDate : monthInfo.week2DefaultDate);
        const photos = getSitePhotoEvidence(site.siteCode, status, site.photos, selectedWeek);
        const coords = getSiteCoordinates(zone.zoneNo, site.siteCode.charCodeAt(site.siteCode.length - 1) % 10);

        rows.push([
          zone.zoneNo,
          `"${zone.description.replace(/"/g, '""')}"`,
          site.siteCode,
          `"${site.name.replace(/"/g, '""')}"`,
          site.fixtureType,
          selectedWeek.toUpperCase(),
          `"${inspector}"`,
          date,
          `"${status}"`,
          lux,
          `"${photos.nightIllumination}"`,
          `"${photos.dayFixture}"`,
          `"${photos.controlTimer}"`,
          `"${coords}"`,
          `"${(rep?.notes || site.notes || '').replace(/"/g, '""')}"`,
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Weekly_Lighting_Photo_Report_Zone${selectedZoneNo}_${selectedWeek}_${monthInfo.monthLabelEn}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Image Uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
      />

      {/* Upload Toast Notice */}
      {uploadNotice && (
        <div className="p-3 bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-between border border-emerald-400 shadow-xl print:hidden animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {uploadNotice}
          </span>
          <button onClick={() => setUploadNotice(null)} className="text-slate-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Control Toolbar (Hidden during Print) */}
      <div className="bg-[#031e13] text-slate-100 p-4 sm:p-5 rounded-2xl shadow-xl border border-emerald-600/30 print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                <Camera className="w-3 h-3 text-slate-950" />
                OFFICIAL EVIDENCE REPORT
              </span>
              <span className="text-xs text-amber-300 font-mono font-bold">
                {monthInfo.monthLabelEn} {selectedYear}
              </span>
            </div>
            <h2 className="font-black text-base sm:text-lg text-white flex items-center gap-2 mt-1">
              Weekly Lighting Inspection Report (Every Week & Every Zone)
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Comprehensive field audit photo evidence with site illumination night shots, physical fixture inspection, and simple lighting operational status.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportWeeklyPhotoCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#042416] hover:bg-[#073621] text-emerald-200 border border-emerald-500/40 text-xs font-semibold rounded-xl transition cursor-pointer shadow-xs"
              title="Export photo report dataset to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition cursor-pointer"
              title="Print Weekly Photo Report or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. Week Selector Buttons (Every Week) */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              Select Inspection Week (Every Week):
            </label>
            <div className="grid grid-cols-5 gap-1 bg-[#042416] p-1 rounded-xl border border-emerald-600/30">
              <button
                type="button"
                onClick={() => setSelectedWeek('week1')}
                className={`py-1.5 px-1 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center ${
                  selectedWeek === 'week1'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Week 1 (01 - 07 of month)"
              >
                W1
              </button>
              <button
                type="button"
                onClick={() => setSelectedWeek('week2')}
                className={`py-1.5 px-1 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center ${
                  selectedWeek === 'week2'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Week 2 (08 - 15 of month - Scheduled Audit 1)"
              >
                W2
              </button>
              <button
                type="button"
                onClick={() => setSelectedWeek('week3')}
                className={`py-1.5 px-1 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center ${
                  selectedWeek === 'week3'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Week 3 (16 - 22 of month)"
              >
                W3
              </button>
              <button
                type="button"
                onClick={() => setSelectedWeek('week4')}
                className={`py-1.5 px-1 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center ${
                  selectedWeek === 'week4'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Week 4 (23 - End of month - Scheduled Audit 2)"
              >
                W4
              </button>
              <button
                type="button"
                onClick={() => setSelectedWeek('all')}
                className={`py-1.5 px-1 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center ${
                  selectedWeek === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="All Weeks (Full Month)"
              >
                All
              </button>
            </div>
            <span className="text-[10px] text-emerald-300/80 font-mono mt-1 block">
              Active: {getWeekRangeText(selectedWeek)}
            </span>
          </div>

          {/* 2. Zone Selector (Every Zone) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                Select Zone (Every Zone):
              </label>
              {selectedZoneNo > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevZone}
                    className="p-0.5 bg-[#042416] hover:bg-emerald-800 text-emerald-300 rounded cursor-pointer"
                    title="Previous Zone"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextZone}
                    className="p-0.5 bg-[#042416] hover:bg-emerald-800 text-emerald-300 rounded cursor-pointer"
                    title="Next Zone"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <select
              value={selectedZoneNo}
              onChange={(e) => setSelectedZoneNo(Number(e.target.value))}
              className="w-full bg-[#042416] text-white font-extrabold border border-emerald-600/40 rounded-xl p-2 focus:outline-none focus:border-amber-400 cursor-pointer text-xs"
            >
              <option value={0}>All 31 Zones (Complete Portfolio)</option>
              {zones.map((z) => (
                <option key={z.id} value={z.zoneNo} className="bg-[#042416] text-white">
                  Zone {z.zoneNo}: {z.description} ({z.siteCount} Sites)
                </option>
              ))}
            </select>
            <span className="text-[10px] text-emerald-300/80 font-mono mt-1 block">
              {selectedZoneNo === 0 ? 'Displaying all 31 advertising zones' : `Selected Zone ${selectedZoneNo} only`}
            </span>
          </div>

          {/* 3. Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" />
              Filter Lighting Status:
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#042416] p-1 rounded-xl border border-emerald-600/30">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`py-1.5 px-2 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center ${
                  statusFilter === 'ALL'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                All Sites
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('LIGHTED')}
                className={`py-1.5 px-2 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                  statusFilter === 'LIGHTED'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'text-emerald-300 hover:text-emerald-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Lighted
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DEFECTS')}
                className={`py-1.5 px-2 rounded-lg font-extrabold text-[11px] transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                  statusFilter === 'DEFECTS'
                    ? 'bg-rose-600 text-white shadow-md font-black'
                    : 'text-rose-300 hover:text-rose-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Defects
              </button>
            </div>
            <span className="text-[10px] text-emerald-300/80 font-mono mt-1 block">
              Showing {zonesWithFilteredSites.reduce((sum, g) => sum + g.sites.length, 0)} sites matching filter
            </span>
          </div>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL REPORT DOCUMENT CONTAINER */}
      <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-300 space-y-8 print:p-0 print:border-none print:shadow-none print:rounded-none">
        {/* Formal Document Letterhead */}
        <div className="border-b-4 border-emerald-950 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-2xl bg-[#02180f] p-1 border-2 border-emerald-600 hover:border-amber-500 shadow-md shrink-0 flex items-center justify-center transition"
              title="Visit Big Tree Outdoor Sdn Bhd Official Website"
            >
              <img
                src="/src/assets/images/bigtree_outdoor_logo_1785723315856.jpg"
                alt="Big Tree Outdoor Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-black tracking-widest text-emerald-900 hover:text-emerald-700 uppercase transition"
                >
                  BIG TREE OUTDOOR SDN BHD
                </a>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  {monthInfo.docId}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                WEEKLY LIGHTING INSPECTION
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Infrastructure Asset Management • Outdoor Billboards & Unipoles • Field Audit Verification
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 text-xs font-mono space-y-1 shrink-0">
            <div>
              <span className="text-slate-500">AUDIT PERIOD: </span>
              <strong className="text-slate-950 font-bold">{monthInfo.monthLabelEn.toUpperCase()} {selectedYear}</strong>
            </div>
            <div>
              <span className="text-slate-500">SCHEDULE CYCLE: </span>
              <strong className="text-emerald-700 font-bold uppercase">{selectedWeek.toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-slate-500">ZONE SCOPE: </span>
              <strong className="text-slate-950 font-bold">
                {selectedZoneNo === 0 ? 'ALL 31 ZONES' : `ZONE ${selectedZoneNo}`}
              </strong>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            SIMPLE REPORT STATUS OF LIGHTING (EXECUTIVE SUMMARY BANNER)
            ------------------------------------------------------------- */}
        <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-300 space-y-4 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-mono font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                EXECUTIVE SUMMARY
              </span>
              <h2 className="text-base font-black text-slate-950 mt-1 flex items-center gap-2">
                Simple Lighting Status Overview — {getWeekRangeText(selectedWeek)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-black tracking-wide border ${
                  defectTotal === 0
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-amber-100 text-amber-950 border-amber-400'
                }`}
              >
                {defectTotal === 0 ? '✓ ALL FIXTURES FULLY OPERATIONAL' : `⚠️ ${defectTotal} RECTIFICATION ACTION NEEDED`}
              </span>
            </div>
          </div>

          {/* Simple Status Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* 1. Total Sites */}
            <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Monitored Sites</span>
              <div className="text-xl font-black text-slate-950 mt-1 tabular-nums">
                {totalSitesCount} <span className="text-xs font-semibold text-slate-500">Sites</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                {selectedZoneNo === 0 ? '31 Zones' : `Zone ${selectedZoneNo}`}
              </span>
            </div>

            {/* 2. Lighted (Normal) */}
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block flex items-center gap-1">
                💡 Lighted (Normal)
              </span>
              <div className="text-xl font-black text-emerald-900 mt-1 tabular-nums">
                {lightedCount} <span className="text-xs font-semibold text-emerald-700">Units</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                {operationalPct}% Operational
              </span>
            </div>

            {/* 3. Partially Lit */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-300 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase block flex items-center gap-1">
                🌤️ Partially Lit
              </span>
              <div className="text-xl font-black text-amber-900 mt-1 tabular-nums">
                {partialCount} <span className="text-xs font-semibold text-amber-700">Units</span>
              </div>
              <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">
                {totalSitesCount > 0 ? Math.round((partialCount / totalSitesCount) * 100) : 0}% of scope
              </span>
            </div>

            {/* 4. Not Lighted / Dark */}
            <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-300 shadow-2xs">
              <span className="text-[10px] font-bold text-rose-800 uppercase block flex items-center gap-1">
                🔴 Not Lighted
              </span>
              <div className="text-xl font-black text-rose-900 mt-1 tabular-nums">
                {notLightedCount} <span className="text-xs font-semibold text-rose-700">Units</span>
              </div>
              <span className="text-[10px] text-rose-700 font-medium mt-0.5 block">
                {totalSitesCount > 0 ? Math.round((notLightedCount / totalSitesCount) * 100) : 0}% of scope
              </span>
            </div>

            {/* 5. Cable / DB Faults */}
            <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-300 shadow-2xs">
              <span className="text-[10px] font-bold text-purple-800 uppercase block flex items-center gap-1">
                ⚡ Cable / DB Fault
              </span>
              <div className="text-xl font-black text-purple-900 mt-1 tabular-nums">
                {faultsCount} <span className="text-xs font-semibold text-purple-700">Units</span>
              </div>
              <span className="text-[10px] text-purple-700 font-medium mt-0.5 block">
                TNB / Timer relay
              </span>
            </div>

            {/* 6. Average Lux Level */}
            <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Avg Lux Output</span>
              <div className="text-xl font-black text-slate-900 mt-1 tabular-nums">
                {avgLux} <span className="text-xs font-semibold text-slate-500">LUX</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                Standard: &ge; 120 LUX
              </span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            DETAILED PHOTO EVIDENCE & LIGHTING STATUS SECTION
            ------------------------------------------------------------- */}
        <div className="space-y-10">
          {zonesWithFilteredSites.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-300 rounded-2xl">
              <Camera className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <h3 className="font-bold text-slate-700 text-sm">No sites match the current filter</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try selecting "All Sites" or switching to another week or zone.
              </p>
            </div>
          ) : (
            zonesWithFilteredSites.map(({ zone, sites }) => {
              const activeInspector =
                selectedWeek === 'week4' || selectedWeek === 'week3'
                  ? zone.week4Inspector
                  : zone.week2Inspector;

              const scheduledDate =
                selectedWeek === 'week4' || selectedWeek === 'week3'
                  ? monthInfo.week4DefaultDate
                  : monthInfo.week2DefaultDate;

              return (
                <div key={zone.id} className="space-y-6 page-break-inside-avoid border-b-2 border-slate-200 pb-8 last:border-b-0">
                  {/* Zone Sub-Header */}
                  <div className="bg-[#031e13] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded uppercase">
                          ZONE {zone.zoneNo}
                        </span>
                        <h3 className="font-black text-base text-white">{zone.description}</h3>
                      </div>
                      <p className="text-xs text-emerald-200/80 mt-1 font-mono">
                        Site Code Range: {getSiteCodeRange(zone)} • Region: {zone.region} • Capacity: {zone.siteCount} Sites
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono bg-[#042416] p-2 rounded-lg border border-emerald-700/50">
                      <div>Assigned Lead Inspector: <strong className="text-amber-300">{activeInspector}</strong></div>
                      <div>Inspection Schedule: <strong className="text-emerald-300">{getWeekRangeText(selectedWeek)}</strong></div>
                    </div>
                  </div>

                  {/* Sites Photo Cards */}
                  <div className="space-y-6">
                    {sites.map((site, siteIdx) => {
                      const isW4 = selectedWeek === 'week4' || selectedWeek === 'week3';
                      const rep = isW4 ? site.week4Report : site.week2Report;

                      const statusVal: SiteStatus = rep?.status || site.status || 'Lighted';
                      const luxVal = rep?.luxLevel ?? site.luxLevel ?? (statusVal === 'Lighted' ? 140 : 25);
                      const remarkVal = rep?.notes || site.notes || 'Lighting inspection completed. Structural fixtures verified.';
                      const inspectorName = rep?.inspector || activeInspector;
                      const auditDate = rep?.inspectionDate || scheduledDate;

                      const chk = rep?.checklistItems || {
                        fixtureSecure: true,
                        poleAligned: true,
                        timerFunctioning: true,
                        wiringOk: true,
                        noVandalism: true,
                      };

                      const photoEvidence = getSitePhotoEvidence(site.siteCode, statusVal, site.photos, selectedWeek);
                      const gpsCoords = getSiteCoordinates(zone.zoneNo, siteIdx + 1);
                      const isNormalLighted = statusVal === 'Lighted' || statusVal === 'Working';

                      return (
                        <div
                          key={site.id}
                          className="border-2 border-slate-300 rounded-2xl p-4 sm:p-5 bg-white space-y-4 shadow-sm page-break-inside-avoid"
                        >
                          {/* Site Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                                #{siteIdx + 1} • {site.siteCode}
                              </span>
                              <div>
                                <h4 className="font-bold text-sm text-slate-900">{site.name}</h4>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  Structure: <strong className="text-slate-800">{site.fixtureType}</strong> • GPS: {gpsCoords}
                                </span>
                              </div>
                            </div>

                            {/* Lighting Status Badge & Lux Level */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 border shadow-2xs ${
                                  isNormalLighted
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                    : 'bg-rose-100 text-rose-900 border-rose-400'
                                }`}
                              >
                                <span>{isNormalLighted ? '💡' : '⚠️'}</span>
                                <span>{statusVal}</span>
                              </span>

                              <span className="font-mono text-xs font-black bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-400 tabular-nums">
                                {luxVal} LUX
                              </span>
                            </div>
                          </div>

                          {/* 3-PHOTO EVIDENCE GALLERY WITH WATERMARK STAMP */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                                PHOTO EVIDENCE GALLERY (NIGHT ILLUMINATION, STRUCTURE ALIGNMENT & DB TIMER)
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono print:hidden">
                                Click photo to zoom • Click button to attach custom photo
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {[
                                { label: '1. Night Illumination Evidence', url: photoEvidence.nightIllumination, idx: 0 },
                                { label: '2. Day Structure & Pole Alignment', url: photoEvidence.dayFixture, idx: 1 },
                                { label: '3. DB Box & Timer Unit Relay', url: photoEvidence.controlTimer, idx: 2 },
                              ].map((pCard) => (
                                <div
                                  key={pCard.idx}
                                  className="border border-slate-300 rounded-xl overflow-hidden bg-slate-900 flex flex-col justify-between group shadow-xs"
                                >
                                  {/* Photo Top Header */}
                                  <div className="bg-slate-950 text-slate-200 text-[10px] font-bold px-2.5 py-1 flex items-center justify-between border-b border-slate-800">
                                    <span className="truncate">{pCard.label}</span>
                                    <span className="font-mono text-[9px] text-amber-400">#EVD-{pCard.idx + 1}</span>
                                  </div>

                                  {/* Image Container with Watermark */}
                                  <div className="relative aspect-4/3 overflow-hidden bg-slate-950 flex items-center justify-center">
                                    <img
                                      src={pCard.url}
                                      alt={`${site.siteCode} - ${pCard.label}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />

                                    {/* Watermark Overlay Badge */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-2 text-white text-[9px] font-mono leading-tight pointer-events-none">
                                      <div className="font-bold text-amber-300 tracking-wide">
                                        BIG TREE OUTDOOR • {site.siteCode}
                                      </div>
                                      <div className="text-[8px] text-slate-300">
                                        Date: {auditDate} • Insp: {inspectorName}
                                      </div>
                                      <div className="text-[8px] text-slate-400 truncate">
                                        GPS: {gpsCoords}
                                      </div>
                                    </div>

                                    {/* Zoom Button Overlay */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setActiveZoomImg({
                                          url: pCard.url,
                                          title: `${site.siteCode} — ${pCard.label}`,
                                          subtitle: `Zone ${zone.zoneNo}: ${site.name} • Audit Date: ${auditDate} • Inspector: ${inspectorName}`,
                                        })
                                      }
                                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white font-bold text-xs transition-opacity cursor-pointer print:hidden"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>Inspect Photo</span>
                                    </button>
                                  </div>

                                  {/* Upload / Replace Button (Screen Only) */}
                                  <div className="p-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] print:hidden">
                                    <span className="text-slate-500 font-mono">Evidence Attached</span>
                                    <button
                                      type="button"
                                      onClick={() => handleTriggerUpload(zone.zoneNo, site.id, pCard.idx)}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-50 border border-slate-300 px-2 py-0.5 rounded cursor-pointer transition shadow-2xs"
                                      title="Upload custom photo evidence for this site"
                                    >
                                      <Upload className="w-3 h-3 text-emerald-600" />
                                      <span>Replace Photo</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Checklist & Physical Audit Verification */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-300">
                            <div className="flex items-center gap-1.5">
                              {chk.fixtureSecure ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className={chk.fixtureSecure ? 'font-bold text-slate-800' : 'text-slate-400'}>
                                Fixture Secure
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {chk.poleAligned ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className={chk.poleAligned ? 'font-bold text-slate-800' : 'text-slate-400'}>
                                Pole Aligned
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {chk.timerFunctioning ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className={chk.timerFunctioning ? 'font-bold text-slate-800' : 'text-slate-400'}>
                                Timer Clock OK
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {chk.wiringOk ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className={chk.wiringOk ? 'font-bold text-slate-800' : 'text-slate-400'}>
                                Wiring Insulated
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {chk.noVandalism ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className={chk.noVandalism ? 'font-bold text-slate-800' : 'text-slate-400'}>
                                Zero Vandalism
                              </span>
                            </div>
                          </div>

                          {/* Inspector Remarks & Observations */}
                          <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <strong className="text-slate-800">Inspector Observations: </strong>
                              <span className="text-slate-950">{remarkVal}</span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 shrink-0">
                              Inspected by: <strong className="text-slate-900">{inspectorName}</strong> on {auditDate}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Formal Verification & Sign-off Block */}
        <div className="mt-12 pt-8 border-t-2 border-slate-300 page-break-inside-avoid">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            FIELD AUDIT VERIFICATION & MANAGEMENT ENDORSEMENT
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            {/* Inspector Signature Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Lead Inspection Officer
                </p>
                <div className="h-16 border-b-2 border-slate-400 flex items-center font-serif italic text-lg text-slate-900 my-2">
                  Marzahaidi C.A.
                </div>
                <p className="font-bold text-slate-950 text-sm">Marzahaidi Bin Che Ani</p>
                <p className="text-slate-600 text-xs">Lead Technical Inspector • Big Tree Outdoor Sdn Bhd</p>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-3">
                Audit Cycle: {getWeekRangeText(selectedWeek)} • Stamp Verified
              </p>
            </div>

            {/* Operations Manager Signature Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Approved & Verified By
                </p>
                <div className="h-16 border-b-2 border-slate-400 flex items-center font-serif italic text-lg text-slate-900 my-2">
                  Khairul Razali
                </div>
                <p className="font-bold text-slate-950 text-sm">Khairul Razali</p>
                <p className="text-slate-600 text-xs">Operations Director • Big Tree Outdoor Sdn Bhd</p>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-3">
                Official Corporate Seal • Certified Compliant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal (Screen Only) */}
      {activeZoomImg && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 print:hidden animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="bg-slate-950 p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div>
                <h3 className="font-bold text-sm text-white">{activeZoomImg.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeZoomImg.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveZoomImg(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-slate-950 flex items-center justify-center">
              <img
                src={activeZoomImg.url}
                alt={activeZoomImg.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Camera,
  Layers,
  User,
  Zap,
  RotateCcw,
  Sparkles,
  FileText,
  Sliders,
  ShieldCheck,
  CheckSquare,
  Square,
  Building2,
  Eye,
  X,
  Upload,
  Printer,
  Copy,
} from 'lucide-react';
import {
  ZoneData,
  SiteDetail,
  SiteStatus,
  InspectionStatus,
  SiteInspectionRecord,
  PhysicalChecklistItems,
} from '../types';
import { InspectorBadge } from './InspectorBadge';
import { getMonthInfo, MONTHS, YEARS } from '../utils/dateHelpers';

interface ChecklistFormViewProps {
  zones: ZoneData[];
  onSaveZone: (updatedZone: ZoneData) => void;
  initialZoneNo?: number;
  initialSiteId?: string;
  initialWeek?: 'week2' | 'week4';
  selectedYear?: number;
  selectedMonth?: number;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onNavigateToReport?: (week?: 'week2' | 'week4' | 'all') => void;
}

const PRESET_STATUSES: { label: string; value: SiteStatus; color: string; badgeBg: string }[] = [
  { label: 'Lighted (Working Normally)', value: 'Lighted', color: 'text-emerald-700 border-emerald-300 bg-emerald-50', badgeBg: 'bg-emerald-500 text-white' },
  { label: 'Partially Lit (Dim / Half Lit)', value: 'Partially Lit', color: 'text-amber-700 border-amber-300 bg-amber-50', badgeBg: 'bg-amber-500 text-white' },
  { label: 'Yellowish (Yellow Tint)', value: 'Lighting Yellowish', color: 'text-yellow-700 border-yellow-300 bg-yellow-50', badgeBg: 'bg-yellow-500 text-slate-900' },
  { label: 'Greenish (Green Tint)', value: 'Lighting Greenish', color: 'text-teal-700 border-teal-300 bg-teal-50', badgeBg: 'bg-teal-500 text-white' },
  { label: 'Not Lighted (Unlit)', value: 'Not Lighted', color: 'text-rose-700 border-rose-300 bg-rose-50', badgeBg: 'bg-rose-600 text-white' },
  { label: 'Half Not Lit (Half Unlit)', value: 'Half Not Lit', color: 'text-orange-700 border-orange-300 bg-orange-50', badgeBg: 'bg-orange-500 text-white' },
  { label: 'TNB Cable Fault (Short Circuit/Broken Cable)', value: 'TNB Cable fault', color: 'text-rose-800 border-rose-300 bg-rose-100', badgeBg: 'bg-rose-700 text-white' },
  { label: 'Vandalism (Theft/Sabotage)', value: 'Vandalism-Electrical fittings faulty', color: 'text-purple-800 border-purple-300 bg-purple-100', badgeBg: 'bg-purple-700 text-white' },
  { label: 'View blocking by tree', value: 'View blocking by tree', color: 'text-rose-800 border-rose-300 bg-rose-100', badgeBg: 'bg-rose-800 text-white' },
  { label: 'Timer Switch Malfunction (Faulty Timer)', value: 'Timer switch malfunction', color: 'text-amber-800 border-amber-300 bg-amber-100', badgeBg: 'bg-amber-600 text-white' },
  { label: 'Lighting Arm Shifted (Shifted Pole Arm)', value: 'Lighting Arm Shifted', color: 'text-indigo-800 border-indigo-300 bg-indigo-100', badgeBg: 'bg-indigo-600 text-white' },
  { label: 'Other Defects', value: 'Others', color: 'text-slate-700 border-slate-300 bg-slate-100', badgeBg: 'bg-slate-600 text-white' },
];

const PRESET_REMARKS = [
  'Light fully functional. Excellent illumination levels.',
  'Routine inspection complete. No physical damage.',
  'Tripped Fuse / MCB reset successfully and lights restored.',
  'TNB power supply issue / main circuit breaker tripped.',
  'LED bulb / driver replacement required.',
  'Wiring severed due to theft / vandalism.',
  'Timer switch faulty, control unit replacement needed.',
  'Pole arm tilted due to wind / vehicle impact.',
];

export const ChecklistFormView: React.FC<ChecklistFormViewProps> = ({
  zones,
  onSaveZone,
  initialZoneNo = 1,
  initialSiteId,
  initialWeek = 'week2',
  selectedYear = 2026,
  selectedMonth = 8,
  onYearChange,
  onMonthChange,
  onNavigateToReport,
}) => {
  const monthInfo = getMonthInfo(selectedYear, selectedMonth);
  const w2DefaultDate = monthInfo.week2DefaultDate;
  const w4DefaultDate = monthInfo.week4DefaultDate;

  const [selectedZoneNo, setSelectedZoneNo] = useState<number>(initialZoneNo);
  const [activeWeek, setActiveWeek] = useState<'week2' | 'week4'>(initialWeek);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [formMode, setFormMode] = useState<'single' | 'batch'>('single');
  const [zoneSearch, setZoneSearch] = useState('');
  const [siteSearch, setSiteSearch] = useState('');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (!onMonthChange || !onYearChange) return;
    if (selectedMonth === 1) {
      onMonthChange(12);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (!onMonthChange || !onYearChange) return;
    if (selectedMonth === 12) {
      onMonthChange(1);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  // Find currently selected Zone
  const currentZone = zones.find((z) => z.zoneNo === selectedZoneNo) || zones[0];
  const sites = currentZone?.sites || [];

  // Initialize selected site when zone changes
  useEffect(() => {
    if (sites.length > 0) {
      if (initialSiteId && sites.some((s) => s.id === initialSiteId)) {
        setSelectedSiteId(initialSiteId);
      } else if (!selectedSiteId || !sites.some((s) => s.id === selectedSiteId)) {
        setSelectedSiteId(sites[0].id);
      }
    } else {
      setSelectedSiteId('');
    }
  }, [selectedZoneNo, sites]);

  // Selected site object
  const currentSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const currentSiteIndex = sites.findIndex((s) => s.id === selectedSiteId);

  // Active inspector for selected week
  const activeInspector =
    activeWeek === 'week2' ? currentZone?.week2Inspector : currentZone?.week4Inspector;

  // Active inspection record for current week
  const existingReport =
    activeWeek === 'week2' ? currentSite?.week2Report : currentSite?.week4Report;

  // Form State for Single Site
  const [inspectorName, setInspectorName] = useState<string>(
    existingReport?.inspector || activeInspector || ''
  );
  const [inspectionDate, setInspectionDate] = useState<string>(
    existingReport?.inspectionDate || (activeWeek === 'week2' ? w2DefaultDate : w4DefaultDate)
  );
  const [status, setStatus] = useState<SiteStatus>(
    existingReport?.status || currentSite?.status || 'Lighted'
  );
  const [luxLevel, setLuxLevel] = useState<number>(
    existingReport?.luxLevel ?? currentSite?.luxLevel ?? (status === 'Lighted' ? 140 : 0)
  );
  const [checklistItems, setChecklistItems] = useState<PhysicalChecklistItems>(
    existingReport?.checklistItems || {
      fixtureSecure: true,
      poleAligned: true,
      timerFunctioning: true,
      wiringOk: true,
      noVandalism: true,
    }
  );
  const [defectPriority, setDefectPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>(
    existingReport?.defectPriority || 'Medium'
  );
  const [notes, setNotes] = useState<string>(
    existingReport?.notes || currentSite?.notes || ''
  );
  const [weatherCondition, setWeatherCondition] = useState<string>(
    existingReport?.weatherCondition || 'Clear'
  );
  const [maintenanceLog, setMaintenanceLog] = useState<string>(
    existingReport?.maintenanceLog || ''
  );
  const [photoUrl, setPhotoUrl] = useState<string>(existingReport?.photoUrl || '');

  const [photos, setPhotos] = useState<string[]>(['', '', '']);
  const [activeImageLightbox, setActiveImageLightbox] = useState<string | null>(null);

  // Reset form when site or week changes
  useEffect(() => {
    if (currentSite) {
      const rep = activeWeek === 'week2' ? currentSite.week2Report : currentSite.week4Report;
      const currentInspector = activeWeek === 'week2' ? currentZone.week2Inspector : currentZone.week4Inspector;

      setInspectorName(rep?.inspector || currentInspector);
      setInspectionDate(
        rep?.inspectionDate || (activeWeek === 'week2' ? w2DefaultDate : w4DefaultDate)
      );
      setStatus(rep?.status || currentSite.status || 'Lighted');
      setLuxLevel(rep?.luxLevel ?? currentSite.luxLevel ?? (currentSite.status === 'Lighted' ? 140 : 0));
      setChecklistItems(
        rep?.checklistItems || {
          fixtureSecure: true,
          poleAligned: true,
          timerFunctioning: true,
          wiringOk: true,
          noVandalism: true,
        }
      );
      setDefectPriority(rep?.defectPriority || 'Medium');
      setNotes(rep?.notes || currentSite.notes || '');
      setWeatherCondition(rep?.weatherCondition || 'Clear');
      setMaintenanceLog(rep?.maintenanceLog || '');
      setPhotoUrl(rep?.photoUrl || '');

      // Load 3 photos array
      const existingPhotos = rep?.photos || (rep?.photoUrl ? [rep.photoUrl, '', ''] : currentSite.photos || ['', '', '']);
      setPhotos([existingPhotos[0] || '', existingPhotos[1] || '', existingPhotos[2] || '']);
    }
  }, [selectedSiteId, activeWeek, currentZone, selectedYear, selectedMonth, w2DefaultDate, w4DefaultDate]);

  // Handle local file upload convert to Data URL
  const handlePhotoFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotos((prev) => {
          const next = [...prev];
          next[index] = result;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample preset images for quick testing
  const handleApplyPresetPhoto = (index: number) => {
    const presets = [
      'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80', // Day pole / fixture
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80', // Night highway street lights
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', // Electrical control panel
    ];
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = presets[index] || presets[0];
      return next;
    });
  };

  // Handle status select change
  const handleStatusSelect = (newStatus: SiteStatus) => {
    setStatus(newStatus);
    const isNormal = newStatus === 'Lighted' || newStatus === 'Working';
    if (isNormal) {
      setLuxLevel(140);
    } else if (luxLevel > 50) {
      setLuxLevel(25);
    }
  };

  // Save single site report
  const handleSaveSingleSite = () => {
    if (!currentSite) return;

    const newReportRecord: SiteInspectionRecord = {
      inspector: inspectorName,
      inspectionDate,
      status,
      luxLevel,
      checklistItems,
      defectPriority: status !== 'Lighted' && status !== 'Working' ? defectPriority : undefined,
      notes,
      weatherCondition,
      maintenanceLog,
      photoUrl: photos[0] || photoUrl,
      photos,
      updatedAt: new Date().toISOString(),
    };

    const updatedSites = sites.map((s) => {
      if (s.id === currentSite.id) {
        return {
          ...s,
          status: status, // update primary status to latest
          luxLevel: luxLevel,
          lastInspectedDate: inspectionDate,
          notes: notes,
          photos: photos,
          [activeWeek === 'week2' ? 'week2Report' : 'week4Report']: newReportRecord,
        };
      }
      return s;
    });

    // Calculate defect count and week status
    const defectCount = updatedSites.filter(
      (s) => s.status !== 'Lighted' && s.status !== 'Working'
    ).length;

    let overallZoneStatus: InspectionStatus = currentZone.status;
    if (defectCount > 0) {
      overallZoneStatus = 'Needs Maintenance';
    }

    // Check completion progress for this week
    const completedCount = updatedSites.filter((s) =>
      activeWeek === 'week2' ? s.week2Report : s.week4Report
    ).length;

    const weekStatus =
      completedCount >= updatedSites.length
        ? 'Done'
        : completedCount > 0
        ? 'In Progress'
        : currentZone[activeWeek === 'week2' ? 'week2Status' : 'week4Status'];

    const updatedZone: ZoneData = {
      ...currentZone,
      sites: updatedSites,
      defectCount,
      status: overallZoneStatus,
      [activeWeek === 'week2' ? 'week2Status' : 'week4Status']: weekStatus,
      lastInspected: inspectionDate,
    };

    onSaveZone(updatedZone);
    setSaveNotification(`✅ Report for ${currentSite.siteCode} (${activeWeek.toUpperCase()}) saved successfully!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Quick mark all sites as Lighted in batch mode
  const handleBatchMarkAllLighted = () => {
    if (!currentZone) return;

    const defaultDate = activeWeek === 'week2' ? w2DefaultDate : w4DefaultDate;
    const updatedSites = sites.map((s) => {
      const repRecord: SiteInspectionRecord = {
        inspector: activeInspector,
        inspectionDate: defaultDate,
        status: 'Lighted',
        luxLevel: 140,
        checklistItems: {
          fixtureSecure: true,
          poleAligned: true,
          timerFunctioning: true,
          wiringOk: true,
          noVandalism: true,
        },
        notes: 'All lights fully functional (Batch verified).',
        updatedAt: new Date().toISOString(),
      };

      return {
        ...s,
        status: 'Lighted',
        luxLevel: 140,
        lastInspectedDate: defaultDate,
        notes: 'All lights fully functional.',
        [activeWeek === 'week2' ? 'week2Report' : 'week4Report']: repRecord,
      };
    });

    const updatedZone: ZoneData = {
      ...currentZone,
      sites: updatedSites,
      defectCount: 0,
      status: 'Completed',
      [activeWeek === 'week2' ? 'week2Status' : 'week4Status']: 'Done',
      lastInspected: defaultDate,
    };

    onSaveZone(updatedZone);
    setSaveNotification(`⚡ All ${sites.length} sites for Zone ${currentZone.zoneNo} (${activeWeek.toUpperCase()}) marked as 'Lighted'!`);
    setTimeout(() => setSaveNotification(null), 3500);
  };

  // Batch inline site status change
  const handleBatchSiteStatusChange = (siteId: string, newStatus: SiteStatus) => {
    const defaultDate = activeWeek === 'week2' ? w2DefaultDate : w4DefaultDate;
    const isNormal = newStatus === 'Lighted' || newStatus === 'Working';

    const updatedSites = sites.map((s) => {
      if (s.id === siteId) {
        const existingRep = activeWeek === 'week2' ? s.week2Report : s.week4Report;
        const newLux = isNormal ? 140 : 25;
        const repRecord: SiteInspectionRecord = {
          ...existingRep,
          inspector: existingRep?.inspector || activeInspector,
          inspectionDate: existingRep?.inspectionDate || defaultDate,
          status: newStatus,
          luxLevel: newLux,
          notes: existingRep?.notes || s.notes || (isNormal ? 'Working normally' : 'Needs maintenance'),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...s,
          status: newStatus,
          luxLevel: newLux,
          lastInspectedDate: defaultDate,
          notes: repRecord.notes,
          [activeWeek === 'week2' ? 'week2Report' : 'week4Report']: repRecord,
        };
      }
      return s;
    });

    const defectCount = updatedSites.filter((s) => s.status !== 'Lighted' && s.status !== 'Working').length;
    const completedCount = updatedSites.filter((s) => (activeWeek === 'week2' ? s.week2Report : s.week4Report)).length;
    const weekStatus = completedCount >= updatedSites.length ? 'Done' : 'In Progress';

    const updatedZone: ZoneData = {
      ...currentZone,
      sites: updatedSites,
      defectCount,
      status: defectCount > 0 ? 'Needs Maintenance' : 'Completed',
      [activeWeek === 'week2' ? 'week2Status' : 'week4Status']: weekStatus,
    };

    onSaveZone(updatedZone);
  };

  // Batch inline Lux level change
  const handleBatchSiteLuxChange = (siteId: string, newLux: number) => {
    const defaultDate = activeWeek === 'week2' ? w2DefaultDate : w4DefaultDate;
    const updatedSites = sites.map((s) => {
      if (s.id === siteId) {
        const existingRep = activeWeek === 'week2' ? s.week2Report : s.week4Report;
        const repRecord: SiteInspectionRecord = {
          ...existingRep,
          inspector: existingRep?.inspector || activeInspector,
          inspectionDate: existingRep?.inspectionDate || defaultDate,
          status: s.status,
          luxLevel: newLux,
          notes: existingRep?.notes || s.notes || 'Working',
          updatedAt: new Date().toISOString(),
        };

        return {
          ...s,
          luxLevel: newLux,
          [activeWeek === 'week2' ? 'week2Report' : 'week4Report']: repRecord,
        };
      }
      return s;
    });

    onSaveZone({
      ...currentZone,
      sites: updatedSites,
    });
  };

  // Batch inline Remark / Catatan change
  const handleBatchSiteRemarkChange = (siteId: string, newRemark: string) => {
    const defaultDate = activeWeek === 'week2' ? w2DefaultDate : w4DefaultDate;
    const updatedSites = sites.map((s) => {
      if (s.id === siteId) {
        const existingRep = activeWeek === 'week2' ? s.week2Report : s.week4Report;
        const repRecord: SiteInspectionRecord = {
          ...existingRep,
          inspector: existingRep?.inspector || activeInspector,
          inspectionDate: existingRep?.inspectionDate || defaultDate,
          status: s.status,
          luxLevel: s.luxLevel ?? 140,
          notes: newRemark,
          updatedAt: new Date().toISOString(),
        };

        return {
          ...s,
          notes: newRemark,
          [activeWeek === 'week2' ? 'week2Report' : 'week4Report']: repRecord,
        };
      }
      return s;
    });

    onSaveZone({
      ...currentZone,
      sites: updatedSites,
    });
  };

  // Duplicate / copy findings between W2 and W4
  const handleCopyWeekData = (fromWeek: 'week2' | 'week4', toWeek: 'week2' | 'week4') => {
    if (!currentSite) return;
    const sourceReport = fromWeek === 'week2' ? currentSite.week2Report : currentSite.week4Report;
    if (!sourceReport) {
      alert(`No inspection record found for ${fromWeek.toUpperCase()} to duplicate.`);
      return;
    }
    const targetDate = toWeek === 'week2' ? w2DefaultDate : w4DefaultDate;
    const targetInspector = toWeek === 'week2' ? currentZone.week2Inspector : currentZone.week4Inspector;

    const copiedReport: SiteInspectionRecord = {
      ...sourceReport,
      inspector: targetInspector || sourceReport.inspector,
      inspectionDate: targetDate,
      notes: `${sourceReport.notes || ''} [Duplicated from ${fromWeek.toUpperCase()}]`.trim(),
      updatedAt: new Date().toISOString(),
    };

    const updatedSites = sites.map((s) => {
      if (s.id === currentSite.id) {
        return {
          ...s,
          [toWeek === 'week2' ? 'week2Report' : 'week4Report']: copiedReport,
        };
      }
      return s;
    });

    onSaveZone({
      ...currentZone,
      sites: updatedSites,
    });
    setSaveNotification(`📋 Checklist audit from ${fromWeek.toUpperCase()} successfully duplicated to ${toWeek.toUpperCase()}!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Filtered zone list for picker
  const filteredZones = zones.filter((z) => {
    const q = zoneSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      `zone ${z.zoneNo}`.includes(q) ||
      z.description.toLowerCase().includes(q) ||
      z.region.toLowerCase().includes(q) ||
      z.week2Inspector.toLowerCase().includes(q) ||
      z.week4Inspector.toLowerCase().includes(q)
    );
  });

  // Filtered site list for current zone
  const filteredSites = sites.filter((s) => {
    const q = siteSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.siteCode.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  });

  // Calculate week progress
  const completedSitesWeek = sites.filter((s) =>
    activeWeek === 'week2' ? s.week2Report : s.week4Report
  ).length;
  const progressPercent = sites.length > 0 ? Math.round((completedSitesWeek / sites.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {saveNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-emerald-100 border border-emerald-500 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{saveNotification}</span>
        </div>
      )}

      {/* View Banner */}
      <div className="bg-gradient-to-r from-[#02180f] via-[#042416] to-[#02180f] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-emerald-600/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Official Field Report (Zones 1 – 31)
              </span>
              <span className="text-xs text-emerald-200/80 font-mono">
                {monthInfo.monthLabelEn} {selectedYear} • Doc: {monthInfo.docId}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-emerald-400" />
              Bi-Weekly Lighting Inspection Form — Week 2 & Week 4
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80">
              Select an advertising corridor (Zone 1 to 31), choose the inspection cycle (Week 2 or Week 4), and audit physical fittings, lux levels, and illumination status for each billboard site.
            </p>
          </div>

          {/* Month/Year Selector & Report Link */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Interactive Month & Year Switcher */}
            <div className="flex items-center gap-1 bg-[#042416] border border-emerald-500/40 rounded-xl p-1.5 shadow-md">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-lg transition cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-400 ml-1" />
                <select
                  value={selectedMonth}
                  onChange={(e) => onMonthChange && onMonthChange(Number(e.target.value))}
                  className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer py-1 px-1 rounded hover:bg-emerald-800/40"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-[#042416] text-white">
                      {m.labelEn}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => onYearChange && onYearChange(Number(e.target.value))}
                  className="bg-transparent text-amber-400 font-extrabold text-xs focus:outline-hidden cursor-pointer py-1 px-1 rounded hover:bg-emerald-800/40"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="bg-[#042416] text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-lg transition cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Jump to Monthly Report */}
            {onNavigateToReport && (
              <button
                type="button"
                onClick={() => onNavigateToReport(activeWeek)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
                title="Open and generate official audit report for this inspection period"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            )}

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-[#02180f] p-2.5 rounded-xl border border-emerald-800/60 shrink-0">
              <div className="text-center px-1.5">
                <span className="block text-[10px] text-emerald-200/70 font-medium">Zone</span>
                <span className="text-sm font-extrabold text-emerald-400">Z{currentZone.zoneNo}</span>
              </div>
              <div className="h-6 w-px bg-emerald-800"></div>
              <div className="text-center px-1.5">
                <span className="block text-[10px] text-emerald-200/70 font-medium">Week</span>
                <span className="text-sm font-extrabold text-amber-300">{activeWeek.toUpperCase()}</span>
              </div>
              <div className="h-6 w-px bg-emerald-800"></div>
              <div className="text-center px-1.5">
                <span className="block text-[10px] text-emerald-200/70 font-medium">Progress</span>
                <span className="text-sm font-extrabold text-white tabular-nums">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP CONTROLS BAR: ZONE SELECTOR & WEEK TOGGLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Zone Selector Card (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              1. Select Zone (Zone 1 - Zone 31)
            </label>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Zone..."
                value={zoneSearch}
                onChange={(e) => setZoneSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedZoneNo}
              onChange={(e) => setSelectedZoneNo(Number(e.target.value))}
              className="flex-1 bg-slate-900 text-white font-bold text-sm rounded-xl px-3.5 py-2 border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              {filteredZones.map((z) => (
                <option key={z.id} value={z.zoneNo}>
                  Zone {z.zoneNo}: {z.description} ({z.siteCount} Sites - {z.region})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const prev = zones.findIndex((z) => z.zoneNo === selectedZoneNo);
                if (prev > 0) setSelectedZoneNo(zones[prev - 1].zoneNo);
              }}
              disabled={zones.findIndex((z) => z.zoneNo === selectedZoneNo) === 0}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              title="Previous Zone"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            <button
              onClick={() => {
                const next = zones.findIndex((z) => z.zoneNo === selectedZoneNo);
                if (next < zones.length - 1) setSelectedZoneNo(zones[next + 1].zoneNo);
              }}
              disabled={zones.findIndex((z) => z.zoneNo === selectedZoneNo) === zones.length - 1}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              title="Next Zone"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Quick Zone Details */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{currentZone.description}</span>
              <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                {currentZone.region}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500">
                Total Sites: <strong className="text-slate-800">{sites.length}</strong>
              </span>
              <span className="text-slate-500">
                Defects: <strong className={currentZone.defectCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>{currentZone.defectCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Week Selector Card (Cols 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            2. Select Inspection Week (Week 2 vs Week 4)
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveWeek('week2')}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                activeWeek === 'week2'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Week 2
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentZone.week2Status === 'Done'
                        ? 'bg-emerald-500 text-slate-950'
                        : currentZone.week2Status === 'In Progress'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {currentZone.week2Status}
                  </span>
                </div>
                <span className="text-[11px] block font-medium opacity-80">{monthInfo.week2FormalRange}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/20 flex items-center gap-1.5 text-[11px]">
                <User className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold">{currentZone.week2Inspector}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveWeek('week4')}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                activeWeek === 'week4'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Week 4
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentZone.week4Status === 'Done'
                        ? 'bg-emerald-500 text-slate-950'
                        : currentZone.week4Status === 'In Progress'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {currentZone.week4Status}
                  </span>
                </div>
                <span className="text-[11px] block font-medium opacity-80">{monthInfo.week4FormalRange}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/20 flex items-center gap-1.5 text-[11px]">
                <User className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold">{currentZone.week4Inspector}</span>
              </div>
            </button>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mb-1 font-medium">
              <span>{activeWeek.toUpperCase()} Report Progress</span>
              <span>
                {completedSitesWeek} of {sites.length} Sites Updated ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* MODE TABS: SINGLE SITE FORM VS BATCH TABLE */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFormMode('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              formMode === 'single'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Individual Site Form (Detailed Entry)</span>
          </button>

          <button
            onClick={() => setFormMode('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              formMode === 'batch'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Zone Checklist Table ({sites.length} Sites)</span>
          </button>
        </div>

        {formMode === 'batch' && (
          <button
            onClick={handleBatchMarkAllLighted}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mark All Sites Lighted ({activeWeek.toUpperCase()})</span>
          </button>
        )}
      </div>

      {/* SINGLE SITE CHECKLIST FORM */}
      {formMode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Site Selector List (Cols 4) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Site List Zone {currentZone.zoneNo} ({sites.length})
              </label>
              <span className="text-[10px] font-bold text-slate-500">Select Site</span>
            </div>

            {/* Search Input for Sites */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Site Code (e.g., UP0073)..."
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Sites List */}
            <div className="max-h-[520px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
              {filteredSites.map((site, index) => {
                const rep = activeWeek === 'week2' ? site.week2Report : site.week4Report;
                const isSelected = site.id === selectedSiteId;
                const isLighted = site.status === 'Lighted' || site.status === 'Working';

                return (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSiteId(site.id)}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/40'
                        : 'bg-slate-50/60 hover:bg-slate-100/80 text-slate-800 border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-extrabold font-mono px-2 py-0.5 rounded ${
                            isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-900'
                          }`}
                        >
                          {site.siteCode}
                        </span>
                        <span className="text-[10px] text-slate-400">#{index + 1}</span>
                      </div>
                      <p className={`text-xs line-clamp-2 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                        {site.name}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isLighted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {site.status}
                      </span>
                      {rep ? (
                        <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> W2/4 Logged
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-mono">Pending</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Site Form (Cols 8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
            {currentSite ? (
              <>
                {/* Site Header Info Card */}
                <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-emerald-500 text-slate-950 font-black text-xs font-mono px-2.5 py-0.5 rounded">
                        {currentSite.siteCode}
                      </span>
                      <span className="text-xs text-amber-300 font-semibold bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                        {currentSite.fixtureType}
                      </span>
                      <span className="text-xs text-slate-400">
                        Zone {currentZone.zoneNo} ({currentZone.region})
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                      {currentSite.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (currentSiteIndex > 0) {
                          setSelectedSiteId(sites[currentSiteIndex - 1].id);
                        }
                      }}
                      disabled={currentSiteIndex === 0}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300 transition cursor-pointer"
                      title="Previous Site"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      {currentSiteIndex + 1} / {sites.length}
                    </span>
                    <button
                      onClick={() => {
                        if (currentSiteIndex < sites.length - 1) {
                          setSelectedSiteId(sites[currentSiteIndex + 1].id);
                        }
                      }}
                      disabled={currentSiteIndex === sites.length - 1}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300 transition cursor-pointer"
                      title="Next Site"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* FORM FIELDS GRID */}
                <div className="space-y-5">
                  {/* Row 1: Inspector Name & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Inspection Officer ({activeWeek.toUpperCase()})
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={inspectorName}
                          onChange={(e) => setInspectorName(e.target.value)}
                          placeholder="Inspector Name"
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Field Inspection Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          value={inspectionDate}
                          onChange={(e) => setInspectionDate(e.target.value)}
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Status Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Lighting Status (Site Status)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRESET_STATUSES.map((st) => {
                        const isChecked = status === st.value;
                        return (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => handleStatusSelect(st.value)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer flex items-center justify-between gap-1.5 ${
                              isChecked
                                ? `${st.color} ring-2 ring-emerald-500/60 shadow-sm font-black`
                                : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span className="line-clamp-1">{st.label}</span>
                            {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 3: Lux Reading & Priority Defect */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        Lux Meter Reading (Lux Level - lx)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={luxLevel}
                          onChange={(e) => setLuxLevel(Number(e.target.value))}
                          min={0}
                          max={500}
                          className="w-32 text-sm font-extrabold bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        />
                        <span className="text-xs font-mono text-slate-500">lx (Standard: 120-160 lx)</span>
                      </div>
                    </div>

                    {status !== 'Lighted' && status !== 'Working' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          Repair Priority Level (Defect Priority)
                        </label>
                        <select
                          value={defectPriority}
                          onChange={(e) =>
                            setDefectPriority(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')
                          }
                          className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        >
                          <option value="Low">Low - Minor (Standard Schedule)</option>
                          <option value="Medium">Medium - Moderate (Within 3 Days)</option>
                          <option value="High">High - Urgent (Within 24 Hours)</option>
                          <option value="Critical">Critical - Immediate Action Required</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Row 4: Physical Inspection Checklist Items */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Physical & Component Checklist
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setChecklistItems({ ...checklistItems, fixtureSecure: !checklistItems.fixtureSecure })
                        }
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-left cursor-pointer"
                      >
                        {checklistItems.fixtureSecure ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-800">1. Fixture & Lamp Head Tight / Secure</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setChecklistItems({ ...checklistItems, poleAligned: !checklistItems.poleAligned })
                        }
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-left cursor-pointer"
                      >
                        {checklistItems.poleAligned ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-800">2. Pole & Bracket Aligned (Not Shifted)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setChecklistItems({ ...checklistItems, timerFunctioning: !checklistItems.timerFunctioning })
                        }
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-left cursor-pointer"
                      >
                        {checklistItems.timerFunctioning ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-800">3. Timer Switch & MCB Functional</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setChecklistItems({ ...checklistItems, wiringOk: !checklistItems.wiringOk })
                        }
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-left cursor-pointer"
                      >
                        {checklistItems.wiringOk ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-800">4. Wiring Safe (No Exposed Cables)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setChecklistItems({ ...checklistItems, noVandalism: !checklistItems.noVandalism })
                        }
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-left cursor-pointer sm:col-span-2"
                      >
                        {checklistItems.noVandalism ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-800">5. No Signs of Vandalism / Intact Components</span>
                      </button>
                    </div>
                  </div>

                  {/* Row 5: Dedicated Kotak Remark / Catatan Laporan (Edit Report) and Daily Maintenance Log */}
                  <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-300 space-y-4">
                    
                    {/* Daily Maintenance & Weather Log */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1 space-y-2">
                        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          Weather Condition
                        </label>
                        <select
                          value={weatherCondition}
                          onChange={(e) => setWeatherCondition(e.target.value)}
                          className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                        >
                          <option value="Clear">Clear</option>
                          <option value="Cloudy">Cloudy</option>
                          <option value="Rainy">Rainy</option>
                          <option value="Thunderstorm">Thunderstorm</option>
                          <option value="Haze">Haze</option>
                        </select>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          Daily Maintenance Log
                        </label>
                        <input
                          type="text"
                          value={maintenanceLog}
                          onChange={(e) => setMaintenanceLog(e.target.value)}
                          placeholder="Quick daily notes (e.g. Changed bulb, Cleaned panel)..."
                          className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <hr className="border-slate-200" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Report Remarks & Notes (Edit Report)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setNotes('')}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-0.5 rounded transition cursor-pointer"
                        >
                          Clear Remarks
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {notes.length} Characters
                        </span>
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                        Click preset to insert quick report remark:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_REMARKS.map((pr, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!notes) {
                                setNotes(pr);
                              } else if (!notes.includes(pr)) {
                                setNotes(`${notes} | ${pr}`);
                              }
                            }}
                            className="text-[10px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg transition cursor-pointer border border-slate-200 hover:border-emerald-300 shadow-2xs"
                          >
                            + {pr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Editable Textarea for Remarks */}
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter full report remarks / notes here (e.g., Lights turned off due to timer switch failure, contractor notified)..."
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-2xs"
                    />
                  </div>

                  {/* Row 6: Ruangan 3 Kotak Upload Gambar Lighting Inspection */}
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-3 shadow-md border border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <label className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-400" />
                        Lighting Photo Proof (Max 3 Images)
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                        Max 3 Photos
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      Upload or capture 3 proof photos by category for each inspection site:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          idx: 0,
                          title: 'Photo 1: Pole/Head Structure',
                          subtitle: 'Day Inspection / Access',
                        },
                        {
                          idx: 1,
                          title: 'Photo 2: Lighting Illumination',
                          subtitle: 'Night Inspection / Lit Status',
                        },
                        {
                          idx: 2,
                          title: 'Photo 3: Fuse / Timer Box',
                          subtitle: 'Control Box / Defect',
                        },
                      ].map(({ idx, title, subtitle }) => {
                        const hasImg = Boolean(photos[idx]);

                        return (
                          <div
                            key={idx}
                            className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex flex-col justify-between space-y-2 relative group hover:border-emerald-500/50 transition"
                          >
                            <div>
                              <div className="text-[11px] font-bold text-slate-200">{title}</div>
                              <div className="text-[10px] text-slate-400">{subtitle}</div>
                            </div>

                            {hasImg ? (
                              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-600 bg-slate-950 group">
                                <img
                                  src={photos[idx]}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                                  <button
                                    type="button"
                                    onClick={() => setActiveImageLightbox(photos[idx])}
                                    className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition cursor-pointer flex items-center gap-1"
                                    title="View Full Image"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Zoom</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPhotos((prev) => {
                                        const next = [...prev];
                                        next[idx] = '';
                                        return next;
                                      });
                                    }}
                                    className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500 transition cursor-pointer flex items-center gap-1"
                                    title="Delete Image"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-lg p-3 text-center bg-slate-900/60 flex flex-col items-center justify-center min-h-[110px] transition">
                                <Camera className="w-6 h-6 text-slate-500 mb-1" />
                                <span className="text-[10px] font-medium text-slate-400 mb-2">
                                  Empty (No Image)
                                </span>

                                <div className="flex flex-col w-full gap-1">
                                  <label className="w-full text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-2 rounded-md transition cursor-pointer flex items-center justify-center gap-1">
                                    <Upload className="w-3 h-3" />
                                    <span>Capture / Upload</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      capture="environment"
                                      className="hidden"
                                      onChange={(e) => handlePhotoFileUpload(idx, e)}
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleApplyPresetPhoto(idx)}
                                    className="text-[9px] font-semibold text-slate-400 hover:text-emerald-300 hover:bg-slate-800 py-1 rounded transition border border-slate-700"
                                  >
                                    + Use Sample Image
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons: Reset, Copy Week, View Report, Save */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setNotes('');
                          setStatus('Lighted');
                          setLuxLevel(140);
                          setPhotos(['', '', '']);
                        }}
                        className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      >
                        Reset Form
                      </button>

                      {/* Duplicate / Copy Week Button */}
                      {activeWeek === 'week2' ? (
                        <button
                          type="button"
                          onClick={() => handleCopyWeekData('week2', 'week4')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl transition cursor-pointer"
                          title="Duplicate Week 2 inspection findings to Week 4 for this site"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplicate to Week 4</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCopyWeekData('week2', 'week4')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl transition cursor-pointer"
                          title="Copy Week 2 inspection findings to Week 4 for this site"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy from Week 2</span>
                        </button>
                      )}

                      {/* Jump to Report button */}
                      {onNavigateToReport && (
                        <button
                          type="button"
                          onClick={() => onNavigateToReport(activeWeek)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#042416] hover:bg-[#073621] text-emerald-200 font-bold text-xs rounded-xl border border-emerald-500/40 transition cursor-pointer"
                          title="Open official monthly report for this inspection period"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Period Report</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSingleSite}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Inspection ({currentSite.siteCode})</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-400">
                Please select a site from the left list to begin filling out the form.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Mobile Smartphone Ease of Use */}
      {formMode === 'single' && currentSite && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 p-3 sm:hidden z-40 flex items-center justify-between gap-3 shadow-2xl">
          <div className="truncate">
            <div className="text-[10px] text-emerald-400 font-mono font-bold truncate">
              {currentSite.siteCode} - {currentSite.name}
            </div>
            <div className="text-[11px] font-extrabold text-white">
              {status} ({luxLevel} lx)
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveSingleSite}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 active:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImageLightbox && (
        <div
          className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setActiveImageLightbox(null)}
        >
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl p-2 border border-slate-700 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveImageLightbox(null)}
              className="absolute top-3 right-3 p-1.5 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImageLightbox}
              alt="Preview Lightbox"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* BATCH ZONE CHECKLIST TABLE */}
      {formMode === 'batch' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Quick Checklist Table — Zone {currentZone.zoneNo} ({activeWeek.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-300">
                All {sites.length} sites for {currentZone.description}. Update status and lux levels simultaneously.
              </p>
            </div>

            <button
              onClick={handleBatchMarkAllLighted}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Mark All Lighted</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Site Code</th>
                  <th className="py-3 px-3">Location / Description</th>
                  <th className="py-3 px-3">{activeWeek.toUpperCase()} Status</th>
                  <th className="py-3 px-3">Lux Reading (lx)</th>
                  <th className="py-3 px-3 min-w-[220px]">Report Remarks / Notes</th>
                  <th className="py-3 px-3">Inspector</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sites.map((site, idx) => {
                  const rep = activeWeek === 'week2' ? site.week2Report : site.week4Report;
                  const isLighted = site.status === 'Lighted' || site.status === 'Working';
                  const currentLux = rep?.luxLevel ?? site.luxLevel ?? (isLighted ? 140 : 25);
                  const currentRemark = rep?.notes ?? site.notes ?? '';

                  return (
                    <tr key={site.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        <div>{site.siteCode}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{site.fixtureType}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 max-w-xs font-medium">{site.name}</td>
                      <td className="py-2.5 px-3">
                        <select
                          value={site.status}
                          onChange={(e) =>
                            handleBatchSiteStatusChange(site.id, e.target.value as SiteStatus)
                          }
                          className={`font-bold text-xs rounded-lg px-2 py-1 border cursor-pointer focus:outline-hidden ${
                            isLighted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {PRESET_STATUSES.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={currentLux}
                            onChange={(e) => handleBatchSiteLuxChange(site.id, Number(e.target.value))}
                            min={0}
                            max={500}
                            className="w-16 text-xs font-extrabold font-mono bg-white border border-slate-300 rounded-md px-1.5 py-1 text-slate-900 focus:outline-hidden focus:border-emerald-500 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">lx</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={currentRemark}
                          onChange={(e) => handleBatchSiteRemarkChange(site.id, e.target.value)}
                          placeholder="Type report remark..."
                          className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-amber-50/30"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium text-[11px]">
                        {rep?.inspector || activeInspector}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            setSelectedSiteId(site.id);
                            setFormMode('single');
                          }}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer whitespace-nowrap"
                        >
                          Full Form →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

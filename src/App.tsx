import React, { useState, useEffect } from 'react';
import { Header, ViewMode } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { ZoneTable } from './components/ZoneTable';
import { ZoneGrid } from './components/ZoneGrid';
import { BillboardMapView } from './components/BillboardMapView';
import { ZoneDetailModal } from './components/ZoneDetailModal';
import { InspectorRoster } from './components/InspectorRoster';
import { AnalyticsView } from './components/AnalyticsView';
import { PrintableReport } from './components/PrintableReport';
import { ChecklistFormView } from './components/ChecklistFormView';
import { AddZoneModal } from './components/AddZoneModal';
import { InspectorGuideModal } from './components/InspectorGuideModal';
import { PasscodeModal } from './components/PasscodeModal';
import { LoginScreen } from './components/LoginScreen';
import { StaffProfileModal } from './components/StaffProfileModal';
import { INITIAL_ZONES } from './data/initialData';
import { ZoneData } from './types';
import {
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  HelpCircle,
  Calendar,
  MapPin,
  Database,
  CheckCircle2,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { getMonthInfo } from './utils/dateHelpers';
import {
  auth,
  subscribeToZones,
  saveZoneToFirestore,
  resetDataInFirestore,
  saveZonesToFirestore,
  logout,
  syncStaffProfileOnLogin,
  subscribeToStaffProfile,
  StaffPublicProfile,
  PeriodCloudMetadata,
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const ALL_VIEWS: ViewMode[] = ['dashboard', 'table', 'map', 'roster', 'analytics', 'checklist', 'report'];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [staffProfile, setStaffProfile] = useState<StaffPublicProfile | null>(null);
  const [cloudMeta, setCloudMeta] = useState<PeriodCloudMetadata | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isLoginPortalOpen, setIsLoginPortalOpen] = useState(true);

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // August

  // Listen to Auth State & Sync Staff Profile
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);

      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (currentUser) {
        setIsLoginPortalOpen(false);
        syncStaffProfileOnLogin(currentUser).catch(console.error);
        unsubProfile = subscribeToStaffProfile(currentUser.uid, (profile) => {
          setStaffProfile(profile);
        });
      } else {
        setStaffProfile(null);
      }
    });
    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const [unlockedViews, setUnlockedViews] = useState<ViewMode[]>(() => {
    try {
      const saved = localStorage.getItem('unlocked_views_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.from(new Set([...parsed, 'map']));
      }
    } catch (e) {
      console.error(e);
    }
    return ['dashboard', 'map'];
  });

  const [passcodeModalState, setPasscodeModalState] = useState<{
    isOpen: boolean;
    targetView: ViewMode | null;
  }>({
    isOpen: false,
    targetView: null,
  });

  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [dashboardLayout, setDashboardLayout] = useState<'table' | 'grid' | 'map'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInspectorFilter, setSelectedInspectorFilter] = useState('ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [checklistTargetZone, setChecklistTargetZone] = useState<number>(1);
  const [checklistTargetWeek, setChecklistTargetWeek] = useState<'week2' | 'week4'>('week2');
  const [reportInitialMode, setReportInitialMode] = useState<
    'detailed' | 'summary' | 'status_summary' | 'weekly_photos'
  >('weekly_photos');
  const [reportInitialZoneNo, setReportInitialZoneNo] = useState<number>(0);
  const [reportInitialWeek, setReportInitialWeek] = useState<
    'all' | 'week1' | 'week2' | 'week3' | 'week4'
  >('week2');
  const [reportInitialStatusFilter, setReportInitialStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [qrNotification, setQrNotification] = useState<string | null>(null);
  const [wallpaperClarity, setWallpaperClarity] = useState<'clear' | 'balanced' | 'dark'>('balanced');

  const monthInfo = getMonthInfo(selectedYear, selectedMonth);

  const handleOpenWeeklyPhotoReport = (
    zoneNo?: number,
    week?: 'all' | 'week1' | 'week2' | 'week3' | 'week4'
  ) => {
    setReportInitialMode('weekly_photos');
    if (zoneNo !== undefined) {
      setReportInitialZoneNo(zoneNo);
    } else {
      setReportInitialZoneNo(0);
    }
    if (week) setReportInitialWeek(week);

    if (unlockedViews.includes('report')) {
      setCurrentView('report');
    } else {
      handleOpenPasscodeModal('report');
    }
  };

  // Switch data set when Year or Month changes and sync with Firebase Firestore
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    setIsDataLoaded(false);

    const unsubscribe = subscribeToZones(
      selectedYear,
      selectedMonth,
      (fetchedZones, meta) => {
        if (!isMounted) return;
        if (fetchedZones && fetchedZones.length > 0) {
          setZones(fetchedZones);
          if (meta) setCloudMeta(meta);
          setIsDataLoaded(true);
        } else {
          // Initialize new period with default zones in Firestore
          setZones(INITIAL_ZONES);
          setIsDataLoaded(true);
          saveZonesToFirestore(
            selectedYear,
            selectedMonth,
            INITIAL_ZONES,
            `Initialized ${monthInfo.monthLabelEn} ${selectedYear} schedule`
          ).catch(console.error);
        }
      },
      (error) => {
        console.error('Firestore sync error:', error);
        setQrNotification('Ralat penyelarasan pangkalan data awan: ' + error.message);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedYear, selectedMonth, user]);

  // Handle URL Deep Link from QR Code Scans
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const zoneNoParam = params.get('zone');
    const siteIdParam = params.get('siteId');
    const siteCodeParam = params.get('siteCode');

    if (zoneNoParam || siteIdParam || siteCodeParam) {
      let targetZone: ZoneData | undefined;

      if (zoneNoParam) {
        targetZone = zones.find((z) => z.zoneNo === parseInt(zoneNoParam, 10));
      }

      if (!targetZone && (siteIdParam || siteCodeParam)) {
        targetZone = zones.find((z) =>
          z.sites?.some(
            (s) =>
              (siteIdParam && s.id === siteIdParam) ||
              (siteCodeParam && s.siteCode.toLowerCase() === siteCodeParam.toLowerCase())
          )
        );
      }

      if (targetZone) {
        setSelectedZone(targetZone);
        const label = siteCodeParam || siteIdParam || `Zone ${targetZone.zoneNo}`;
        setQrNotification(
          `📍 QR Label Scanned Successfully! Opening field inspection status for ${label}`
        );
      }
    }
  }, []);

  // Filter logic for zones and individual site numbers/locations
  const filteredZones = zones.filter((zone) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesInspector =
      selectedInspectorFilter === 'ALL' ||
      zone.week2Inspector === selectedInspectorFilter ||
      zone.week4Inspector === selectedInspectorFilter;

    const matchesRegion =
      selectedRegionFilter === 'ALL' || zone.region === selectedRegionFilter;

    const matchesStatus =
      selectedStatusFilter === 'ALL' || zone.status === selectedStatusFilter;

    if (!matchesInspector || !matchesRegion || !matchesStatus) return false;

    if (!query) return true;

    const isZoneMatch =
      `zone ${zone.zoneNo}`.includes(query) ||
      `zon ${zone.zoneNo}`.includes(query) ||
      `z${zone.zoneNo}` === query ||
      `zon${zone.zoneNo}` === query ||
      `zone${zone.zoneNo}` === query ||
      (query.startsWith('zon ') && String(zone.zoneNo) === query.replace('zon ', '').trim()) ||
      (query.startsWith('zone ') && String(zone.zoneNo) === query.replace('zone ', '').trim());

    const isDescMatch = zone.description.toLowerCase().includes(query);

    const isInspectorMatch =
      zone.week2Inspector.toLowerCase().includes(query) ||
      zone.week4Inspector.toLowerCase().includes(query);

    const isRegionMatch = zone.region.toLowerCase().includes(query);

    const isSiteMatch =
      zone.sites &&
      zone.sites.some((s) => {
        const siteCode = (s.siteCode || '').toLowerCase();
        const siteName = (s.name || '').toLowerCase();
        const siteId = (s.id || '').toLowerCase();
        const siteNotes = (s.notes || '').toLowerCase();
        const fixtureType = (s.fixtureType || '').toLowerCase();

        return (
          siteCode.includes(query) ||
          siteName.includes(query) ||
          siteId.includes(query) ||
          siteNotes.includes(query) ||
          fixtureType.includes(query)
        );
      });

    return isZoneMatch || isDescMatch || isInspectorMatch || isRegionMatch || isSiteMatch;
  });

  const totalSites = zones.reduce((sum, z) => sum + z.siteCount, 0);
  const totalDefects = zones.reduce((sum, z) => sum + z.defectCount, 0);

  // Save Zone Changes to Firebase Firestore
  const handleSaveZone = (updatedZone: ZoneData) => {
    const nextZones = zones.map((z) => (z.id === updatedZone.id ? updatedZone : z));
    setZones(nextZones);
    if (!user) {
      setQrNotification(`✓ Zone ${updatedZone.zoneNo} telah dikemaskini.`);
      setTimeout(() => setQrNotification(null), 3000);
      return;
    }
    saveZoneToFirestore(selectedYear, selectedMonth, updatedZone, nextZones)
      .then(() => {
        setQrNotification(
          `☁️ Zone ${updatedZone.zoneNo} berjaya disimpan ke dalam Firebase Cloud!`
        );
        setTimeout(() => setQrNotification(null), 3500);
      })
      .catch(console.error);
  };

  // Add New Zone to Firebase Firestore
  const handleAddZone = (newZone: ZoneData) => {
    const nextZones = [...zones, newZone].sort((a, b) => a.zoneNo - b.zoneNo);
    setZones(nextZones);
    if (!user) {
      setQrNotification(`✓ Zon Baharu (Zone ${newZone.zoneNo}) telah ditambah.`);
      setTimeout(() => setQrNotification(null), 3000);
      return;
    }
    saveZonesToFirestore(
      selectedYear,
      selectedMonth,
      nextZones,
      `Added new Zone ${newZone.zoneNo}: ${newZone.description}`
    )
      .then(() => {
        setQrNotification(
          `☁️ Zon Baharu (Zone ${newZone.zoneNo}) telah disimpan ke dalam Firebase Cloud!`
        );
        setTimeout(() => setQrNotification(null), 3500);
      })
      .catch(console.error);
  };

  // Reset Data in Firebase Firestore
  const handleResetData = () => {
    setZones(INITIAL_ZONES);
    setSearchQuery('');
    setSelectedInspectorFilter('ALL');
    setSelectedRegionFilter('ALL');
    setSelectedStatusFilter('ALL');
    if (!user) {
      setQrNotification(
        `✓ Data jadual ${monthInfo.monthLabelEn} ${selectedYear} telah ditetapkan semula.`
      );
      setTimeout(() => setQrNotification(null), 3000);
      return;
    }
    resetDataInFirestore(selectedYear, selectedMonth, INITIAL_ZONES)
      .then(() => {
        setQrNotification(
          `☁️ Data jadual ${monthInfo.monthLabelEn} ${selectedYear} telah ditetapkan semula dalam Firebase Cloud.`
        );
        setTimeout(() => setQrNotification(null), 3500);
      })
      .catch(console.error);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'Description',
      'Week 2 Inspector',
      'Week 4 Inspector',
      'Total Sites',
      'Region',
      'Status',
      'Defect Count',
      'Remarks',
    ];
    const rows = zones.map((z) => [
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

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Lighting_Inspection_${monthInfo.monthLabelEn}_${selectedYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Print Mode
  const handlePrint = () => {
    setCurrentView('report');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Passcode unlock & reset handlers
  const handleOpenPasscodeModal = (targetView: ViewMode) => {
    setPasscodeModalState({
      isOpen: true,
      targetView,
    });
  };

  const handleUnlockView = (targetView: ViewMode, unlockAll = true) => {
    const updated = unlockAll ? ALL_VIEWS : Array.from(new Set([...unlockedViews, targetView]));
    setUnlockedViews(updated);
    try {
      localStorage.setItem('unlocked_views_state_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setCurrentView(targetView);
  };

  const handleResetLocks = () => {
    setUnlockedViews([]);
    try {
      localStorage.setItem('unlocked_views_state_v1', JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    setPasscodeModalState({
      isOpen: true,
      targetView: 'dashboard',
    });
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  if (authChecking) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center gap-3 text-emerald-400 font-bold text-lg overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src="/src/assets/images/gantry_billboard_bg_1790743984781.jpg"
            alt="Big Tree Outdoor Night Gantry Billboard Wallpaper"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-3 bg-slate-950/70 border border-emerald-500/40 px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-md">
          <Database className="w-8 h-8 text-amber-400 animate-pulse" />
          <span>Menyambung ke Pangkalan Data Firebase Big Tree Outdoor...</span>
        </div>
      </div>
    );
  }

  if (isLoginPortalOpen && !user) {
    return <LoginScreen />;
  }

  const activeStaffName =
    staffProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Staf (Akses Terus)';
  const activeStaffRole = staffProfile?.staffRole || (user ? 'Staff Inspector' : 'Developer / Staf');

  const overlayClass =
    wallpaperClarity === 'clear'
      ? 'bg-gradient-to-b from-slate-950/35 via-[#02180f]/40 to-slate-950/65'
      : wallpaperClarity === 'balanced'
      ? 'bg-gradient-to-b from-slate-950/60 via-[#02180f]/65 to-slate-950/80 backdrop-blur-[1px]'
      : 'bg-gradient-to-b from-slate-950/80 via-[#02180f]/85 to-slate-950/90 backdrop-blur-[2px]';

  return (
    <div className="relative min-h-screen text-slate-100 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Full-Screen Gantry Billboard Background Wallpaper */}
      <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
        <img
          src="/src/assets/images/gantry_billboard_bg_1790743984781.jpg"
          alt="Big Tree Outdoor Night Gantry Billboard Wallpaper"
          className="w-full h-full object-cover object-center transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 transition-all duration-500 ${overlayClass}`} />
      </div>

      {/* App Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          if (unlockedViews.includes(view)) {
            setCurrentView(view);
          } else {
            handleOpenPasscodeModal(view);
          }
        }}
        unlockedViews={unlockedViews}
        onOpenPasscodeModal={handleOpenPasscodeModal}
        onResetLocks={handleResetLocks}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        onPrint={handlePrint}
        totalSites={totalSites}
        totalDefects={totalDefects}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onOpenWeeklyPhotoReport={() => handleOpenWeeklyPhotoReport()}
        user={user}
        staffProfile={staffProfile}
        cloudMeta={cloudMeta}
        onOpenStaffProfile={() => setIsStaffModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Staff Session & Firebase Cloud Sync Bar */}
        <div className="mb-4 bg-[#032014]/85 backdrop-blur-md border border-emerald-500/40 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg print:hidden">
          <div className="flex items-center gap-2.5 text-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/90 border border-emerald-500/50 text-emerald-200 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Staf Aktif: {activeStaffName}</span>
            </span>
            <span className="text-amber-300 font-extrabold text-[11px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
              {activeStaffRole}
            </span>
            {cloudMeta && (
              <span className="text-emerald-200/80 text-[11px] hidden xl:inline">
                • Kemaskini Terakhir Firebase: <strong className="text-white">{cloudMeta.updatedByName}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Wallpaper Clarity Toggle */}
            <div className="flex items-center gap-1 bg-slate-950/70 border border-emerald-500/40 rounded-lg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setWallpaperClarity('clear')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  wallpaperClarity === 'clear'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Paparkan gambar wallpaper billboard dengan jelas"
              >
                Wallpaper Jelas
              </button>
              <button
                type="button"
                onClick={() => setWallpaperClarity('balanced')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  wallpaperClarity === 'balanced'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Mod seimbang antara wallpaper & jadual"
              >
                Seimbang
              </button>
              <button
                type="button"
                onClick={() => setWallpaperClarity('dark')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  wallpaperClarity === 'dark'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Gelapkan sedikit latar belakang untuk fokus bacaan"
              >
                Fokus
              </button>
            </div>

            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50 text-xs font-bold transition cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tetapan Staf & Cloud</span>
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 text-xs font-extrabold transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginPortalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-white" />
                <span>Sign In Cloud</span>
              </button>
            )}
          </div>
        </div>

        {/* Cloud / QR Notification Banner */}
        {qrNotification && (
          <div className="mb-4 p-3.5 bg-emerald-900/95 text-white rounded-2xl shadow-xl border border-emerald-400/50 flex items-center justify-between backdrop-blur-md animate-fadeIn print:hidden">
            <div className="flex items-center gap-3 font-bold text-xs sm:text-sm">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 rounded-lg text-xs font-black">
                FIREBASE CLOUD
              </span>
              <span>{qrNotification}</span>
            </div>
            <button
              onClick={() => setQrNotification(null)}
              className="text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-1 rounded-xl transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* EXECUTIVE DASHBOARD & TABLE VIEWS */}
        {(currentView === 'dashboard' || currentView === 'table') && (
          <div>
            {/* KPI Metric Cards */}
            <MetricsCards
              zones={zones}
              onOpenWeeklyPhotoReport={() => handleOpenWeeklyPhotoReport()}
              onViewReport={(mode, statusFilter) => {
                if (mode) setReportInitialMode(mode);
                if (statusFilter) setReportInitialStatusFilter(statusFilter);
                setCurrentView('report');
              }}
            />

            {/* Dashboard Sub-Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <span>Lighting Inspection Checklist ({zones.length} Zones)</span>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {monthInfo.monthLabelEn} {selectedYear}
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Check inspection status for Week 2 ({monthInfo.week2Range}) & Week 4 (
                  {monthInfo.week4Range}) for each zone • Auto-saved to Firebase Cloud.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* View Mode Toggle: Table vs Grid vs Map */}
                <div className="bg-slate-900/90 border border-emerald-500/30 p-1 rounded-xl flex items-center text-xs font-semibold">
                  <button
                    onClick={() => setDashboardLayout('table')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-extrabold ${
                      dashboardLayout === 'table'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                  <button
                    onClick={() => setDashboardLayout('grid')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-extrabold ${
                      dashboardLayout === 'grid'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid Cards</span>
                  </button>
                  <button
                    onClick={() => setDashboardLayout('map')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-extrabold ${
                      dashboardLayout === 'map'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-amber-300 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Billboard Map</span>
                  </button>
                </div>

                {/* Inspector Guide Button */}
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-extrabold transition cursor-pointer shadow-md"
                  title="View Inspector Update Guide"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Status Guide</span>
                </button>

                {/* Add New Zone Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-extrabold transition cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Zone</span>
                </button>
              </div>
            </div>

            {/* Quick Search Shortcuts */}
            <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-3.5 mb-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Site Search:
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('P0001')}
                  className={`px-3 py-1 rounded-lg border font-mono text-[11px] font-bold transition cursor-pointer ${
                    searchQuery.toLowerCase() === 'p0001'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400/50'
                  }`}
                >
                  📍 P0001 (Zone 1)
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('UP0002')}
                  className={`px-3 py-1 rounded-lg border font-mono text-[11px] font-bold transition cursor-pointer ${
                    searchQuery.toLowerCase() === 'up0002'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400/50'
                  }`}
                >
                  📍 UP0002 (Zone 1)
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('Zone 1')}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                    searchQuery.toLowerCase() === 'zone 1'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400/50'
                  }`}
                >
                  Zone 1 (KL)
                </button>

                {(searchQuery ||
                  selectedInspectorFilter !== 'ALL' ||
                  selectedRegionFilter !== 'ALL' ||
                  selectedStatusFilter !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedInspectorFilter('ALL');
                      setSelectedRegionFilter('ALL');
                      setSelectedStatusFilter('ALL');
                    }}
                    className="inline-flex items-center gap-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-[11px] font-extrabold px-2.5 py-1 cursor-pointer transition shadow-xs"
                    title="Reset all search and filter options"
                  >
                    Reset Search
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-300 font-medium">
                Displaying: <strong className="text-amber-300 font-bold">{filteredZones.length}</strong>{' '}
                of {zones.length} Zones ({monthInfo.monthLabelEn} {selectedYear})
              </div>
            </div>

            {/* Layout Display */}
            {dashboardLayout === 'table' ? (
              <ZoneTable
                zones={filteredZones}
                onSelectZone={setSelectedZone}
                onOpenWeeklyPhotoReport={(zoneNo) => handleOpenWeeklyPhotoReport(zoneNo)}
                selectedInspectorFilter={selectedInspectorFilter}
                onInspectorFilterChange={setSelectedInspectorFilter}
                selectedRegionFilter={selectedRegionFilter}
                onRegionFilterChange={setSelectedRegionFilter}
                selectedStatusFilter={selectedStatusFilter}
                onStatusFilterChange={setSelectedStatusFilter}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                searchQuery={searchQuery}
              />
            ) : dashboardLayout === 'grid' ? (
              <ZoneGrid
                zones={filteredZones}
                onSelectZone={setSelectedZone}
                onOpenWeeklyPhotoReport={(zoneNo) => handleOpenWeeklyPhotoReport(zoneNo)}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                searchQuery={searchQuery}
              />
            ) : (
              <BillboardMapView
                zones={filteredZones}
                onSelectZone={setSelectedZone}
                onOpenWeeklyPhotoReport={(zoneNo) => handleOpenWeeklyPhotoReport(zoneNo)}
                searchQuery={searchQuery}
              />
            )}
          </div>
        )}

        {/* BILLBOARD LOCATION MAP VIEW */}
        {currentView === 'map' && (
          <BillboardMapView
            zones={filteredZones}
            onSelectZone={setSelectedZone}
            onOpenWeeklyPhotoReport={(zoneNo) => handleOpenWeeklyPhotoReport(zoneNo)}
            searchQuery={searchQuery}
          />
        )}

        {/* INSPECTOR ROSTER VIEW */}
        {currentView === 'roster' && (
          <InspectorRoster
            zones={zones}
            onSelectZone={setSelectedZone}
            onFilterByInspector={(inspectorName) => {
              setSelectedInspectorFilter(inspectorName);
              setCurrentView('dashboard');
            }}
          />
        )}

        {/* ANALYTICS VIEW */}
        {currentView === 'analytics' && <AnalyticsView zones={zones} />}

        {/* CHECKLIST FORM VIEW (WEEK 2 & WEEK 4) */}
        {currentView === 'checklist' && (
          <ChecklistFormView
            zones={zones}
            onSaveZone={handleSaveZone}
            initialZoneNo={checklistTargetZone}
            initialWeek={checklistTargetWeek}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            onNavigateToReport={(week) => {
              handleOpenWeeklyPhotoReport(checklistTargetZone, week as 'week2' | 'week4' | 'all');
            }}
          />
        )}

        {/* PRINTABLE FORMAL REPORT VIEW */}
        {currentView === 'report' && (
          <PrintableReport
            zones={zones}
            onPrint={handlePrint}
            onExportCSV={handleExportCSV}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            initialReportMode={reportInitialMode}
            initialStatusFilter={reportInitialStatusFilter}
            initialZoneNo={reportInitialZoneNo}
            initialWeek={reportInitialWeek}
            onSaveZone={handleSaveZone}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#02180f]/85 backdrop-blur-md border-t border-emerald-800/60 py-4 text-center text-xs text-emerald-200/80 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-emerald-100">
            Big Tree Outdoor Sdn Bhd • Infrastructure & Asset Management System • Lighting Inspection{' '}
            {monthInfo.monthLabelEn} {selectedYear}
          </span>
          <span className="font-mono text-[11px] text-amber-300">
            Active Cycle: {monthInfo.monthLabelEn} {selectedYear} • Firebase Cloud Synced
          </span>
        </div>
      </footer>

      {/* Audit Detail Drawer / Modal */}
      <ZoneDetailModal
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onSaveZone={handleSaveZone}
        onOpenSiteStatus={(zone, site) => {
          setSelectedZone(zone);
          setQrNotification(`📍 Field Audit View: ${site.siteCode} - ${site.name}`);
        }}
        onOpenChecklist={(zoneNo, week) => {
          setSelectedZone(null);
          if (zoneNo) setChecklistTargetZone(zoneNo);
          if (week) setChecklistTargetWeek(week);
          setCurrentView('checklist');
        }}
        onOpenWeeklyPhotoReport={(zoneNo) => {
          setSelectedZone(null);
          handleOpenWeeklyPhotoReport(zoneNo);
        }}
      />

      {/* Add New Zone Modal */}
      <AddZoneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddZone={handleAddZone}
        existingZonesCount={zones.length}
      />

      {/* Inspector Guide Modal */}
      <InspectorGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Security Passcode Lock Modal */}
      <PasscodeModal
        isOpen={passcodeModalState.isOpen}
        targetView={passcodeModalState.targetView}
        onClose={() => setPasscodeModalState({ isOpen: false, targetView: null })}
        onUnlock={handleUnlockView}
        onResetLocks={handleResetLocks}
      />

      {/* Staff Profile & Firebase Cloud Sync Modal */}
      <StaffProfileModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        user={user}
        staffProfile={staffProfile}
        cloudMeta={cloudMeta}
        onSignOut={handleSignOut}
        onFilterMyZones={(inspectorName) => {
          setSelectedInspectorFilter(inspectorName);
          setCurrentView('dashboard');
        }}
        onForceCloudSync={async () => {
          await saveZonesToFirestore(
            selectedYear,
            selectedMonth,
            zones,
            `Manual cloud sync by ${activeStaffName}`
          );
        }}
      />
    </div>
  );
}

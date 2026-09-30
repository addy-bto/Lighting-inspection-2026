import React from 'react';
import {
  LayoutDashboard,
  Table,
  Users,
  BarChart3,
  FileText,
  Printer,
  Download,
  RotateCcw,
  Search,
  ClipboardCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  KeyRound,
  Camera,
  MapPin,
  LogOut,
  UserCheck,
  Database,
} from 'lucide-react';
import { MONTHS, YEARS, getMonthInfo } from '../utils/dateHelpers';
import { User } from 'firebase/auth';
import { StaffPublicProfile, PeriodCloudMetadata } from '../lib/firebase';

export type ViewMode = 'dashboard' | 'table' | 'map' | 'roster' | 'analytics' | 'report' | 'checklist';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  unlockedViews: ViewMode[];
  onOpenPasscodeModal: (view: ViewMode) => void;
  onResetLocks: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onPrint: () => void;
  totalSites: number;
  totalDefects: number;
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
  onOpenWeeklyPhotoReport?: () => void;
  user?: User | null;
  staffProfile?: StaffPublicProfile | null;
  cloudMeta?: PeriodCloudMetadata | null;
  onOpenStaffProfile?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  unlockedViews,
  onOpenPasscodeModal,
  onResetLocks,
  searchQuery,
  onSearchChange,
  onExportCSV,
  onResetData,
  onPrint,
  totalSites,
  totalDefects,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  onOpenWeeklyPhotoReport,
  user,
  staffProfile,
  cloudMeta,
  onOpenStaffProfile,
  onSignOut,
}) => {
  const monthInfo = getMonthInfo(selectedYear, selectedMonth);

  const handleTabClick = (view: ViewMode) => {
    if (unlockedViews.includes(view)) {
      onViewChange(view);
    } else {
      onOpenPasscodeModal(view);
    }
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      onMonthChange(12);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      onMonthChange(1);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const staffName =
    staffProfile?.displayName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Staff';
  const staffRole = staffProfile?.staffRole || 'Staff Inspector';

  return (
    <header className="sticky top-0 z-30 bg-[#02180f]/95 backdrop-blur-md text-emerald-50 border-b border-emerald-600/30 shadow-2xl shadow-emerald-950/60 print:hidden">
      {/* Top Corporate Brand & Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Corporate Identity */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
            target="_blank"
            rel="noopener noreferrer"
            className="relative shrink-0 block group"
            title="Visit Big Tree Outdoor Sdn Bhd Official Website"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#032014] border-2 border-emerald-400/80 group-hover:border-amber-400 p-0.5 shadow-xl overflow-hidden flex items-center justify-center transition">
              <img
                src="/src/assets/images/bigtree_outdoor_logo_1785723315856.jpg"
                alt="Big Tree Outdoor Sdn Bhd Logo"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-[#02180f] rounded-full shadow-xs"
              title="Big Tree Outdoor Corporate Verified"
            />
          </a>

          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <a
                href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-extrabold font-mono tracking-wider text-amber-300 hover:text-amber-200 uppercase bg-amber-950/80 hover:bg-amber-900/90 px-2.5 py-0.5 rounded border border-amber-600/60 shadow-xs inline-flex items-center gap-1 transition"
              >
                BIG TREE OUTDOOR SDN BHD
              </a>
              <span className="text-xs text-emerald-300/80 font-mono">Doc ID: {monthInfo.docId}</span>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                title={
                  cloudMeta
                    ? `Disimpan dalam Firebase oleh ${cloudMeta.updatedByName}: ${cloudMeta.lastAction}`
                    : 'Firebase Cloud Connected'
                }
              >
                <Database className="w-3 h-3 text-amber-400" />
                <span>Firebase Cloud Sync</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              LIGHTING INSPECTION REPORT-BIG TREE OUTDOOR
            </h1>
          </div>
        </div>

        {/* Year, Month, Command Actions & Staff Sign-Out */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Year & Month Control */}
          <div className="flex items-center gap-1.5 bg-[#042416] border border-emerald-500/40 rounded-xl p-1 shadow-inner">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-lg transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-400 ml-1" />
              {/* Month Dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(Number(e.target.value))}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer py-1 px-1 rounded hover:bg-emerald-800/40"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value} className="bg-[#042416] text-white">
                    {m.labelEn}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="bg-transparent text-amber-400 font-extrabold text-xs focus:outline-none cursor-pointer py-1 px-1 rounded hover:bg-emerald-800/40"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y} className="bg-[#042416] text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-lg transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/80" />
            <input
              type="text"
              placeholder="Search site, zone, highway..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#042416] text-white text-xs rounded-xl pl-9 pr-7 py-2 border border-emerald-500/40 focus:outline-none focus:border-emerald-300 placeholder-emerald-200/50 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white text-xs font-bold p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 bg-[#042416] hover:bg-[#073621] text-emerald-100 border border-emerald-500/40 rounded-xl px-2.5 py-2 text-xs font-semibold transition cursor-pointer shadow-sm"
            title="Export full schedule dataset to CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden xl:inline">CSV</span>
          </button>

          {/* Reset Locks */}
          <button
            onClick={onResetLocks}
            className="inline-flex items-center gap-1.5 bg-[#042416] hover:bg-[#073621] text-amber-300 border border-amber-500/40 rounded-xl px-2.5 py-2 text-xs font-bold transition cursor-pointer shadow-xs"
            title="Relock all sections"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Locks</span>
          </button>

          {/* Weekly Photo & Status Report Button */}
          {onOpenWeeklyPhotoReport && (
            <button
              onClick={onOpenWeeklyPhotoReport}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black rounded-xl px-3 py-2 text-xs transition cursor-pointer shadow-md border border-amber-300"
              title="Generate Weekly Lighting Inspection Report with Photos"
            >
              <Camera className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Weekly Photo Report</span>
              <span className="sm:hidden">Photos</span>
            </button>
          )}

          {/* Print Report */}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl px-3.5 py-2 text-xs transition cursor-pointer shadow-md shadow-emerald-950/50"
            title="Print Official Audit Report / Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Reset to Default */}
          <button
            onClick={onResetData}
            className="p-2 text-emerald-200/80 hover:text-white hover:bg-emerald-900/50 rounded-xl transition cursor-pointer"
            title="Reset Data to Default CSV"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Signed-In Staff Profile & Sign Out Controls */}
          {user && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-emerald-800/70">
              <button
                type="button"
                onClick={onOpenStaffProfile}
                className="inline-flex items-center gap-2 bg-[#042416] hover:bg-[#073621] border border-emerald-500/50 rounded-xl px-2.5 py-1.5 text-left transition cursor-pointer"
                title="Klik untuk lihat & kemaskini Profil Staf Firebase"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="leading-tight hidden sm:block">
                  <div className="text-[11px] font-black text-white max-w-[110px] truncate">
                    {staffName}
                  </div>
                  <div className="text-[9px] font-bold text-emerald-300 max-w-[110px] truncate">
                    {staffRole}
                  </div>
                </div>
              </button>

              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1.5 bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-500/50 rounded-xl px-3 py-2 text-xs font-extrabold transition cursor-pointer shadow-sm"
                  title="Sign Out daripada Sistem"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#01110a]/95 border-t border-emerald-900/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-2" aria-label="Tabs">
            {/* 1. Executive Dashboard */}
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Executive Dashboard</span>
              {!unlockedViews.includes('dashboard') && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Locked - Passcode Required" />
              )}
            </button>

            {/* 2. Schedule Table */}
            <button
              onClick={() => handleTabClick('table')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap ${
                currentView === 'table'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Schedule Table (31 Zones)</span>
              {!unlockedViews.includes('table') && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Locked - Passcode Required" />
              )}
            </button>

            {/* 2B. Billboard Location Map */}
            <button
              onClick={() => handleTabClick('map')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap ${
                currentView === 'map'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                  : 'text-amber-300 hover:text-white hover:bg-emerald-950/60 font-bold'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Billboard Map (31 Zones)</span>
              {!unlockedViews.includes('map') && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Locked - Passcode Required" />
              )}
            </button>

            {/* 3. Inspectors & Workload */}
            <button
              onClick={() => handleTabClick('roster')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap ${
                currentView === 'roster'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Inspectors & Workload</span>
              {!unlockedViews.includes('roster') && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Locked - Passcode Required" />
              )}
            </button>

            {/* 4. Analytics & Metrics */}
            <button
              onClick={() => handleTabClick('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap ${
                currentView === 'analytics'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics & Metrics</span>
              {!unlockedViews.includes('analytics') && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Locked - Passcode Required" />
              )}
            </button>

            {/* 5. Checklist Form (Week 2 & Week 4) */}
            <button
              onClick={() => handleTabClick('checklist')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap ${
                currentView === 'checklist'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-emerald-950/60 font-semibold'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Inspection Checklist (W2 & W4)</span>
              {!unlockedViews.includes('checklist') && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Locked - Passcode Required" />
              )}
            </button>

            {/* 6. Formal Report */}
            <button
              onClick={() => handleTabClick('report')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap ${
                currentView === 'report'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Report & Zone Status</span>
              {!unlockedViews.includes('report') && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Locked - Passcode Required" />
              )}
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-4 text-xs text-emerald-200/90 py-1.5">
            <span>Period: <strong className="text-amber-300 font-bold">{monthInfo.periodText}</strong></span>
            <span className="h-3 w-px bg-emerald-800"></span>
            <span>Total Sites: <strong className="text-emerald-300 font-bold tabular-nums">{totalSites}</strong></span>
            <span className="h-3 w-px bg-emerald-800"></span>
            <span>Defects: <strong className={`tabular-nums ${totalDefects > 0 ? "text-amber-300 font-bold" : "text-emerald-300 font-bold"}`}>{totalDefects}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};

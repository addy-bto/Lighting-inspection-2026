import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Plus,
  Save,
  Check,
  Calendar,
  FileText,
  ShieldAlert,
  Camera,
  QrCode,
  Layers,
  ClipboardCheck,
} from 'lucide-react';
import { ZoneData, SiteDetail, InspectionStatus } from '../types';
import { InspectorBadge } from './InspectorBadge';
import { getSiteCodeRange, getSiteCodesList } from '../utils/siteHelpers';
import { SiteQrModal } from './SiteQrModal';
import { BulkQrLabelsModal } from './BulkQrLabelsModal';

interface ZoneDetailModalProps {
  zone: ZoneData | null;
  onClose: () => void;
  onSaveZone: (updatedZone: ZoneData) => void;
  onOpenSiteStatus?: (zone: ZoneData, site: SiteDetail) => void;
  onOpenChecklist?: (zoneNo: number, week?: 'week2' | 'week4') => void;
  onOpenWeeklyPhotoReport?: (zoneNo: number) => void;
}

export const ZoneDetailModal: React.FC<ZoneDetailModalProps> = ({
  zone,
  onClose,
  onSaveZone,
  onOpenSiteStatus,
  onOpenChecklist,
  onOpenWeeklyPhotoReport,
}) => {
  if (!zone) return null;

  const [currentZone, setCurrentZone] = useState<ZoneData>(JSON.parse(JSON.stringify(zone)));
  const [activeTab, setActiveTab] = useState<'sites' | 'remarks'>('sites');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [siteFilterQuery, setSiteFilterQuery] = useState('');
  const [selectedQrSite, setSelectedQrSite] = useState<SiteDetail | null>(null);
  const [isBulkQrOpen, setIsBulkQrOpen] = useState(false);

  const PRESET_STATUSES = [
    'Lighted',
    'Partially Lit',
    'Greenish',
    'Yellowish',
    'Not Lighted',
    'Half Not Lit',
    'Lighting Arm Shifted',
    'Cable fault',
    'Vandalism',
    'Electrical fittings missing',
    'Timer switch malfunction',
    'Others',
  ];

  const handleStatusChange = (siteId: string, newStatus: string) => {
    const updatedSites = (currentZone.sites || []).map((s) => {
      if (s.id === siteId) {
        const isNormal = newStatus.trim().toLowerCase() === 'lighted' || newStatus.trim().toLowerCase() === 'working';
        return {
          ...s,
          status: newStatus,
          luxLevel: isNormal ? 135 : 30,
        };
      }
      return s;
    });

    const defectCount = updatedSites.filter(
      (s) => s.status.trim().toLowerCase() !== 'lighted' && s.status.trim().toLowerCase() !== 'working'
    ).length;
    let zoneStatus: InspectionStatus = currentZone.status;
    if (defectCount > 0) {
      zoneStatus = 'Needs Maintenance';
    }

    setCurrentZone({
      ...currentZone,
      sites: updatedSites,
      defectCount,
      status: zoneStatus,
    });
  };

  const handleNotesChange = (siteId: string, notes: string) => {
    const updatedSites = (currentZone.sites || []).map((s) => {
      if (s.id === siteId) {
        return { ...s, notes };
      }
      return s;
    });
    setCurrentZone({ ...currentZone, sites: updatedSites });
  };

  const handleSiteCodeChange = (siteId: string, siteCode: string) => {
    const updatedSites = (currentZone.sites || []).map((s) => {
      if (s.id === siteId) {
        return { ...s, siteCode };
      }
      return s;
    });
    setCurrentZone({ ...currentZone, sites: updatedSites });
  };

  const handleSiteNameChange = (siteId: string, name: string) => {
    const updatedSites = (currentZone.sites || []).map((s) => {
      if (s.id === siteId) {
        return { ...s, name };
      }
      return s;
    });
    setCurrentZone({ ...currentZone, sites: updatedSites });
  };

  const handleAddSite = () => {
    const nextNum = (currentZone.sites?.length || 0) + 1;
    const newSite: SiteDetail = {
      id: `z${currentZone.zoneNo}-s${nextNum}`,
      siteCode: `Z${currentZone.zoneNo.toString().padStart(2, '0')}-S${nextNum.toString().padStart(2, '0')}`,
      name: `${currentZone.description} - New Site #${nextNum}`,
      fixtureType: 'Unipole',
      status: 'Lighted',
      luxLevel: 140,
      lastInspectedDate: '2026-08-20',
      notes: 'New site registered for August 2026 audit.',
    };

    const updatedSites = [...(currentZone.sites || []), newSite];
    setCurrentZone({
      ...currentZone,
      sites: updatedSites,
      siteCount: updatedSites.length,
    });
  };

  const handleSave = () => {
    onSaveZone(currentZone);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
              {currentZone.zoneNo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {currentZone.region}
                </span>
                <span className="text-xs text-amber-300 font-mono font-bold bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded">
                  📍 {getSiteCodeRange(currentZone)}
                </span>
                <span className="text-xs text-slate-400">
                  {currentZone.siteCount} Active Locations
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {currentZone.description}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header Inspector Assignment Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Week 2 Lead:</span>
              <InspectorBadge name={currentZone.week2Inspector} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Week 4 Lead:</span>
              <InspectorBadge name={currentZone.week4Inspector} size="sm" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-semibold">Status Lighting:</label>
            <select
              value={currentZone.status}
              onChange={(e) =>
                setCurrentZone({ ...currentZone, status: e.target.value as InspectionStatus })
              }
              className="bg-white border border-slate-300 font-bold text-slate-800 text-xs rounded-md px-2.5 py-1 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Needs Maintenance">Needs Maintenance</option>
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="border-b border-slate-200 bg-white px-6 py-2 flex items-center justify-between text-xs font-semibold">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('sites')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'sites'
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Site List ({currentZone.sites?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('remarks')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'remarks'
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Inspection Notes & Remarks
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenWeeklyPhotoReport && (
              <button
                type="button"
                onClick={() => {
                  onOpenWeeklyPhotoReport(currentZone.zoneNo);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-3 py-1 rounded-md transition cursor-pointer shadow-md border border-amber-300"
                title={`Generate Weekly Photo Inspection Report with evidence for Zone ${currentZone.zoneNo}`}
              >
                <Camera className="w-3.5 h-3.5 text-slate-950" />
                <span>Weekly Photo Report</span>
              </button>
            )}

            {onOpenChecklist && (
              <button
                onClick={() => {
                  onOpenChecklist(currentZone.zoneNo, 'week2');
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3 py-1 rounded-md transition cursor-pointer shadow-xs"
                title="Open Checklist Form for this Zone"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Checklist Form W2/W4</span>
              </button>
            )}

            <button
              onClick={() => setIsBulkQrOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md border border-slate-300 transition cursor-pointer"
              title="Print QR code sticker labels for all sites in this Zone"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>Print Zone QR Labels</span>
            </button>
            <button
              onClick={handleAddSite}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Site</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'sites' ? (
            <div className="space-y-3">
              {/* Site Search Filter */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">Find Site / UP Code:</span>
                <input
                  type="text"
                  placeholder="e.g.: UP0001, UP0002, LED, Site #1..."
                  value={siteFilterQuery}
                  onChange={(e) => setSiteFilterQuery(e.target.value)}
                  className="flex-1 text-xs bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-mono focus:outline-none focus:border-slate-800"
                />
                {siteFilterQuery && (
                  <button
                    onClick={() => setSiteFilterQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-700 px-1 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Quick UP Code Selector Pills */}
              <div className="flex items-center gap-1.5 flex-wrap bg-slate-100/90 p-2 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-600 text-[11px] shrink-0">Fast Track Sites:</span>
                <button
                  onClick={() => setSiteFilterQuery('')}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold transition cursor-pointer ${
                    !siteFilterQuery ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  All ({currentZone.sites?.length || 0})
                </button>
                {getSiteCodesList(currentZone).map((code, idx) => (
                  <button
                    key={`${code}-${idx}`}
                    onClick={() => setSiteFilterQuery(code)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold transition cursor-pointer ${
                      siteFilterQuery.toUpperCase() === code.toUpperCase()
                        ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-xs'
                        : 'bg-white text-slate-800 hover:bg-amber-100 border border-slate-300'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              {currentZone.sites
                ?.filter((site) => {
                  const q = siteFilterQuery.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    site.siteCode.toLowerCase().includes(q) ||
                    site.name.toLowerCase().includes(q) ||
                    site.fixtureType.toLowerCase().includes(q) ||
                    (site.notes && site.notes.toLowerCase().includes(q))
                  );
                })
                .map((site) => {
                  const isLighted = site.status.trim().toLowerCase() === 'lighted' || site.status.trim().toLowerCase() === 'working';
                  const isNotLighted = site.status.trim().toLowerCase() === 'not lighted';

                  return (
                    <div
                      key={site.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isLighted
                          ? 'bg-white border-slate-200 hover:border-slate-300'
                          : isNotLighted
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              isLighted
                                ? 'bg-emerald-100 text-emerald-700'
                                : isNotLighted
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <Lightbulb className="w-4 h-4" />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-lg px-2 py-1 shadow-2xs">
                                <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider shrink-0">Site Number:</span>
                                <input
                                  type="text"
                                  value={site.siteCode}
                                  onChange={(e) => handleSiteCodeChange(site.id, e.target.value)}
                                  className="font-mono text-xs font-bold text-slate-950 bg-white border border-slate-300 rounded px-2 py-0.5 focus:border-emerald-600 focus:outline-hidden w-28 sm:w-36"
                                  placeholder="e.g.: KUR002"
                                  title="Click to edit Site Number"
                                />
                                <button
                                  type="button"
                                  onClick={() => setSelectedQrSite(site)}
                                  className="p-1 bg-slate-900 hover:bg-slate-800 text-white rounded transition flex items-center gap-1 text-[10px] font-bold cursor-pointer shrink-0 ml-1"
                                  title="Generate & Print QR Label for this site"
                                >
                                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="hidden sm:inline">QR Label</span>
                                </button>
                              </div>
                              <span className="text-xs text-slate-600 font-medium bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">{site.fixtureType}</span>
                              {site.luxLevel && (
                                <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                                  💡 {site.luxLevel} Lux
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider shrink-0">Site Location:</span>
                              <input
                                type="text"
                                value={site.name}
                                onChange={(e) => handleSiteNameChange(site.id, e.target.value)}
                                className="w-full font-semibold text-slate-900 text-xs sm:text-sm bg-white border border-slate-200 focus:border-emerald-500 rounded px-2 py-0.5 focus:outline-hidden"
                                placeholder="Site Location (e.g.: Federal Highway Main Ramp)..."
                                title="Click to edit Site Location"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Status selector & Custom Editable Box */}
                        <div className="flex flex-col gap-1.5 shrink-0 self-start lg:self-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-[210px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Status Option:</span>
                            <select
                              value={PRESET_STATUSES.includes(site.status) ? site.status : 'Custom'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val !== 'Custom') {
                                  handleStatusChange(site.id, val);
                                }
                              }}
                              className={`text-xs font-bold px-2 py-1 rounded-md border focus:outline-hidden ${
                                isLighted
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : isNotLighted
                                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                                  : site.status === 'Partially Lit' || site.status === 'Half Not Lit'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : site.status === 'Greenish'
                                  ? 'bg-emerald-200 text-emerald-950 border-emerald-400'
                                  : site.status === 'Yellowish'
                                  ? 'bg-yellow-100 text-yellow-950 border-yellow-400'
                                  : site.status === 'Lighting Arm Shifted'
                                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                                  : site.status === 'Cable fault' || site.status === 'Electrical fittings missing' || site.status === 'Vandalism'
                                  ? 'bg-red-100 text-red-900 border-red-300'
                                  : site.status === 'Timer switch malfunction'
                                  ? 'bg-orange-100 text-orange-900 border-orange-300'
                                  : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                              }`}
                            >
                              <option value="Lighted">💡 Lighted (Good)</option>
                              <option value="Partially Lit">🌤️ Partially Lit</option>
                              <option value="Greenish">🟢 Greenish</option>
                              <option value="Yellowish">🟡 Yellowish</option>
                              <option value="Not Lighted">🔴 Not Lighted</option>
                              <option value="Half Not Lit">🌓 Half Not Lit</option>
                              <option value="Lighting Arm Shifted">📐 Lighting Arm Shifted</option>
                              <option value="Cable fault">⚡ Cable fault</option>
                              <option value="Vandalism">🚨 Vandalism</option>
                              <option value="Electrical fittings missing">🔌 Electrical fittings missing</option>
                              <option value="Timer switch malfunction">⏱️ Timer switch malfunction</option>
                              <option value="Others">📝 Others</option>
                              <option value="Custom">✏️ Custom Text</option>
                            </select>
                          </div>

                          {/* Editable status box */}
                          <div className="flex items-center gap-1.5 bg-white border border-slate-300 focus-within:border-emerald-500 rounded-md px-2 py-1 shadow-2xs">
                            <span className="text-[10px] text-slate-500 font-extrabold uppercase shrink-0">Status Text:</span>
                            <input
                              type="text"
                              value={site.status}
                              onChange={(e) => handleStatusChange(site.id, e.target.value)}
                              className="font-bold text-xs text-slate-900 bg-transparent focus:outline-hidden w-full"
                              placeholder="Type status (e.g.: Lighted, Greenish)..."
                              title="Custom status edit field"
                            />
                          </div>
                        </div>
                      </div>

                  {/* Notes input */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={site.notes || ''}
                      onChange={(e) => handleNotesChange(site.id, e.target.value)}
                      placeholder="Add site-specific notes..."
                      className="w-full bg-slate-50 text-xs text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Inspection Report Summary Notes
                </label>
                <textarea
                  rows={4}
                  value={currentZone.remarks || ''}
                  onChange={(e) =>
                    setCurrentZone({ ...currentZone, remarks: e.target.value })
                  }
                  placeholder="Enter zone audit summary..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl p-3 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
                <div className="font-bold text-slate-800">Lighting Audit Guidelines (August 2026)</div>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Ensure Lux meter reading exceeds 100 Lux for main highways & gantries.</li>
                  <li>Check photocell timer settings on distribution cabinets (DB box).</li>
                  <li>Log all faulty fixtures & escalate to maintenance unit immediately.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg transition cursor-pointer shadow-md ${
              savedSuccess ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save Audit Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub Modals */}
      {selectedQrSite && (
        <SiteQrModal
          zone={currentZone}
          site={selectedQrSite}
          onClose={() => setSelectedQrSite(null)}
          onOpenSiteStatus={onOpenSiteStatus}
        />
      )}

      {isBulkQrOpen && (
        <BulkQrLabelsModal
          zone={currentZone}
          onClose={() => setIsBulkQrOpen(false)}
        />
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Eye,
  ClipboardCheck,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Compass,
  Filter,
} from 'lucide-react';
import { ZoneData, SiteDetail } from '../types';
import { ZONE_REAL_COORDINATES, getSiteLatLng, getSitePhotoEvidence } from '../utils/photoHelpers';
import { getSiteCodeRange } from '../utils/siteHelpers';
import { InspectorBadge } from './InspectorBadge';

interface BillboardMapViewProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  onOpenChecklist?: (zoneNo: number, week: 'week2' | 'week4') => void;
  onOpenWeeklyPhotoReport?: (zoneNo: number) => void;
  searchQuery?: string;
}

interface FlatBillboardMarker {
  id: string;
  siteCode: string;
  name: string;
  fixtureType: SiteDetail['fixtureType'];
  status: string;
  luxLevel: number;
  lat: number;
  lng: number;
  zone: ZoneData;
  site: SiteDetail;
  siteIndex: number;
  highway: string;
}

export const BillboardMapView: React.FC<BillboardMapViewProps> = ({
  zones,
  onSelectZone,
  onOpenChecklist,
  onOpenWeeklyPhotoReport,
  searchQuery = '',
}) => {
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<number>(0);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIGHTED' | 'DEFECT'>('ALL');
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);
  const [mapDisplayMode, setMapDisplayMode] = useState<'gis' | 'osm'>('gis');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedMarker, setSelectedMarker] = useState<FlatBillboardMarker | null>(null);

  // Build flat list of all billboard sites with GPS coordinates
  const allMarkers = useMemo<FlatBillboardMarker[]>(() => {
    const list: FlatBillboardMarker[] = [];
    zones.forEach((zone) => {
      const coordMeta = ZONE_REAL_COORDINATES[zone.zoneNo] || {
        lat: 3.139,
        lng: 101.6869,
        highway: zone.description,
      };
      (zone.sites || []).forEach((site, idx) => {
        const { lat, lng } = getSiteLatLng(zone.zoneNo, idx);
        const effStatus = site.week4Report?.status || site.week2Report?.status || site.status || 'Lighted';
        const effLux =
          site.week4Report?.luxLevel ??
          site.week2Report?.luxLevel ??
          site.luxLevel ??
          (effStatus === 'Lighted' ? 140 : 25);

        list.push({
          id: site.id,
          siteCode: site.siteCode,
          name: site.name,
          fixtureType: site.fixtureType,
          status: effStatus,
          luxLevel: effLux,
          lat,
          lng,
          zone,
          site,
          siteIndex: idx,
          highway: coordMeta.highway,
        });
      });
    });
    return list;
  }, [zones]);

  // Filtered markers
  const filteredMarkers = useMemo(() => {
    const q = (localSearch || searchQuery).trim().toLowerCase();
    return allMarkers.filter((m) => {
      if (selectedZoneFilter !== 0 && m.zone.zoneNo !== selectedZoneFilter) return false;
      if (selectedRegionFilter !== 'ALL' && m.zone.region !== selectedRegionFilter) return false;

      const isLighted = m.status.toLowerCase() === 'lighted' || m.status.toLowerCase() === 'working';
      if (statusFilter === 'LIGHTED' && !isLighted) return false;
      if (statusFilter === 'DEFECT' && isLighted) return false;

      if (!q) return true;
      return (
        m.siteCode.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.zone.description.toLowerCase().includes(q) ||
        m.highway.toLowerCase().includes(q) ||
        `zone ${m.zone.zoneNo}` === q ||
        `z${m.zone.zoneNo}` === q
      );
    });
  }, [allMarkers, selectedZoneFilter, selectedRegionFilter, statusFilter, localSearch, searchQuery]);

  // Active marker defaults to first filtered marker
  const activeMarker = selectedMarker && filteredMarkers.some((m) => m.id === selectedMarker.id)
    ? selectedMarker
    : filteredMarkers[0] || null;

  // Map bounding box for Klang Valley GIS projection
  // Lat range: ~2.73 (KLIA) to 3.24 (Kepong/MRR2)
  // Lng range: ~101.43 (Klang) to 101.79 (Ampang/Bangi)
  const minLat = 2.72;
  const maxLat = 3.25;
  const minLng = 101.42;
  const maxLng = 101.79;

  const projectToPercent = (lat: number, lng: number) => {
    const xPct = ((lng - minLng) / (maxLng - minLng)) * 88 + 6;
    const yPct = (1 - (lat - minLat) / (maxLat - minLat)) * 86 + 7;
    return {
      x: Math.max(4, Math.min(96, xPct)),
      y: Math.max(5, Math.min(95, yPct)),
    };
  };

  // Summary counts
  const totalLighted = filteredMarkers.filter(
    (m) => m.status.toLowerCase() === 'lighted' || m.status.toLowerCase() === 'working'
  ).length;
  const totalDefects = filteredMarkers.length - totalLighted;

  // OpenStreetMap embed URL for active marker or Klang Valley center
  const osmCenterLat = activeMarker ? activeMarker.lat : 3.139;
  const osmCenterLng = activeMarker ? activeMarker.lng : 101.6869;
  const osmDelta = activeMarker ? 0.015 : 0.12;
  const osmBbox = `${(osmCenterLng - osmDelta).toFixed(4)}%2C${(osmCenterLat - osmDelta).toFixed(4)}%2C${(
    osmCenterLng + osmDelta
  ).toFixed(4)}%2C${(osmCenterLat + osmDelta).toFixed(4)}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${osmBbox}&layer=mapnik&marker=${osmCenterLat.toFixed(
    5
  )}%2C${osmCenterLng.toFixed(5)}`;

  return (
    <div className="space-y-5">
      {/* Top Map Control Header */}
      <div className="bg-[#031e13] border border-emerald-600/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                <Compass className="w-3 h-3" />
                GIS BILLBOARD ASSET LOCATOR
              </span>
              <span className="text-xs font-mono text-emerald-300 font-bold">
                31 ZONES • {allMarkers.length} BILLBOARD SITES
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Peta Lokasi Billboard & Pemantauan Pencahayaan (Klang Valley & Lebuhraya)
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Klik mana-mana pin lokasi billboard untuk melihat kod tapak, bacaan Lux, bukti gambar waktu malam, dan status pemeriksaan.
            </p>
          </div>

          {/* Map Engine Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <div className="bg-[#042416] p-1 rounded-xl border border-emerald-500/40 flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setMapDisplayMode('gis')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  mapDisplayMode === 'gis'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>31-Zone GIS Radar Map</span>
              </button>
              <button
                type="button"
                onClick={() => setMapDisplayMode('osm')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  mapDisplayMode === 'osm'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>OpenStreetMap Live</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-xs">
          {/* 1. Search by Site Code or Highway */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              Cari Kod Tapak / Lokasi:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Cth: P0001, UP0002, Bangsar, LDP..."
                className="w-full bg-[#042416] text-white border border-emerald-600/40 rounded-xl pl-8 pr-7 py-2 text-xs focus:outline-none focus:border-amber-400"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 2. Zone Selector */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              Pilih Zon (Zone 1 - 31):
            </label>
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(Number(e.target.value))}
              className="w-full bg-[#042416] text-white font-bold border border-emerald-600/40 rounded-xl p-2 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value={0}>Semua 31 Zon ({allMarkers.length} Tapak Billboard)</option>
              {zones.map((z) => (
                <option key={z.id} value={z.zoneNo} className="bg-[#042416] text-white">
                  Zone {z.zoneNo}: {z.description} ({z.siteCount} Sites)
                </option>
              ))}
            </select>
          </div>

          {/* 3. Region Filter */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              Wilayah / Koridor Lebuhraya:
            </label>
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="w-full bg-[#042416] text-white font-bold border border-emerald-600/40 rounded-xl p-2 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ALL">Semua Wilayah (Klang Valley)</option>
              <option value="Kuala Lumpur / City">Kuala Lumpur / City</option>
              <option value="Highways & Expressway">Highways & Expressway</option>
              <option value="Petaling Jaya & Subang">Petaling Jaya & Subang</option>
              <option value="South & Outskirts">South & Outskirts</option>
            </select>
          </div>

          {/* 4. Lighting Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              Status Pencahayaan Billboard:
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#042416] p-1 rounded-xl border border-emerald-600/40">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`py-1.5 rounded-lg font-extrabold text-[11px] transition cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Semua ({filteredMarkers.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('LIGHTED')}
                className={`py-1.5 rounded-lg font-extrabold text-[11px] transition cursor-pointer ${
                  statusFilter === 'LIGHTED'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Lighted ({totalLighted})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DEFECT')}
                className={`py-1.5 rounded-lg font-extrabold text-[11px] transition cursor-pointer ${
                  statusFilter === 'DEFECT'
                    ? 'bg-rose-500 text-white font-black'
                    : 'text-rose-300 hover:text-white'
                }`}
              >
                Defect ({totalDefects})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Map + Selected Billboard Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Columns: Interactive Map Viewport */}
        <div className="lg:col-span-8 bg-[#02180f] border border-emerald-600/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Map Top Status Bar */}
          <div className="bg-[#042416] px-4 py-2.5 border-b border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                Lighted ({totalLighted})
              </span>
              <span className="flex items-center gap-1.5 font-bold text-rose-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                Maintenance / Defect ({totalDefects})
              </span>
            </div>

            {mapDisplayMode === 'gis' && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
                  className="p-1.5 bg-[#02180f] hover:bg-emerald-900 text-emerald-200 rounded-lg border border-emerald-700/50 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-amber-300 px-1.5">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.25, Number((z + 0.25).toFixed(2))))}
                  className="p-1.5 bg-[#02180f] hover:bg-emerald-900 text-emerald-200 rounded-lg border border-emerald-700/50 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setSelectedZoneFilter(0);
                    setStatusFilter('ALL');
                    setLocalSearch('');
                  }}
                  className="p-1.5 bg-[#02180f] hover:bg-emerald-900 text-amber-300 rounded-lg border border-emerald-700/50 cursor-pointer"
                  title="Reset Map View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Map Canvas */}
          {mapDisplayMode === 'gis' ? (
            <div className="relative h-[520px] w-full overflow-auto bg-[#02140c] select-none">
              <div
                className="relative w-full h-full min-w-[680px] min-h-[500px] transition-transform duration-200 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Background Coordinate Grid & Highway Network SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 700" preserveAspectRatio="none">
                  <defs>
                    <pattern id="gisGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" />
                    </pattern>
                    <radialGradient id="klGlow" cx="65%" cy="25%" r="45%">
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0.16)" />
                      <stop offset="100%" stopColor="rgba(2, 24, 15, 0)" />
                    </radialGradient>
                  </defs>
                  <rect width="1000" height="700" fill="url(#gisGrid)" />
                  <rect width="1000" height="700" fill="url(#klGlow)" />

                  {/* Major Klang Valley Expressway Corridors */}
                  {/* Federal Highway (Klang -> Shah Alam -> Subang -> PJ -> KL) */}
                  <path
                    d="M 80 310 Q 320 270 510 250 T 760 205"
                    fill="none"
                    stroke="rgba(52, 211, 153, 0.28)"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                  />
                  {/* NKVE & Guthrie North-South Link */}
                  <path
                    d="M 310 110 Q 450 180 620 165 T 820 190"
                    fill="none"
                    stroke="rgba(251, 191, 36, 0.22)"
                    strokeWidth="3"
                  />
                  {/* LDP & ELITE South Corridor to KLIA */}
                  <path
                    d="M 540 130 Q 520 280 480 420 T 740 640"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.24)"
                    strokeWidth="3.5"
                  />
                  {/* MRR2 & Cheras-Bangi Loop */}
                  <path
                    d="M 570 90 Q 830 95 850 260 T 910 500"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.25)"
                    strokeWidth="3"
                  />
                </svg>

                {/* Regional Watermark Labels */}
                <div className="absolute top-5 left-6 text-[10px] font-mono font-bold text-emerald-500/40 uppercase tracking-widest pointer-events-none">
                  GUTHRIE / KOTA DAMANSARA CORRIDOR
                </div>
                <div className="absolute top-6 right-8 text-[10px] font-mono font-bold text-emerald-500/40 uppercase tracking-widest pointer-events-none">
                  KL CITY CENTRE • MRR2 • AMPANG
                </div>
                <div className="absolute top-1/2 left-6 text-[10px] font-mono font-bold text-emerald-500/40 uppercase tracking-widest pointer-events-none">
                  KLANG / SHAH ALAM (FEDERAL HWY)
                </div>
                <div className="absolute bottom-6 right-8 text-[10px] font-mono font-bold text-emerald-500/40 uppercase tracking-widest pointer-events-none">
                  ELITE • BANGI • KLIA SOUTH CORRIDOR
                </div>

                {/* Plot All Filtered Billboard Markers */}
                {filteredMarkers.map((marker) => {
                  const pos = projectToPercent(marker.lat, marker.lng);
                  const isLighted =
                    marker.status.toLowerCase() === 'lighted' || marker.status.toLowerCase() === 'working';
                  const isSelected = activeMarker?.id === marker.id;

                  return (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={() => setSelectedMarker(marker)}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all ${
                        isSelected ? 'z-30 scale-125' : 'z-10 hover:z-20 hover:scale-125'
                      }`}
                      title={`${marker.siteCode} — ${marker.name} (Zone ${marker.zone.zoneNo}) • ${marker.status}`}
                    >
                      {/* Marker Pulse Ring for Selected or Defect */}
                      {(isSelected || !isLighted) && (
                        <span
                          className={`absolute -inset-1.5 rounded-full animate-ping opacity-60 ${
                            isSelected ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                        />
                      )}

                      {/* Pin Dot */}
                      <div
                        className={`relative flex items-center justify-center rounded-full border shadow-md transition-all ${
                          isSelected
                            ? 'w-7 h-7 bg-amber-400 text-slate-950 border-white ring-2 ring-amber-300 font-black text-[9px]'
                            : !isLighted
                            ? 'w-5 h-5 bg-rose-600 text-white border-rose-200 font-bold text-[8px]'
                            : 'w-4 h-4 bg-emerald-500 text-slate-950 border-emerald-950 font-bold text-[7px] opacity-90 hover:opacity-100'
                        }`}
                      >
                        {isSelected || filteredMarkers.length <= 35 ? `Z${marker.zone.zoneNo}` : ''}
                      </div>

                      {/* Floating Tooltip on Hover or Selection */}
                      <div
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-lg bg-slate-950/95 text-white border border-emerald-500/50 text-[10px] font-mono whitespace-nowrap shadow-xl pointer-events-none transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <span className="font-black text-amber-300">{marker.siteCode}</span> • Z{marker.zone.zoneNo}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* OpenStreetMap Live View (No Google Maps Required) */
            <div className="relative h-[520px] w-full bg-slate-900 flex flex-col">
              <iframe
                title="OpenStreetMap Live Billboard Location"
                src={osmEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
              />
              {activeMarker && (
                <div className="absolute bottom-3 left-3 right-3 bg-[#02180f]/95 backdrop-blur-md border border-emerald-500/50 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black">
                      {activeMarker.siteCode}
                    </span>
                    <span className="font-bold text-white">{activeMarker.name}</span>
                    <span className="text-emerald-300 font-mono text-[11px]">
                      ({activeMarker.lat.toFixed(5)}° N, {activeMarker.lng.toFixed(5)}° E)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMapDisplayMode('gis')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] cursor-pointer"
                  >
                    Lihat Semua 31 Zon (GIS Radar)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 4 Columns: Selected Billboard Site Detail & Quick Zone Switcher */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {activeMarker ? (
            <div className="bg-[#031e13] border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-emerald-800/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-mono font-black text-xs">
                      {activeMarker.siteCode}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">
                      Zone {activeMarker.zone.zoneNo} • {activeMarker.fixtureType}
                    </span>
                  </div>
                  <h3 className="font-black text-base text-white mt-1.5 leading-snug">
                    {activeMarker.name}
                  </h3>
                  <p className="text-[11px] text-emerald-200/80 font-mono mt-0.5">
                    📍 GPS: {activeMarker.lat.toFixed(5)}° N, {activeMarker.lng.toFixed(5)}° E
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                    activeMarker.status.toLowerCase() === 'lighted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {activeMarker.status}
                </span>
              </div>

              {/* Night Illumination Preview Thumbnail */}
              {(() => {
                const ev = getSitePhotoEvidence(
                  activeMarker.siteCode,
                  activeMarker.status,
                  activeMarker.site.photos,
                  'week2'
                );
                return (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-700/50 aspect-16/9 bg-slate-950">
                    <img
                      src={ev.nightIllumination}
                      alt={activeMarker.siteCode}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-2.5 flex items-end justify-between text-[11px]">
                      <div>
                        <div className="font-mono font-bold text-amber-300">
                          {activeMarker.zone.description}
                        </div>
                        <div className="text-[10px] text-slate-300">{activeMarker.highway}</div>
                      </div>
                      <span className="font-mono font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px]">
                        {activeMarker.luxLevel} LUX
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Inspector & Schedule Metadata */}
              <div className="grid grid-cols-2 gap-2.5 text-xs bg-[#042416] p-3 rounded-xl border border-emerald-800/60">
                <div>
                  <span className="text-[10px] text-emerald-300/70 uppercase font-bold block mb-1">
                    Week 2 Inspector
                  </span>
                  <InspectorBadge name={activeMarker.zone.week2Inspector} size="sm" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300/70 uppercase font-bold block mb-1">
                    Week 4 Inspector
                  </span>
                  <InspectorBadge name={activeMarker.zone.week4Inspector} size="sm" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectZone(activeMarker.zone)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Butiran Tapak & QR</span>
                </button>

                {onOpenWeeklyPhotoReport && (
                  <button
                    type="button"
                    onClick={() => onOpenWeeklyPhotoReport(activeMarker.zone.zoneNo)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Laporan Bergambar</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* Scrollable List of Filtered Billboard Sites */}
          <div className="bg-[#031e13] border border-emerald-600/30 rounded-2xl p-3.5 shadow-xl flex-1 flex flex-col max-h-[250px]">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-emerald-800/60">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                Senarai Tapak Pada Peta ({filteredMarkers.length})
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">Klik untuk fokus</span>
            </div>
            <div className="overflow-y-auto space-y-1.5 pr-1">
              {filteredMarkers.slice(0, 60).map((m) => {
                const isSelected = activeMarker?.id === m.id;
                const isOk = m.status.toLowerCase() === 'lighted';
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMarker(m)}
                    className={`w-full text-left p-2 rounded-xl border text-xs flex items-center justify-between gap-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-900/80 border-amber-400 text-white'
                        : 'bg-[#042416]/80 border-emerald-800/40 text-emerald-100 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-mono font-black text-amber-300 mr-1.5">{m.siteCode}</span>
                      <span className="font-semibold">{m.name}</span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isOk ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

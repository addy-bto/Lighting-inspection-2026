import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ZoneData } from '../types';
import { INSPECTORS } from '../data/initialData';
import { BarChart3, PieChart as PieIcon, ShieldCheck, MapPin } from 'lucide-react';

interface AnalyticsViewProps {
  zones: ZoneData[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ zones }) => {
  // 1. Inspector Workload Data
  const inspectorWorkloadData = Object.values(INSPECTORS).map((insp) => {
    const assigned = zones.filter(
      (z) => z.week2Inspector === insp.name || z.week4Inspector === insp.name
    );
    const totalSites = assigned.reduce((sum, z) => sum + z.siteCount, 0);
    const totalDefects = assigned.reduce((sum, z) => sum + z.defectCount, 0);

    return {
      name: insp.name,
      zones: assigned.length,
      sites: totalSites,
      defects: totalDefects,
      color: insp.color.hex,
    };
  });

  // 2. Region Breakdown Data
  const regionCounts: Record<string, number> = {};
  zones.forEach((z) => {
    regionCounts[z.region] = (regionCounts[z.region] || 0) + z.siteCount;
  });

  const regionData = Object.entries(regionCounts).map(([region, sites]) => ({
    name: region,
    value: sites,
  }));

  const REGION_COLORS = ['#059669', '#0284c7', '#7c3aed', '#d97706'];

  // 3. Top 8 Largest Zones
  const topZones = [...zones]
    .sort((a, b) => b.siteCount - a.siteCount)
    .slice(0, 8)
    .map((z) => ({
      name: `Z${z.zoneNo} (${z.description.replace(/Zone \d+ \(/, '').replace(/\)/, '')})`,
      sites: z.siteCount,
      defects: z.defectCount,
    }));

  return (
    <div className="space-y-6 my-4">
      {/* Analytics Banner */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
              <BarChart3 className="w-3.5 h-3.5" /> EXECUTIVE AUDIT METRICS • AUGUST 2026
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Workload Allocation & Site Density Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Visualization of lighting inspection data by inspector, highway network region, and critical zone distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Inspector Workload */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Site Allocation by Inspector
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comparison of site workload across 5 field specialists
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inspectorWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="sites" name="Total Sites" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Site Density */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              Site Distribution by Region Category
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Streetlight & gantry fixture density across Klang Valley
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={REGION_COLORS[index % REGION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Top Largest Zones */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          Top 8 Zones by Site Capacity
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          High-impact corridors requiring continuous monitoring (e.g. Federal Highway, LDP, NPE)
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topZones} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis dataKey="name" type="category" tickLine={false} tick={{ fontSize: 10, fill: '#1e293b' }} width={180} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="sites" name="Site Capacity" fill="#7c3aed" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Real-time Status Lighting Distribution Breakdown */}
      {(() => {
        const statusCounts: Record<string, number> = {};
        let totalAllSites = 0;

        zones.forEach((z) => {
          if (z.sites && z.sites.length > 0) {
            z.sites.forEach((s) => {
              const st = s.status || 'Lighted';
              statusCounts[st] = (statusCounts[st] || 0) + 1;
              totalAllSites++;
            });
          } else {
            totalAllSites += z.siteCount;
            statusCounts['Lighted'] = (statusCounts['Lighted'] || 0) + (z.siteCount - z.defectCount);
            if (z.defectCount > 0) {
              statusCounts['Not Lighted'] = (statusCounts['Not Lighted'] || 0) + z.defectCount;
            }
          }
        });

        const statusBadgesConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
          'Lighted': { bg: 'bg-emerald-50 text-emerald-900', text: 'Lighted (Good)', border: 'border-emerald-300', icon: '💡' },
          'Partially Lit': { bg: 'bg-amber-50 text-amber-900', text: 'Partially Lit', border: 'border-amber-300', icon: '🌤️' },
          'Yellowish': { bg: 'bg-yellow-50 text-yellow-900', text: 'Yellowish', border: 'border-yellow-300', icon: '🟡' },
          'Greenish': { bg: 'bg-teal-50 text-teal-900', text: 'Greenish', border: 'border-teal-300', icon: '🟢' },
          'Not Lighted': { bg: 'bg-rose-50 text-rose-900', text: 'Not Lighted (Unlit)', border: 'border-rose-300', icon: '🔴' },
          'Half Not Lit': { bg: 'bg-orange-50 text-orange-900', text: 'Half Not Lit', border: 'border-orange-300', icon: '🌓' },
          'Cable fault': { bg: 'bg-rose-100 text-rose-950', text: 'Cable Fault', border: 'border-rose-400', icon: '⚡' },
          'Vandalism': { bg: 'bg-purple-50 text-purple-900', text: 'Vandalism', border: 'border-purple-300', icon: '🚨' },
          'Electrical fittings missing': { bg: 'bg-rose-100 text-rose-900', text: 'Electrical Fittings Missing', border: 'border-rose-300', icon: '🔌' },
          'Timer switch malfunction': { bg: 'bg-amber-100 text-amber-900', text: 'Timer Switch Malfunction', border: 'border-amber-300', icon: '⏱️' },
          'Lighting Arm Shifted': { bg: 'bg-indigo-50 text-indigo-900', text: 'Lighting Arm Shifted', border: 'border-indigo-300', icon: '📐' },
        };

        const sortedStatuses = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

        return (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Real-Time Lighting Status Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Summary of physical lighting status across all {totalAllSites} sites / fixtures
                </p>
              </div>
              <span className="text-xs font-mono font-extrabold bg-slate-900 text-amber-300 px-3 py-1 rounded-lg border border-slate-800 self-start sm:self-center">
                Total: {totalAllSites} Sites
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedStatuses.map(([st, count]) => {
                const conf = statusBadgesConfig[st] || {
                  bg: 'bg-slate-50 text-slate-900',
                  text: st,
                  border: 'border-slate-300',
                  icon: '📝',
                };
                const pct = Math.round((count / (totalAllSites || 1)) * 100);

                return (
                  <div
                    key={st}
                    className={`p-3 rounded-xl border ${conf.border} ${conf.bg} flex items-center justify-between gap-3 shadow-2xs`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{conf.icon}</span>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold truncate">{conf.text}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{pct}% of overall total</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-black font-mono">{count}</span>
                      <span className="block text-[9px] font-extrabold uppercase text-slate-500">Units</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

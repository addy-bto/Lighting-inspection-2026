import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { ZoneData, InspectorName, ZoneRegion } from '../types';

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddZone: (newZone: ZoneData) => void;
  existingZonesCount: number;
}

export const AddZoneModal: React.FC<AddZoneModalProps> = ({
  isOpen,
  onClose,
  onAddZone,
  existingZonesCount,
}) => {
  if (!isOpen) return null;

  const nextZoneNo = existingZonesCount + 1;
  const [description, setDescription] = useState(`Zone ${nextZoneNo} (New Location)`);
  const [week2Inspector, setWeek2Inspector] = useState<InspectorName>('Nusir');
  const [week4Inspector, setWeek4Inspector] = useState<InspectorName>('Nusir');
  const [siteCount, setSiteCount] = useState<number>(8);
  const [region, setRegion] = useState<ZoneRegion>('Highways & Expressway');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newZone: ZoneData = {
      id: Date.now(),
      zoneNo: nextZoneNo,
      description,
      week2Inspector,
      week4Inspector,
      siteCount,
      region,
      status: 'Pending',
      week2Status: 'Pending',
      week4Status: 'Pending',
      defectCount: 0,
      remarks: 'Newly added inspection zone for August 2026.',
      sites: Array.from({ length: siteCount }, (_, i) => {
        const num = (i + 1).toString().padStart(3, '0');
        const prefix = `Z${nextZoneNo.toString().padStart(2, '0')}`;
        return {
          id: `z${nextZoneNo}-s${i + 1}`,
          siteCode: `${prefix}S${num}`,
          name: `${description} - Site Location #${i + 1}`,
          fixtureType: 'Unipole',
          status: 'Lighted',
          luxLevel: 140,
          lastInspectedDate: '2026-08-20',
          notes: 'Initial setup for inspection.',
        };
      }),
    };

    onAddZone(newZone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Add New Inspection Zone (August 2026)
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zone Number & Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              placeholder="e.g. Zone 32 (Subang Airport Highway)"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Region Category / Group
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as ZoneRegion)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="Kuala Lumpur / City">Kuala Lumpur / City</option>
              <option value="Highways & Expressway">Highways & Expressway</option>
              <option value="Petaling Jaya & Subang">Petaling Jaya & Subang</option>
              <option value="South & Outskirts">South & Outskirts</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Week 2 Inspector
              </label>
              <select
                value={week2Inspector}
                onChange={(e) => setWeek2Inspector(e.target.value as InspectorName)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
              >
                <option value="Nusir">Nusir</option>
                <option value="Yana">Yana</option>
                <option value="Fadrul">Fadrul</option>
                <option value="Asyaqif">Asyaqif</option>
                <option value="Ray">Ray</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Week 4 Inspector
              </label>
              <select
                value={week4Inspector}
                onChange={(e) => setWeek4Inspector(e.target.value as InspectorName)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
              >
                <option value="Nusir">Nusir</option>
                <option value="Yana">Yana</option>
                <option value="Fadrul">Fadrul</option>
                <option value="Asyaqif">Asyaqif</option>
                <option value="Ray">Ray</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Number of Sites in Zone
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={siteCount}
              onChange={(e) => setSiteCount(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition cursor-pointer shadow-md inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Add Zone</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

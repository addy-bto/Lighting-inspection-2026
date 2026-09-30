import React from 'react';
import { X, CheckCircle2, Search, SlidersHorizontal, Save, UserCheck, HelpCircle, ArrowRight } from 'lucide-react';

interface InspectorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InspectorGuideModal: React.FC<InspectorGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Inspector Guide: How to Update Monthly Lighting Status
              </h2>
              <p className="text-xs text-slate-400">
                Step-by-step instructions for inspection officers to update monthly site & zone status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Search className="w-4 h-4 text-emerald-600" /> Find Your Site / Zone
              </h3>
              <p className="text-slate-600 mt-1 leading-relaxed text-xs">
                Use the **Top Search Bar** at the top or click the **Quick Search** pills (e.g. <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">UP0001</code>, <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">UP0002</code>, or Zone/Inspector name) to locate your assigned task.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Open Details Modal
              </h3>
              <p className="text-slate-600 mt-1 leading-relaxed text-xs">
                Click on any Zone row in the **Table** or click **"Manage / Update"** on the Grid Card to open the audit record window.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Update Lighting Status
              </h3>
              <div className="space-y-2 mt-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">1. Zone Lighting Status (Sub-header):</span>
                  <p className="text-slate-500 mt-0.5">
                    Select between <strong className="text-emerald-700">Completed</strong>, <strong className="text-amber-700">In Progress</strong>, <strong className="text-slate-700">Pending</strong>, or <strong className="text-rose-700">Needs Maintenance</strong>.
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">2. Physical Site Status (Fixtures):</span>
                  <p className="text-slate-500 mt-0.5">
                    Select specific status: <strong className="text-emerald-700">Lighted</strong> (Normal), <strong className="text-amber-700">Partially Lit</strong>, <strong className="text-emerald-800">Greenish</strong>, <strong className="text-yellow-700">Yellowish</strong>, <strong className="text-rose-700">Not Lighted</strong>, <strong className="text-amber-800">Half Not Lit</strong>, <strong className="text-purple-700">Lighting Arm Shifted</strong>, <strong className="text-red-700">Cable fault</strong>, <strong className="text-red-800">Vandalism</strong>, <strong className="text-rose-800">Electrical fittings missing</strong>, <strong className="text-orange-700">Timer switch malfunction</strong>, or <strong className="text-slate-700">Others</strong>. You can also type custom statuses directly in the edit field.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Assign Lead Inspector & Notes
              </h3>
              <p className="text-slate-600 mt-1 leading-relaxed text-xs">
                Update the **Week 2** & **Week 4 Inspector** names, and enter any **Audit Notes / Remarks** regarding timer offsets, power supply issues, or maintenance needs.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start gap-3 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              5
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                <Save className="w-4 h-4 text-emerald-700 text-sm" /> Save Changes
              </h3>
              <p className="text-emerald-800 mt-1 leading-relaxed text-xs">
                Click **"Save Changes"** at the bottom right of the modal. The system will automatically recalculate defect/lighting effectiveness percentages and update the main display in real time!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Got it! Open Reports</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

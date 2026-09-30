import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, QrCode, CheckSquare, Square, Layers } from 'lucide-react';
import { ZoneData, SiteDetail } from '../types';

interface BulkQrLabelsModalProps {
  zone: ZoneData;
  onClose: () => void;
}

export const BulkQrLabelsModal: React.FC<BulkQrLabelsModalProps> = ({ zone, onClose }) => {
  const sites = zone.sites || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(sites.map((s) => s.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sites.map((s) => s.id));
    }
  };

  const handlePrintSheet = () => {
    const selectedSites = sites.filter((s) => selectedIds.includes(s.id));
    if (selectedSites.length === 0) {
      alert('Please select at least one site to print.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const baseUrl = window.location.origin + window.location.pathname;

    const cardsHtml = selectedSites
      .map((site) => {
        const targetUrl = `${baseUrl}?zone=${zone.zoneNo}&siteId=${encodeURIComponent(site.id)}&siteCode=${encodeURIComponent(site.siteCode)}`;
        const svgEl = document.getElementById(`bulk-qr-${site.id}`);
        const svgHtml = svgEl ? svgEl.outerHTML : '';

        return `
        <div class="label-card">
          <div class="label-header">BIG TREE LIGHTING • ZONE ${zone.zoneNo}</div>
          <div class="site-code">${site.siteCode}</div>
          <div class="qr-box">${svgHtml}</div>
          <div class="site-name">${site.name}</div>
          <div class="footer">SCAN FOR FIELD INSPECTION STATUS</div>
        </div>
      `;
      })
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Label Sheet - Zone ${zone.zoneNo}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .label-card {
              border: 2px solid #0f172a;
              border-radius: 12px;
              padding: 12px;
              text-align: center;
              box-sizing: border-box;
              page-break-inside: avoid;
              background: #ffffff;
            }
            .label-header {
              font-size: 9px;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: #047857;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .site-code {
              font-family: monospace;
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              padding: 2px 8px;
              border-radius: 6px;
              display: inline-block;
              margin-bottom: 8px;
            }
            .qr-box {
              padding: 6px;
              background: #f8fafc;
              border: 1px dashed #cbd5e1;
              border-radius: 8px;
              display: inline-block;
              margin-bottom: 6px;
            }
            .site-name {
              font-size: 11px;
              font-weight: 600;
              color: #334155;
              line-height: 1.3;
              margin-bottom: 6px;
              max-height: 2.6em;
              overflow: hidden;
            }
            .footer {
              font-size: 8px;
              font-weight: 700;
              color: #64748b;
              letter-spacing: 0.5px;
              text-transform: uppercase;
              border-top: 1px solid #e2e8f0;
              padding-top: 4px;
            }
          </style>
        </head>
        <body>
          <div class="grid-container">
            ${cardsHtml}
          </div>
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Print QR Sticker Label Sheet - Zone {zone.zoneNo}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Select sites to print field QR stickers in bulk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {selectedIds.length === sites.length ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            {selectedIds.length === sites.length ? 'Deselect All' : 'Select All Sites'}
          </button>
          <span className="font-mono text-slate-500 font-bold">
            Selected: {selectedIds.length} / {sites.length} sites
          </span>
        </div>

        {/* Hidden SVGs for printing */}
        <div className="hidden">
          {sites.map((s) => {
            const baseUrl = window.location.origin + window.location.pathname;
            const targetUrl = `${baseUrl}?zone=${zone.zoneNo}&siteId=${encodeURIComponent(s.id)}&siteCode=${encodeURIComponent(s.siteCode)}`;
            return (
              <QRCodeSVG
                key={s.id}
                id={`bulk-qr-${s.id}`}
                value={targetUrl}
                size={140}
                level="M"
              />
            );
          })}
        </div>

        {/* Sites Checklist */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {sites.map((site) => {
            const isSelected = selectedIds.includes(site.id);
            return (
              <div
                key={site.id}
                onClick={() => toggleSelect(site.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {site.siteCode}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {site.fixtureType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5 line-clamp-1">
                      {site.name}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      site.status.toLowerCase() === 'lighted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {site.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrintSheet}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Sticker Sheet ({selectedIds.length} Labels)
          </button>
        </div>
      </div>
    </div>
  );
};

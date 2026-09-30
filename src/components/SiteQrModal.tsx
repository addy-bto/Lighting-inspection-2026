import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Printer, Download, ExternalLink, QrCode, ShieldCheck, MapPin, Lightbulb } from 'lucide-react';
import { ZoneData, SiteDetail } from '../types';

interface SiteQrModalProps {
  zone: ZoneData;
  site: SiteDetail;
  onClose: () => void;
  onOpenSiteStatus?: (zone: ZoneData, site: SiteDetail) => void;
}

export const SiteQrModal: React.FC<SiteQrModalProps> = ({ zone, site, onClose, onOpenSiteStatus }) => {
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Generate URL for scanning
  const baseUrl = window.location.origin + window.location.pathname;
  const targetUrl = `${baseUrl}?zone=${zone.zoneNo}&siteId=${encodeURIComponent(site.id)}&siteCode=${encodeURIComponent(site.siteCode)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintLabel = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Site QR Label - ${site.siteCode}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 20px;
              background: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .label-card {
              border: 3px solid #0f172a;
              border-radius: 16px;
              padding: 24px;
              width: 340px;
              text-align: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background: #ffffff;
            }
            .label-header {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 1px;
              color: #047857;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .label-title {
              font-size: 18px;
              font-weight: 900;
              color: #0f172a;
              margin-bottom: 2px;
            }
            .zone-badge {
              display: inline-block;
              background: #f1f5f9;
              color: #334155;
              font-size: 11px;
              font-weight: 700;
              padding: 3px 8px;
              border-radius: 6px;
              margin-bottom: 16px;
            }
            .qr-wrapper {
              background: #f8fafc;
              border: 2px dashed #cbd5e1;
              border-radius: 12px;
              padding: 16px;
              display: inline-block;
              margin-bottom: 12px;
            }
            .site-code {
              font-family: monospace;
              font-size: 20px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: 1px;
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              padding: 4px 12px;
              border-radius: 8px;
              display: inline-block;
              margin-bottom: 8px;
            }
            .site-location {
              font-size: 12px;
              color: #475569;
              line-height: 1.4;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .footer-note {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #64748b;
              font-weight: 700;
              border-top: 1px solid #e2e8f0;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="label-header">Big Tree Outdoor - Lighting Inspection</div>
            <div class="label-title">FIELD INSPECTION QR LABEL</div>
            <div class="zone-badge">ZONE ${zone.zoneNo}: ${zone.description}</div>
            
            <div class="qr-wrapper">
              ${document.getElementById('site-qr-code-svg')?.outerHTML || ''}
            </div>
            
            <div>
              <div class="site-code">${site.siteCode}</div>
              <div class="site-location">${site.name}</div>
            </div>
            
            <div class="footer-note">Scan to update site status on mobile</div>
          </div>
          <script>
            setTimeout(() => { window.print(); }, 400);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPng = () => {
    const svgElement = document.getElementById('site-qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 25, 25, 250, 250);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Label_${site.siteCode.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                Site Inspection QR Label
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Zone {zone.zoneNo} • {zone.region}
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

        {/* QR Card Content */}
        <div className="p-5 flex flex-col items-center text-center space-y-4 bg-slate-50/50" ref={printRef}>
          {/* Label Card */}
          <div className="w-full bg-white border-2 border-slate-800 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> BIG TREE LIGHTING
              </span>
              <span>ZONE {zone.zoneNo}</span>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner relative group">
              <QRCodeSVG
                id="site-qr-code-svg"
                value={targetUrl}
                size={180}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>

            {/* Site Details */}
            <div className="space-y-1">
              <div className="inline-block bg-emerald-50 text-emerald-900 border border-emerald-300 font-mono text-base font-extrabold px-3 py-1 rounded-lg">
                {site.siteCode}
              </div>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2 px-2 leading-snug">
                {site.name}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {site.fixtureType}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold border ${
                  site.status.toLowerCase() === 'lighted'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {site.status}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Scan label in field to open mobile inspection view
            </div>
          </div>

          {/* Target URL Preview */}
          <div className="w-full bg-slate-100 rounded-xl p-2.5 border border-slate-200 text-left">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1">
              Direct QR Link (URL):
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-slate-700 truncate flex-1 select-all bg-white px-2 py-1 rounded border border-slate-200">
                {targetUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="shrink-0 text-xs font-bold px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 grid grid-cols-2 gap-2">
          <button
            onClick={handlePrintLabel}
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Print Sticker Label
          </button>

          <button
            onClick={handleDownloadPng}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>

          {onOpenSiteStatus && (
            <button
              onClick={() => {
                onClose();
                onOpenSiteStatus(zone, site);
              }}
              className="col-span-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              Open Mobile Status View (Test Scan)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

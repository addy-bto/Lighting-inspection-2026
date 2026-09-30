import React, { useState } from 'react';
import {
  ShieldCheck,
  LogIn,
  AlertCircle,
  Database,
  CheckCircle2,
  Users,
  Lock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';

export const LoginScreen: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error('Login error:', err);
      const message =
        err instanceof Error ? err.message : 'Gagal log masuk. Sila cuba semula.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-8 text-slate-100 selection:bg-amber-400 selection:text-slate-950 overflow-hidden">
      {/* Full-Screen Gantry Billboard Background Wallpaper */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/gantry_billboard_bg_1790743984781.jpg"
          alt="Big Tree Outdoor Night Gantry Billboard Wallpaper"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-[#02180f]/60 to-slate-950/85 backdrop-blur-[1.5px]" />
      </div>

      {/* Top Corporate Bar */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between border-b border-emerald-500/30 pb-4 bg-slate-950/40 backdrop-blur-md px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <a
            href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#032014] border-2 border-emerald-400/80 hover:border-amber-400 p-0.5 shadow-lg overflow-hidden flex items-center justify-center transition"
            title="Visit Big Tree Outdoor Sdn Bhd Official Website"
          >
            <img
              src="/src/assets/images/bigtree_outdoor_logo_1785723315856.jpg"
              alt="Big Tree Outdoor Sdn Bhd"
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </a>
          <div>
            <a
              href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvzPf54pWXAxUPIoMDHVXcABUYACICCAEQABoCc2Y&co=1&ase=2&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&cid=CAASuwHkaN2IFU7EMVn2wsrMe1hHzZZn2ud93ngh_LA3EouHZw-SZ6dOIqSdn8Q1tAeNpm8pEpeuwFPJQvKAb5yNhE_cWFSfSUW0zjrTuQJgK7XkSeqrc2gVsHYtTbZy3QM5Vs5QOdZuSBQtYKVnpf9XMAKionXu_Vg84EWtrYkI_nFTJ5_OJTrnYF-13U5ovarXhjGAYYOQLGs7pQVKwH97cZWUccHuxVD-XkC6B_gf-IIngx5_h9Xy3meUXAql&cce=2&category=acrcp_v1_32&sig=AOD64_2gIKDDs7JSnrQEuwaagD-sHcA0XA&q&nis=4&adurl=https://www.bigtree.com.my/?utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3Dbto_always_on_23%26utm_term%3Dlink_click%26gad_source%3D1%26gad_campaignid%3D22385053127%26gbraid%3D0AAAAAo9J6kXfXGpsVtZTNxI22faX_oKJ4%26gclid%3DCj0KCQjw5vLVBhCiARIsAD56SFLW_0idsk7Klax_poe_-TO2oyK27jHYjJnn8f2OtSua8r8mF3zk_g0aAsHAEALw_wcB&ved=2ahUKEwjS1fH54pWXAxUoXWwGHTb9Ga8Q0Qx6BAgaEAE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono uppercase tracking-widest text-amber-300 hover:text-amber-200 font-extrabold block transition"
            >
              BIG TREE OUTDOOR SDN BHD
            </a>
            <span className="text-sm font-black text-white tracking-tight">
              Staff Cloud Portal & Lighting Inspection System
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-950/80 border border-emerald-600/40 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-semibold">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>Firebase Cloud Firestore Connected</span>
        </div>
      </div>

      {/* Main Sign-In Content */}
      <div className="relative z-10 max-w-5xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: System Overview for Staff */}
        <div className="lg:col-span-7 space-y-6 bg-slate-950/55 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Authorized Staff & Inspector Access
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Lighting Inspection{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
              2026
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-xl">
            Centralized advertising display lighting inspection management system. Please record
            advertising display lighting inspections on the{' '}
            <strong className="text-white">2nd Week & 4th Week</strong>,{' '}
            <strong className="text-amber-300">fault status</strong>, and{' '}
            <strong className="text-emerald-300">photo evidence</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#032014]/90 border border-emerald-700/50 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs mb-1">
                <MapPin className="w-4 h-4" />
                <span>31 ZONES & 278 SITES</span>
              </div>
              <p className="text-xs text-emerald-200/70">
                Liputan penuh KL, Lebuhraya Utama, PJ, Subang & Luar Bandar.
              </p>
            </div>

            <div className="bg-[#032014]/90 border border-emerald-700/50 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs mb-1">
                <Database className="w-4 h-4" />
                <span>REAL-TIME FIREBASE</span>
              </div>
              <p className="text-xs text-emerald-200/70">
                Auto-simpan setiap kemaskini senarai semak & gambar pemeriksaan staf.
              </p>
            </div>

            <div className="bg-[#032014]/90 border border-emerald-700/50 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-teal-300 font-extrabold text-xs mb-1">
                <Users className="w-4 h-4" />
                <span>MULTI-STAFF SYNC</span>
              </div>
              <p className="text-xs text-emerald-200/70">
                Akses serentak untuk Admin & Pasukan Juruaudit Lapangan.
              </p>
            </div>
          </div>

          {/* Active Inspector Roster Preview */}
          <div className="bg-[#02180f]/90 border border-emerald-800/60 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Pasukan Pemeriksa Lapangan Berdaftar</span>
              <span className="text-[11px] font-mono text-amber-300">Minggu 2 & Minggu 4</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Nusir', 'Yana', 'Fadrul', 'Asyaqif', 'Ray'].map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-700/60 text-xs font-bold text-emerald-100"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {name}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-xs font-bold text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Admin / Penyelia
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Staff Sign-In Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#032014]/95 border-2 border-emerald-500/40 p-7 sm:p-8 rounded-2xl shadow-2xl space-y-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 border border-emerald-400/50 flex items-center justify-center shrink-0 shadow-inner">
                <Lock className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                  STAFF AUTHENTICATION
                </span>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Sign In Akses Staf
                </h2>
                <p className="text-xs text-emerald-200/80">
                  Log masuk menggunakan akaun Google rasmi staf anda
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/60 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-300 mb-0.5">Ralat Pengesahan Log Masuk</p>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2 border-t border-emerald-800/60">
              <button
                id="google-login-btn"
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 disabled:opacity-60 text-slate-950 font-black py-3.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-amber-950/40 text-sm"
              >
                <LogIn className="w-5 h-5 text-slate-950" />
                <span>{loading ? 'Sedang Mengesahkan Akaun Staf...' : 'Sign In dengan Akaun Google Staf'}</span>
              </button>

              <div className="bg-[#02150d] border border-emerald-800/60 rounded-xl p-3.5 text-xs text-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Perlindungan Pangkalan Data Firebase</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-200/70">
                  Selepas Sign In, profil staf anda akan disegerakkan secara automatik dan semua
                  perubahan data akan disimpan terus ke dalam pangkalan data awan Firebase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 max-w-6xl w-full mx-auto border-t border-emerald-500/30 pt-4 px-4 py-2.5 bg-slate-950/45 backdrop-blur-md rounded-xl flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/90 gap-2">
        <span>© Big Tree Outdoor Sdn Bhd • Infrastructure & Lighting Inspection Division</span>
        <span className="font-mono text-[11px] text-amber-300/90">
          Firebase Auth & Cloud Firestore Enterprise Security
        </span>
      </div>
    </div>
  );
};

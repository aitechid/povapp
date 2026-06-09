import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative antialiased selection:bg-[#38bdf8] selection:text-[#070d19] bg-[#070d19] text-[#f1f5f9] font-sans overflow-x-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_80%)] pointer-events-none filter blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(96,165,250,0.05)_0%,transparent_80%)] pointer-events-none filter blur-[100px]" />
      <div 
        className="absolute inset-0 opacity-100 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#070d19]/75 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Shield Emblem */}
            <div className="w-10 h-10 border border-white/10 bg-white/[0.02] rounded flex items-center justify-center shadow-inner">
              <svg className="w-5.5 h-5.5 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="font-title font-bold text-base tracking-tight text-white leading-none block">AitechID</span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5 block">Poverty Analytics Platform</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Modul Sistem</a>
            <a href="#metrics" className="hover:text-white transition-colors">Dashboard Telemetri</a>
            <a href="#governance" className="hover:text-white transition-colors">Integrasi Data</a>
            <Link href="/sebaran" className="hover:text-white transition-colors">Sebaran</Link>
          </nav>

          <div>
            <Link href="/login" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all">
              <span>Masuk Console</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Introduction */}
      <main className="flex-grow pt-20">
        <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#38bdf8]/5 border border-[#38bdf8]/15 text-[#38bdf8] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
              KONSOL PEMETAAN DATA NASIONAL v2.6
            </div>
            
            <h1 className="font-title font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight">
              Sistem Informasi Intelijen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                Penanggulangan Kemiskinan
              </span>
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Konsol data analitik terpadu untuk percepatan penghapusan kemiskinan ekstrem melalui integrasi dataset spasial (GIS), analisis demografis kewilayahan, serta evaluasi jangkauan program bantuan sosial secara real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link href="/login" className="bg-[#0f2c59] hover:bg-[#163c75] border border-white/5 text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all text-center shadow-lg">
                Akses Analyst Console
              </Link>
              <a href="#features" className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] text-slate-300 hover:text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all text-center">
                Panduan Teknis
              </a>
            </div>
          </div>
          
          {/* Premium Dashboard Preview Mockup */}
          <div className="lg:col-span-6">
            <div className="relative bg-[#0b132b] border border-white/6 rounded p-3 shadow-2xl flex flex-col gap-3">
              {/* Window Header bar */}
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">AitechID Console Dashboard Preview</span>
                <div className="w-10"></div>
              </div>
              
              {/* Mockup Content */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#070d19]/40 border border-white/5 p-3 rounded">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Kemiskinan Makro</span>
                  <span className="text-base font-title font-bold text-white mt-1 block">9.03%</span>
                  <span className="text-[8px] text-emerald-400 font-semibold block mt-0.5">-0.33% YoY</span>
                </div>
                <div className="bg-[#070d19]/40 border border-white/5 p-3 rounded">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Garis Kemiskinan</span>
                  <span className="text-base font-title font-bold text-white mt-1 block">Rp 550K</span>
                  <span className="text-[8px] text-slate-500 block mt-0.5">Nasional</span>
                </div>
                <div className="bg-[#070d19]/40 border border-white/5 p-3 rounded">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Fokus Prioritas</span>
                  <span className="text-base font-title font-bold text-white mt-1 block">122 Kab</span>
                  <span className="text-[8px] text-amber-500 font-semibold block mt-0.5">Prioritas 1</span>
                </div>
              </div>
              
              {/* Mockup Map Visual */}
              <div className="h-48 bg-[#070d19]/50 border border-white/5 rounded relative overflow-hidden flex items-center justify-center">
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                  }}
                />
                
                {/* Sleek SVG Outline Map representation */}
                <svg className="w-3/4 h-3/4 text-white/[0.04]" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 25 C15 30 25 10 40 22 C55 34 65 15 80 25 M20 15 L35 25 L50 20 L65 30 L85 10" />
                </svg>
                
                {/* Nodes */}
                <span className="absolute top-1/2 left-[30%] w-2 h-2 bg-[#38bdf8] rounded-full ring-4 ring-[#38bdf8]/20"></span>
                <span className="absolute top-[40%] left-[55%] w-2 h-2 bg-amber-500 rounded-full ring-4 ring-amber-500/20 animate-pulse"></span>
                <span className="absolute top-[30%] left-[75%] w-2 h-2 bg-[#ef4444] rounded-full ring-4 ring-[#ef4444]/20"></span>
                
                {/* Scale tooltip inside mockup */}
                <div className="absolute bottom-2 left-2 bg-[#070d19]/90 border border-white/10 px-2 py-1 rounded text-[8px] space-y-0.5 text-slate-400">
                  <span className="font-bold text-white block">Persentase Spasial</span>
                  <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span> Critical (&gt;18%)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Telemetry */}
        <section id="metrics" className="border-t border-white/5 bg-[#0b132b]/40 py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="border-l border-white/10 pl-6 space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total Penduduk Miskin</span>
                <span className="font-title font-extrabold text-2xl sm:text-3xl text-white block">25.22 Juta</span>
                <span className="text-xs text-slate-400 leading-none">Rilis Resmi SUSENAS Maret</span>
              </div>
              <div className="border-l border-white/10 pl-6 space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Tingkat Kemiskinan Nasional</span>
                <span className="font-title font-extrabold text-2xl sm:text-3xl text-white block">9.03%</span>
                <span className="text-xs text-emerald-400 leading-none">Mengalami penurunan YoY</span>
              </div>
              <div className="border-l border-white/10 pl-6 space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Garis Kemiskinan BPS</span>
                <span className="font-title font-extrabold text-2xl sm:text-3xl text-white block">Rp 550.458</span>
                <span className="text-xs text-slate-400 leading-none">Per Bulan per Kapita</span>
              </div>
              <div className="border-l border-white/10 pl-6 space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Kab/Kota Fokus Prioritas</span>
                <span className="font-title font-extrabold text-2xl sm:text-3xl text-white block">122 Wilayah</span>
                <span className="text-xs text-amber-500 leading-none">Intervensi Kemiskinan Ekstrem</span>
              </div>
            </div>
          </div>
        </section>

        {/* System Modules / Bento Grid */}
        <section id="features" className="max-w-7xl mx-auto px-8 py-20 lg:py-28 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-widest block">SPESIFIKASI KONSOL</span>
              <h2 className="font-title font-bold text-2xl sm:text-3xl text-white">Modul Integrasi & Kemampuan Analitik</h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md">Arsitektur terpusat yang didesain formal untuk menyajikan data secara detail, akurat, dan dapat diekspor langsung dalam laporan negara.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="border border-white/6 hover:border-[#38bdf8]/35 hover:bg-white/[0.02] transition-all duration-300 p-8 bg-[#0b132b]/30 rounded flex flex-col gap-4">
              <span className="material-symbols-outlined text-[#38bdf8] text-3xl">map</span>
              <h3 className="font-title font-bold text-base text-white">Choropleth Spasial (GIS)</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Visualisasi spasial yang mendalam untuk melihat persebaran rasio kemiskinan pada tingkat Nasional, Provinsi, hingga Kabupaten/Kota.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="border border-white/6 hover:border-[#38bdf8]/35 hover:bg-white/[0.02] transition-all duration-300 p-8 bg-[#0b132b]/30 rounded flex flex-col gap-4">
              <span className="material-symbols-outlined text-[#38bdf8] text-3xl">analytics</span>
              <h3 className="font-title font-bold text-base text-white">Saringan Demografis Makro</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Analisis statistik korelasi tingkat kesejahteraan berdasarkan kategori tingkat pendidikan, status pekerjaan, kelompok umur, dan status kepemilikan aset.</p>
            </div>

            {/* Feature 3 */}
            <div className="border border-white/6 hover:border-[#38bdf8]/35 hover:bg-white/[0.02] transition-all duration-300 p-8 bg-[#0b132b]/30 rounded flex flex-col gap-4">
              <span className="material-symbols-outlined text-[#38bdf8] text-3xl">database</span>
              <h3 className="font-title font-bold text-base text-white">Katalog Metadata Terstruktur</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Katalog dataset terpadu yang memuat kamus data, kueri tersimpan, rekam jejak metadata, audit kelayakan, serta lisensi kementerian terkait.</p>
            </div>
          </div>
        </section>

        {/* Governance Section */}
        <section id="governance" className="border-t border-white/5 bg-[#0b132b]/20 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-widest block">INTEGRASI DATA SATU PINTU</span>
              <h2 className="font-title font-bold text-2xl sm:text-3xl text-white">Arsitektur Tata Kelola Data Negara</h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Menyelaraskan data kementerian dan lembaga terkait secara digital melalui mekanisme validasi skema otomatis, standarisasi Satu Data Indonesia (SDI), audit audit trail, serta perlindungan data pribadi UU PDP secara berlapis.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="material-symbols-outlined text-[#38bdf8] text-base">verified_user</span>
                  <span>Validasi Skema Otomatis (XLS / CSV / ZIP)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="material-symbols-outlined text-[#38bdf8] text-base">shield_with_heart</span>
                  <span>Enkripsi Penyimpanan Berlapis AES-256</span>
                </div>
              </div>
            </div>
            
            {/* Architecture Diagram Visual Mockup */}
            <div className="border border-white/6 p-6 bg-[#0b132b]/40 rounded flex flex-col gap-4">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-2">Arsitektur Aliran Data</span>
              <div className="flex justify-between items-center text-[10px] py-4 text-center font-semibold">
                <div className="w-1/4 bg-[#070d19] border border-white/10 py-3 rounded">
                  <span className="text-white block">Dataset Survei</span>
                  <span className="text-[8px] text-slate-500 block mt-1">BPS / K/L</span>
                </div>
                <span className="material-symbols-outlined text-[#38bdf8] text-sm">trending_flat</span>
                <div className="w-1/4 bg-[#070d19] border border-white/10 py-3 rounded">
                  <span className="text-white block">AitechID ETL</span>
                  <span className="text-[8px] text-emerald-400 block mt-1">Validasi Skema</span>
                </div>
                <span className="material-symbols-outlined text-[#38bdf8] text-sm">trending_flat</span>
                <div className="w-1/4 bg-[#0f2c59] border border-[#38bdf8]/20 py-3 rounded">
                  <span className="text-white block">Analyst Console</span>
                  <span className="text-[8px] text-[#38bdf8] block mt-1">Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#040810] py-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold tracking-tight">AITECHID</span>
            <span>|</span>
            <p>Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-300">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

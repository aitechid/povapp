"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const SebaranMap = dynamic(() => import("@/components/SebaranMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/10 text-slate-400 font-semibold">
      Loading Spatial Map Engine...
    </div>
  ),
});

interface ProvinceRow {
  name: string;
  coords: [number, number];
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  d5: number;
  d6: number;
  d7: number;
}

interface DecilesSummary {
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  d5: number;
  d6: number;
  d7: number;
}

export default function SebaranPage() {
  const [filterDesil, setFilterDesil] = useState("All");
  const [activeCoords, setActiveCoords] = useState<[number, number]>([-2.5, 118.0]);
  const [activeZoom, setActiveZoom] = useState(5);

  // Filter States
  const [gender, setGender] = useState("All");
  const [water, setWater] = useState("All");
  const [wall, setWall] = useState("All");
  const [cooking, setCooking] = useState("All");
  const [lighting, setLighting] = useState("All");
  const [floor, setFloor] = useState("All");

  const [provincesData, setProvincesData] = useState<ProvinceRow[]>([]);
  const [decilesSummary, setDecilesSummary] = useState<DecilesSummary>({
    d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0
  });
  const [loading, setLoading] = useState(true);

  const loadSebaranData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        gender,
        water,
        wall,
        cooking,
        lighting,
        floor
      });
      const res = await fetch(`/api/sebaran?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProvincesData(data.provinces || []);
        setDecilesSummary(data.deciles || {
          d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch sebaran data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSebaranData();
  }, [gender, water, wall, cooking, lighting, floor]);

  const formatNumber = (num: number) => {
    return (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleProvinceClick = (coords: [number, number]) => {
    setActiveCoords(coords);
    setActiveZoom(7);
  };

  return (
    <div className="min-h-screen flex flex-col relative antialiased bg-[#070d19] text-[#f1f5f9] font-sans selection:bg-[#38bdf8] selection:text-[#070d19]">
      
      {/* Navigation Header */}
      <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#070d19]/85 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-white/10 bg-white/[0.02] rounded flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="font-title font-bold text-sm tracking-tight text-white leading-none block">AitechID Console</span>
              <span className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">Public Access Mode</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workstation Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 space-y-4">
        
        {/* 1. GENERAL OVERVIEW (DECIL STATS) */}
        <div className="bg-[#0b132b] border border-white/6 rounded overflow-hidden flex flex-col md:flex-row shadow-lg">
          <div className="bg-[#0f2c59] text-white px-6 py-4 flex flex-col justify-center min-w-[160px] text-center md:text-left border-b md:border-b-0 md:border-r border-white/5">
            <span className="text-[9px] font-bold tracking-widest uppercase text-sky-400">Analisis Agregat</span>
            <h2 className="font-title font-bold text-xs uppercase tracking-wider text-white mt-0.5">Gambaran Umum</h2>
          </div>
          
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-y sm:divide-y-0 divide-white/5 text-center">
            <div className="p-3">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Desil 1</span>
              <span className="font-title font-bold text-sm text-rose-400 mt-1 block">
                {loading ? "..." : formatNumber(decilesSummary.d1)}
              </span>
            </div>
            <div className="p-3">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Desil 2</span>
              <span className="font-title font-bold text-sm text-rose-400 mt-1 block">
                {loading ? "..." : formatNumber(decilesSummary.d2)}
              </span>
            </div>
            <div className="p-3">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Desil 3</span>
              <span className="font-title font-bold text-sm text-rose-400 mt-1 block">
                {loading ? "..." : formatNumber(decilesSummary.d3)}
              </span>
            </div>
            <div className="p-3">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Desil 4</span>
              <span className="font-title font-bold text-sm text-rose-400 mt-1 block">
                {loading ? "..." : formatNumber(decilesSummary.d4)}
              </span>
            </div>
            <div className="p-3">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Desil 5</span>
              <span className="font-title font-bold text-sm text-rose-400 mt-1 block">
                {loading ? "..." : formatNumber(decilesSummary.d5)}
              </span>
            </div>
            <div className="p-3">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Desil 6</span>
              <span className="font-title font-bold text-sm text-rose-400 mt-1 block">
                {loading ? "..." : formatNumber(decilesSummary.d6)}
              </span>
            </div>
            <div className="p-3">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase block">Desil 7</span>
              <span className="font-title font-bold text-sm text-rose-400 mt-1 block">
                {loading ? "..." : formatNumber(decilesSummary.d7)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. VARIABLE SELECTION FILTER PANEL */}
        <div className="bg-[#0b132b] border border-white/6 rounded overflow-hidden flex flex-col md:flex-row shadow-lg">
          <div className="bg-[#0f2c59] text-white px-6 py-4 flex flex-col justify-center min-w-[160px] text-center md:text-left border-b md:border-b-0 md:border-r border-white/5">
            <span className="text-[9px] font-bold tracking-widest uppercase text-sky-400">Penyaring Data</span>
            <h2 className="font-title font-bold text-xs uppercase tracking-wider text-white mt-0.5">Pilihan Variabel</h2>
          </div>
          
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-[10px]">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Pilih Desil</label>
                <select 
                  className="w-full bg-[#070d19] border border-white/10 rounded px-2 py-1 text-slate-300 focus:border-[#38bdf8] focus:outline-none" 
                  value={filterDesil}
                  onChange={(e) => setFilterDesil(e.target.value)}
                >
                  <option value="All">(All)</option>
                  <option value="Desil 1">Desil 1</option>
                  <option value="Desil 2">Desil 2</option>
                  <option value="Desil 3">Desil 3</option>
                  <option value="Desil 4">Desil 4</option>
                  <option value="Desil 5">Desil 5</option>
                  <option value="Desil 6">Desil 6</option>
                  <option value="Desil 7">Desil 7</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Jenis Kelamin KK</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#070d19] border border-white/10 rounded px-2 py-1 text-slate-300 focus:border-[#38bdf8] focus:outline-none"
                >
                  <option value="All">(All)</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Sumber Air Minum</label>
                <select 
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-full bg-[#070d19] border border-white/10 rounded px-2 py-1 text-slate-300 focus:border-[#38bdf8] focus:outline-none"
                >
                  <option value="All">(All)</option>
                  <option value="Air Kemasan/Isi Ulang">Air Kemasan/Isi Ulang</option>
                  <option value="Leding/PAM">Leding/PAM</option>
                  <option value="Sumur Bor/Terlindungi">Sumur Bor/Terlindungi</option>
                  <option value="Sumur Tak Terlindungi/Mata Air">Sumur Tak Terlindungi/Mata Air</option>
                  <option value="Sungai/Air Hujan">Sungai/Air Hujan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Jenis Dinding</label>
                <select 
                  value={wall}
                  onChange={(e) => setWall(e.target.value)}
                  className="w-full bg-[#070d19] border border-white/10 rounded px-2 py-1 text-slate-300 focus:border-[#38bdf8] focus:outline-none"
                >
                  <option value="All">(All)</option>
                  <option value="Tembok/Batu">Tembok/Batu</option>
                  <option value="Kayu/Papan">Kayu/Papan</option>
                  <option value="Bambu/Seng">Bambu/Seng</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Bahan Bakar Memasak</label>
                <select 
                  value={cooking}
                  onChange={(e) => setCooking(e.target.value)}
                  className="w-full bg-[#070d19] border border-white/10 rounded px-2 py-1 text-slate-300 focus:border-[#38bdf8] focus:outline-none"
                >
                  <option value="All">(All)</option>
                  <option value="Gas LPG 3kg">Gas LPG 3kg</option>
                  <option value="Gas LPG &gt;3kg">Gas LPG &gt;3kg</option>
                  <option value="Minyak Tanah/Kayu Bakar">Minyak Tanah/Kayu Bakar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Sumber Penerangan</label>
                <select 
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full bg-[#070d19] border border-white/10 rounded px-2 py-1 text-slate-300 focus:border-[#38bdf8] focus:outline-none"
                >
                  <option value="All">(All)</option>
                  <option value="Listrik PLN">Listrik PLN</option>
                  <option value="Listrik non-PLN">Listrik non-PLN</option>
                  <option value="Bukan Listrik">Bukan Listrik</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Jenis Lantai</label>
                <select 
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full bg-[#070d19] border border-white/10 rounded px-2 py-1 text-slate-300 focus:border-[#38bdf8] focus:outline-none"
                >
                  <option value="All">(All)</option>
                  <option value="Ubin/Keramik">Ubin/Keramik</option>
                  <option value="Semen/Plester">Semen/Plester</option>
                  <option value="Kayu/Papan">Kayu/Papan</option>
                  <option value="Tanah/Lainnya">Tanah/Lainnya</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. GEOGRAPHIC WORKSPACE (MAP & LIST) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left List (Pilih Wilayah) */}
          <div className="lg:col-span-3 bg-[#0b132b] border border-white/6 rounded p-4 flex flex-col h-[480px]">
            <h3 className="font-title font-bold text-xs text-[#38bdf8] uppercase tracking-widest border-b border-white/5 pb-2">Pilih Wilayah</h3>
            <p className="text-[10px] text-slate-400 mt-1 mb-3">Klik wilayah yang ingin ditampilkan</p>
            
            <div className="flex-grow overflow-y-auto scroll-dark text-xs space-y-1 font-semibold text-slate-400">
              {loading ? (
                <div className="p-4 text-center text-slate-500">Memproses kueri...</div>
              ) : (
                provincesData.map((prov, idx) => {
                  const displayVal = filterDesil === "All"
                    ? (prov.d1 + prov.d2 + prov.d3 + prov.d4 + prov.d5 + prov.d6 + prov.d7)
                    : (prov as any)[`d${filterDesil.split(" ")[1]}`];

                  return (
                    <button
                      key={idx}
                      className="w-full text-left px-3 py-2 rounded hover:bg-white/[0.03] hover:text-white transition-colors flex justify-between items-center"
                      onClick={() => handleProvinceClick(prov.coords)}
                    >
                      <span>{prov.name}</span>
                      <span className="text-[10px] text-sky-400 font-mono">{formatNumber(displayVal)}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Right Map View */}
          <div className="lg:col-span-9 bg-[#0b132b] border border-white/6 rounded h-[480px] relative overflow-hidden flex items-center justify-center">
            {loading ? (
              <div className="text-slate-500 animate-pulse text-sm font-semibold">Mengambil koordinat spasial...</div>
            ) : (
              <SebaranMap
                provincesData={provincesData}
                filterDesil={filterDesil}
                activeCoords={activeCoords}
                activeZoom={activeZoom}
              />
            )}
            
            {/* Legend Overlay inside Map */}
            <div className="absolute bottom-4 right-4 bg-[#0b132b]/90 border border-white/6 p-3 rounded text-[10px] space-y-2 z-[1000] min-w-[140px] shadow-2xl">
              <span className="font-bold text-white uppercase block">Keterangan (Deciles)</span>
              <div className="space-y-1">
                <div className="flex items-center justify-between"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span><span>Critical (&gt;18%)</span></div>
                <div className="flex items-center justify-between"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span><span>High (12% - 18%)</span></div>
                <div className="flex items-center justify-between"><span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></span><span>Moderate (7% - 12%)</span></div>
                <div className="flex items-center justify-between"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span><span>Low (&lt;7%)</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. COMPARATIVE DATA GRID */}
        <div className="bg-[#0b132b] border border-white/6 rounded overflow-hidden shadow-lg">
          <div className="p-4 border-b border-white/5 bg-[#0c213d]/30 flex justify-between items-center">
            <h4 className="font-title font-bold text-xs uppercase tracking-widest text-white">Tabel Rincian Sebaran Berdasarkan Desil Kesejahteraan</h4>
          </div>
          <div className="overflow-x-auto scroll-dark max-h-[300px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#0b132b] border-b border-white/10 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest">Provinsi</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-right">Desil 1</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-right">Desil 2</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-right">Desil 3</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-right">Desil 4</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-right">Desil 5</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-right">Desil 6</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-right">Desil 7</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-slate-500">Mengkalkulasi tabel data...</td>
                  </tr>
                ) : (
                  provincesData.map((prov, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-bold text-white">{prov.name}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(prov.d1)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(prov.d2)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(prov.d3)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(prov.d4)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(prov.d5)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(prov.d6)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(prov.d7)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#040810] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold tracking-tight">AITECHID</span>
            <span>|</span>
            <p>Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

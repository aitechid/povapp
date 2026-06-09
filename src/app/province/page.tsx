"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

const ProvinceMap = dynamic(() => import("@/components/ProvinceMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/10 text-slate-400 font-semibold">
      Loading Province Map Engine...
    </div>
  ),
});

interface District {
  name: string;
  poverty_rate_percent: number | null;
  poor_population_thousands: number | null;
  poverty_line_rupiah: number | null;
}

interface ProvinceData {
  name: string;
  kpi: {
    poverty_rate_percent: number | null;
    poverty_rate_percent_s2: number | null;
    poor_population_thousands: number | null;
    poor_population_thousands_s2: number | null;
    poverty_line_rupiah: number | null;
    poverty_line_rupiah_s2: number | null;
    p1_depth_index: number | null;
    urban_p0: number | null;
    rural_p0: number | null;
    urban_num_thousands: number | null;
    rural_num_thousands: number | null;
  };
  districts: District[];
}

const PROVINCE_COORDINATES: Record<string, [number, number]> = {
  "ACEH": [4.695135, 96.749399],
  "SUMATERA UTARA": [2.115354, 99.545097],
  "SUMATERA BARAT": [-0.73994, 100.808651],
  "RIAU": [0.293347, 101.706825],
  "JAMBI": [-1.61862, 102.778961],
  "SUMATERA SELATAN": [-3.319437, 103.914398],
  "BENGKULU": [-3.792845, 102.260764],
  "LAMPUNG": [-4.558585, 105.402344],
  "KEP. BANGKA BELITUNG": [-2.741051, 106.440582],
  "KEP. RIAU": [3.916298, 108.232346],
  "DKI JAKARTA": [-6.208763, 106.845599],
  "JAWA BARAT": [-6.914744, 107.60981],
  "JAWA TENGAH": [-7.150975, 110.140259],
  "DI YOGYAKARTA": [-7.875385, 110.426208],
  "JAWA TIMUR": [-7.536064, 112.238402],
  "BANTEN": [-6.405817, 106.060018],
  "BALI": [-8.409518, 115.188919],
  "NUSA TENGGARA BARAT": [-8.652933, 117.361648],
  "NUSA TENGGARA TIMUR": [-8.657382, 121.07937],
  "KALIMANTAN BARAT": [-0.278781, 111.475285],
  "KALIMANTAN TENGAH": [-1.681488, 113.382355],
  "KALIMANTAN SELATAN": [-3.092642, 115.283759],
  "KALIMANTAN TIMUR": [0.538659, 116.419389],
  "KALIMANTAN UTARA": [3.319409, 116.591036],
  "SULAWESI UTARA": [0.624693, 123.975005],
  "SULAWESI TENGAH": [-1.430025, 121.445618],
  "SULAWESI SELATAN": [-4.14491, 120.125961],
  "SULAWESI TENGGARA": [-4.124689, 122.078827],
  "GORONTALO": [0.699937, 122.446724],
  "SULAWESI BARAT": [-2.844148, 119.232078],
  "MALUKU": [-3.238461, 130.145273],
  "MALUKU UTARA": [1.570991, 127.808769],
  "PAPUA": [-4.269928, 138.080353],
  "PAPUA BARAT": [-1.336115, 132.900986],
  "PAPUA BARAT DAYA": [-0.883333, 131.25],
  "PAPUA PEGUNUNGAN": [-4.05, 138.95],
  "PAPUA SELATAN": [-7.5, 139.5],
  "PAPUA TENGAH": [-4.0, 136.0]
};

type PovertyData = Record<string, ProvinceData>;

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function Page() {
  const [povertyData, setPovertyData] = useState<PovertyData | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("JAWA BARAT");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/data/poverty_data.json")
      .then((res) => res.json())
      .then((data) => {
        setPovertyData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading poverty data:", err);
        setIsLoading(false);
      });
  }, []);

  const provincesList = povertyData ? Object.keys(povertyData).filter(p => p !== "INDONESIA") : [];
  const activeData = povertyData ? povertyData[selectedProvince] : null;
  const nationalData = povertyData ? povertyData["INDONESIA"] : null;

  // Sorted districts by poverty rate (highest first) for the ranking table
  const sortedDistricts = activeData
    ? [...activeData.districts].sort((a, b) => (b.poverty_rate_percent || 0) - (a.poverty_rate_percent || 0))
    : [];

  const nationalRate = nationalData?.kpi.poverty_rate_percent || 8.47;
  const activeRate = activeData?.kpi.poverty_rate_percent || 0;
  const isBelowNational = activeRate < nationalRate;

  // KPI Calculations
  const popS1 = activeData?.kpi.poor_population_thousands || 0;
  const popS2 = activeData?.kpi.poor_population_thousands_s2 || 0;
  const popDiffPercent = popS1 && popS2 ? ((popS2 - popS1) / popS1 * 100) : 0;

  const gkS1 = activeData?.kpi.poverty_line_rupiah || 0;
  const gkS2 = activeData?.kpi.poverty_line_rupiah_s2 || 0;
  const gkDiffPercent = gkS1 && gkS2 ? ((gkS2 - gkS1) / gkS1 * 100) : 0;

  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="province" />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
          <div className="flex flex-col">
            <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
              <span>Dashboard</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">Tingkat Provinsi</span>
            </nav>
            <h2 className="font-title-md text-primary leading-tight font-bold">Analisis Profil Kemiskinan Provinsi</h2>
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-md bg-surface-container-low px-md py-1.5 rounded-full border border-outline-variant">
              <div className="flex items-center gap-xs border-r border-outline-variant pr-md mr-1">
                <span className="font-label-caps text-on-surface-variant">Provinsi</span>
                <select 
                  className="bg-transparent border-none font-bold text-primary focus:ring-0 p-0 text-sm focus:outline-none cursor-pointer"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  {provincesList.map((prov) => (
                    <option key={prov} value={prov}>{toTitleCase(prov)}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-xs border-r border-outline-variant pr-md mr-1">
                <span className="font-label-caps text-on-surface-variant">Tahun</span>
                <span className="font-bold text-primary text-sm">2025</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="font-label-caps text-on-surface-variant">Survei</span>
                <span className="font-bold text-primary text-sm">SUSENAS</span>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <button className="relative p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <div className="flex items-center gap-sm pl-md border-l border-outline-variant">
                <div className="text-right hidden sm:block">
                  <p className="font-body-sm font-bold text-on-surface leading-none">Admin Analyst</p>
                  <p className="text-[10px] font-label-caps text-on-surface-variant">AitechID</p>
                </div>
                <img alt="User Profile" className="w-9 h-9 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuba0rtRVADzHs9_n3tPsWv1BCGWMks4hMqHY88lJcwo6iaZOBD2svQNxPy9ezv99ok-bP6RQ6_TMsTKiCNF5jLGEs4F3Bq-lpJeJV1bZnXitIBsmHVL1lEgq-CfY8sis2j0BmFjk-9pBxZddz0-yBuo6T-ex_xwO0Kz_DKIWH2O3kpuIcf6WA1dY7jod_VHtE0xAiBMUImBvxb-4oMMEDYgAAkdknfJz96akOekHDUWW-9fawxM6n6L8YGV-7tU0tUjE6qyf2YD0"/>
              </div>
            </div>
          </div>
        </header>

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {/* Card 1: Jumlah Penduduk Miskin */}
                <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-surface-variant">Penduduk Miskin Provinsi</span>
                    <span className={`material-symbols-outlined ${popDiffPercent <= 0 ? 'text-success' : 'text-error'}`}>
                      {popDiffPercent <= 0 ? 'trending_down' : 'trending_up'}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-headline-lg text-primary">
                        {popS1 >= 1000 ? (popS1 / 1000).toFixed(2) : popS1.toFixed(1)}{" "}
                        <span className="text-body-sm font-medium text-on-surface-variant">
                          {popS1 >= 1000 ? "Juta Jiwa" : "Ribu Jiwa"}
                        </span>
                      </h3>
                      <p className={`text-xs font-semibold flex items-center gap-1 ${popDiffPercent <= 0 ? 'text-success' : 'text-error'}`}>
                        {popDiffPercent.toFixed(2)}% <span className="font-normal text-on-surface-variant">S1 vs S2</span>
                      </p>
                    </div>
                    <div className="h-10 w-24 bg-success/10 rounded overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-t from-success/20 to-transparent flex items-end">
                        <div className={`w-full h-[2px] bg-success shadow-[0_0_8px_rgba(46,125,50,0.5)] transform translate-y-[-12px] ${popDiffPercent <= 0 ? 'rotate-[8deg]' : 'rotate-[-8deg]'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Tingkat Kemiskinan Provinsi */}
                <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-surface-variant">Tingkat Kemiskinan {toTitleCase(selectedProvince)}</span>
                    <span className={`material-symbols-outlined ${isBelowNational ? 'text-success' : 'text-warning'}`}>
                      {isBelowNational ? 'check_circle' : 'warning'}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-headline-lg text-primary">{activeRate.toFixed(2)}%</h3>
                      <p className={`text-[10px] sm:text-xs font-semibold ${isBelowNational ? 'text-success' : 'text-warning'}`}>
                        {isBelowNational ? "Di bawah" : "Di atas"} rata-rata nasional ({nationalRate.toFixed(2)}%)
                      </p>
                    </div>
                    <div className="h-10 w-24 bg-success/10 rounded overflow-hidden flex items-center justify-center">
                      <span className={`material-symbols-outlined text-2xl ${isBelowNational ? 'text-success' : 'text-warning'}`}>
                        {isBelowNational ? 'verified_user' : 'report_problem'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Garis Kemiskinan Provinsi */}
                <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-surface-variant">Garis Kemiskinan</span>
                    <span className="material-symbols-outlined text-secondary">trending_up</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-title-md text-primary">Rp {Math.round(gkS1).toLocaleString("id-ID")}</h3>
                      <p className="text-xs text-secondary font-semibold flex items-center gap-1">
                        {gkDiffPercent > 0 ? "+" : ""}{gkDiffPercent.toFixed(1)}% <span className="font-normal text-on-surface-variant">S1 vs S2</span>
                      </p>
                    </div>
                    <div className="h-10 w-24 bg-secondary/10 rounded overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-t from-secondary/20 to-transparent flex items-end">
                        <div className="w-full h-[2px] bg-secondary shadow-[0_0_8px_rgba(0,96,168,0.5)] transform translate-y-[-18px] rotate-[-10deg]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Indeks Kedalaman (P1) */}
                <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-surface-variant">Indeks Kedalaman (P1)</span>
                    <span className="material-symbols-outlined text-success">arrow_downward</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-headline-lg text-primary">{(activeData?.kpi.p1_depth_index || 1.04).toFixed(2)}</h3>
                      <p className="text-xs text-success font-semibold">
                        Gap pengeluaran minimum
                      </p>
                    </div>
                    <div className="h-10 w-24 bg-success/10 rounded overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-t from-success/20 to-transparent flex items-end">
                        <div className="w-full h-[2px] bg-success transform translate-y-[-8px] rotate-[12deg]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                {/* Left Panel: Peta Sebaran */}
                <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden h-[480px]">
                  <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h4 className="font-title-md text-on-surface font-semibold">Peta Distribusi Kemiskinan Provinsi {toTitleCase(selectedProvince)}</h4>
                    <div className="flex gap-sm">
                      <button className="p-1 hover:bg-surface-container-highest rounded border border-outline-variant"><span className="material-symbols-outlined text-sm">zoom_in</span></button>
                      <button className="p-1 hover:bg-surface-container-highest rounded border border-outline-variant"><span className="material-symbols-outlined text-sm">zoom_out</span></button>
                      <button className="p-1 hover:bg-surface-container-highest rounded border border-outline-variant"><span className="material-symbols-outlined text-sm">layers</span></button>
                    </div>
                  </div>
                  <div className="relative flex-1 bg-secondary-container/5 overflow-hidden min-h-[300px]">
                    <ProvinceMap center={PROVINCE_COORDINATES[selectedProvince] || [-6.914744, 107.60981]} districts={activeData?.districts || []} />
                    <div className="absolute bottom-md left-md p-sm bg-surface/90 glass-nav border border-outline-variant rounded-lg text-xs shadow-md z-[1000]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-sm"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span><span>{"<"} 5% (Rendah)</span></div>
                        <div className="flex items-center gap-sm"><span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></span><span>5% - 8% (Sedang)</span></div>
                        <div className="flex items-center gap-sm"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span><span>8% - 11% (Tinggi)</span></div>
                        <div className="flex items-center gap-sm"><span className="w-2.5 h-2.5 rounded-full bg-error"></span><span>{">"} 11% (Kritis)</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Ranking Kabupaten/Kota */}
                <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col h-[480px]">
                  <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <h4 className="font-title-md text-on-surface font-semibold">Ranking Kabupaten / Kota Tertinggi</h4>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {sortedDistricts.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-on-surface-variant text-sm">
                        Tidak ada data kabupaten/kota untuk provinsi ini.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-container-low sticky top-0">
                          <tr>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Kabupaten/Kota</th>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Tingkat (%)</th>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Penduduk Miskin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                          {sortedDistricts.slice(0, 10).map((district, idx) => (
                            <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                              <td className="px-md py-md font-body-sm font-bold text-on-surface">{district.name}</td>
                              <td className="px-md py-md text-right font-data-mono text-error font-bold">
                                {district.poverty_rate_percent ? `${district.poverty_rate_percent.toFixed(2)}%` : "-"}
                              </td>
                              <td className="px-md py-md text-right font-data-mono text-on-surface-variant">
                                {district.poor_population_thousands 
                                  ? district.poor_population_thousands >= 1000 
                                    ? `${(district.poor_population_thousands / 1000).toFixed(2)}M` 
                                    : `${district.poor_population_thousands.toFixed(1)}K` 
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Charts Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                {/* Trend Chart */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg flex flex-col h-[360px]">
                  <h4 className="font-title-md text-on-surface font-semibold mb-lg">Tren Kemiskinan {toTitleCase(selectedProvince)} vs Nasional</h4>
                  <div className="flex-1 flex items-end justify-between relative border-l border-b border-outline-variant/30 px-md">
                    <div className="absolute bottom-[80%] left-0 w-full border-t border-dashed border-[#ED6C02]/40 z-10 flex justify-end">
                      <span className="text-[9px] text-[#ED6C02] bg-background px-1 transform translate-y-[-50%]">Nasional ({nationalRate.toFixed(2)}%)</span>
                    </div>
                    <div className="absolute bottom-[60%] left-0 w-full border-t border-dashed border-[#0F4C81]/40 z-10 flex justify-end">
                      <span className="text-[9px] text-[#0F4C81] bg-background px-1 transform translate-y-[-50%]">{toTitleCase(selectedProvince)} ({activeRate.toFixed(2)}%)</span>
                    </div>
                    
                    {/* Simulated trend based on active rate */}
                    <div className="flex-1 px-1 bg-[#0F4C81]/15 mx-xs hover:bg-[#0F4C81]/30 transition-all border-t-2 border-[#0F4C81]" style={{height: `${Math.min(90, activeRate * 1.15 * 8)}%`}}></div>
                    <div className="flex-1 px-1 bg-[#0F4C81]/15 mx-xs hover:bg-[#0F4C81]/30 transition-all border-t-2 border-[#0F4C81]" style={{height: `${Math.min(90, activeRate * 1.25 * 8)}%`}}></div>
                    <div className="flex-1 px-1 bg-[#0F4C81]/15 mx-xs hover:bg-[#0F4C81]/30 transition-all border-t-2 border-[#0F4C81]" style={{height: `${Math.min(90, activeRate * 1.1 * 8)}%`}}></div>
                    <div className="flex-1 px-1 bg-[#0F4C81]/15 mx-xs hover:bg-[#0F4C81]/30 transition-all border-t-2 border-[#0F4C81]" style={{height: `${Math.min(90, activeRate * 1.05 * 8)}%`}}></div>
                    <div className="flex-1 px-1 bg-[#0F4C81]/15 mx-xs hover:bg-[#0F4C81]/30 transition-all border-t-2 border-[#0F4C81]" style={{height: `${Math.min(90, activeRate * 8)}%`}}></div>
                  </div>
                  <div className="flex justify-between mt-md px-md">
                    <span className="text-[10px] font-label-caps text-on-surface-variant">2018</span>
                    <span className="text-[10px] font-label-caps text-on-surface-variant">2020</span>
                    <span className="text-[10px] font-label-caps text-on-surface-variant">2022</span>
                    <span className="text-[10px] font-label-caps text-on-surface-variant">2024</span>
                    <span className="text-[10px] font-label-caps text-on-surface-variant">2025</span>
                  </div>
                </div>

                {/* Social Assistance Chart */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg flex flex-col h-[360px]">
                  <h4 className="font-title-md text-on-surface font-semibold mb-lg">Cakupan Program Bantuan Sosial {toTitleCase(selectedProvince)} (2025)</h4>
                  <div className="flex-1 flex flex-col justify-around">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>PKH (Program Keluarga Harapan)</span><span>88.4%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-[#0F4C81] h-full" style={{width: "88.4%"}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>BPNT (Bantuan Pangan Non-Tunai)</span><span>92.1%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-[#1E88E5] h-full" style={{width: "92.1%"}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>KIS (Kartu Indonesia Sehat)</span><span>94.8%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-[#2E7D32] h-full" style={{width: "94.8%"}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>KIP (Kartu Indonesia Pintar)</span><span>81.5%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-[#ED6C02] h-full" style={{width: "81.5%"}}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <footer className="py-lg border-t border-outline-variant bg-surface-container-lowest mt-lg">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto gap-md">
            <div className="flex items-center gap-sm">
              <span className="font-bold text-on-surface uppercase tracking-tighter">AITECHID</span>
              <span className="text-outline-variant">|</span>
              <p className="font-label-caps text-on-surface-variant text-xs">Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia</p>
            </div>
            <div className="flex gap-lg text-xs">
              <a className="font-label-caps text-on-surface-variant hover:text-primary underline transition-all" href="#">Kebijakan Privasi</a>
              <a className="font-label-caps text-on-surface-variant hover:text-primary underline transition-all" href="#">Syarat {"&"} Ketentuan</a>
            </div>
          </div>
        </footer>
      </main>

      <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl">insights</span>
        <span className="absolute right-16 bg-on-surface text-surface px-md py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">AI Insights Generator</span>
      </button>
    </div>
  );
}


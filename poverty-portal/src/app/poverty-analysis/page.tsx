"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

interface ChartRow {
  category: string;
  senior: number;
  adult: number;
  youth: number;
}

export default function Page() {
  const [year, setYear] = useState("2026");
  const [region, setRegion] = useState("all");
  const [indicator, setIndicator] = useState("education");
  const [chartType, setChartType] = useState("bar");
  
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [title, setTitle] = useState("Tingkat Kemiskinan Berdasarkan Kelompok Umur & Pendidikan");
  const [unit, setUnit] = useState("Unit: % Penduduk Desil 1-4");
  const [seriesLabels, setSeriesLabels] = useState(["Umur > 55", "Umur 25-54", "Umur 15-24"]);
  const [loading, setLoading] = useState(true);

  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis?indicator=${indicator}&region=${region}&year=${year}`);
      const data = await res.json();
      if (data.success) {
        setChartData(data.data || []);
        setTitle(data.title);
        setUnit(`Unit: ${data.unit}`);
        setSeriesLabels(data.seriesLabels || []);
      }
    } catch (err) {
      console.error("Failed to load analysis data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const handleApplyFilters = () => {
    loadAnalysisData();
  };

  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="poverty-analysis" />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
          <div className="flex flex-col">
            <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
              <span>Analisis</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">Analisis Kemiskinan Terpadu</span>
            </nav>
            <h2 className="font-title-md text-primary leading-tight font-bold">Poverty Analytics Engine</h2>
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-md bg-surface-container-low px-md py-1.5 rounded-full border border-outline-variant">
              <span className="font-label-caps text-on-surface-variant text-[10px] font-bold">Analisis Spasial & Sektoral</span>
            </div>
          </div>
        </header>

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
            
            {/* Filter Panel */}
            <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm space-y-md h-fit">
              <h3 className="font-title-md text-primary font-bold">Filter Analisis</h3>
              
              <div className="space-y-sm">
                <label className="block text-xs font-bold font-label-caps text-on-surface-variant">Tahun Analisis</label>
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded p-sm text-sm"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="space-y-sm">
                <label className="block text-xs font-bold font-label-caps text-on-surface-variant">Wilayah</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded p-sm text-sm"
                >
                  <option value="all">Seluruh Indonesia (aitech.db)</option>
                  <option value="jabar">Provinsi Jawa Barat</option>
                  <option value="jateng">Provinsi Jawa Tengah</option>
                </select>
              </div>

              <div className="space-y-sm">
                <label className="block text-xs font-bold font-label-caps text-on-surface-variant">Indikator Utama</label>
                <select 
                  value={indicator}
                  onChange={(e) => setIndicator(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded p-sm text-sm"
                >
                  <option value="education">Pendidikan & Kelompok Umur</option>
                  <option value="assets">Kepemilikan Aset Rumah Tangga</option>
                  <option value="housing">Kelayakan Rumah Tinggal</option>
                </select>
              </div>

              <button 
                onClick={handleApplyFilters}
                className="w-full bg-primary text-on-primary py-sm rounded-lg font-bold hover:bg-primary/95 transition-all text-sm"
              >
                Terapkan Filter
              </button>
            </div>

            {/* Display Panel */}
            <div className="lg:col-span-3 space-y-lg">
              
              {/* Visualisation selectors */}
              <div className="bg-surface-container-lowest p-sm border border-outline-variant rounded-xl shadow-sm flex items-center justify-between">
                <span className="text-xs font-bold font-label-caps text-on-surface-variant px-sm">Pilih Jenis Visualisasi</span>
                <div className="flex gap-xs">
                  <button 
                    onClick={() => setChartType("bar")}
                    className={`px-md py-sm rounded font-bold text-xs flex items-center gap-xs transition-all ${
                      chartType === "bar" ? "bg-secondary-container text-on-secondary-container" : "hover:bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">bar_chart</span> Bar Chart
                  </button>
                  <button 
                    onClick={() => setChartType("line")}
                    className={`px-md py-sm rounded font-bold text-xs flex items-center gap-xs transition-all ${
                      chartType === "line" ? "bg-secondary-container text-on-secondary-container" : "hover:bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">show_chart</span> Line Chart
                  </button>
                </div>
              </div>

              {/* Chart Display Area */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg h-[430px] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-lg">
                  <h4 className="font-title-md text-on-surface font-semibold">{title}</h4>
                  <span className="text-xs text-on-surface-variant font-semibold">{unit}</span>
                </div>

                {loading ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
                    Memuat data analisis dari aitech.db...
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
                    Tidak ada data yang tersedia untuk filter saat ini.
                  </div>
                ) : chartType === "line" ? (
                  /* Line Chart visualization */
                  <div className="flex-1 flex items-center justify-center border-l border-b border-outline-variant/30 px-lg pb-md">
                    <svg className="w-full h-64 overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="#ccc" strokeDasharray="4" opacity="0.2" />
                      <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#ccc" strokeDasharray="4" opacity="0.2" />
                      <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="#ccc" strokeDasharray="4" opacity="0.2" />

                      {/* Line Paths */}
                      <path
                        d={`M 50,${256 - chartData[0].senior * 3} L 300,${256 - chartData[1].senior * 3} L 550,${256 - chartData[2].senior * 3}`}
                        fill="none"
                        stroke="#0F4C81"
                        strokeWidth="3"
                        className="transition-all duration-500"
                      />
                      <path
                        d={`M 50,${256 - chartData[0].adult * 3} L 300,${256 - chartData[1].adult * 3} L 550,${256 - chartData[2].adult * 3}`}
                        fill="none"
                        stroke="#1E88E5"
                        strokeWidth="3"
                        className="transition-all duration-500"
                      />
                      <path
                        d={`M 50,${256 - chartData[0].youth * 3} L 300,${256 - chartData[1].youth * 3} L 550,${256 - chartData[2].youth * 3}`}
                        fill="none"
                        stroke="#ED6C02"
                        strokeWidth="3"
                        className="transition-all duration-500"
                      />

                      {/* Circles for nodes */}
                      {chartData.map((row, idx) => {
                        const x = 50 + idx * 250;
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={256 - row.senior * 3} r="5" fill="#0F4C81" />
                            <circle cx={x} cy={256 - row.adult * 3} r="5" fill="#1E88E5" />
                            <circle cx={x} cy={256 - row.youth * 3} r="5" fill="#ED6C02" />
                            <text x={x} y="280" textAnchor="middle" className="text-[10px] fill-on-surface-variant font-label-caps">{row.category}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                ) : (
                  /* Bar Chart visualization */
                  <div className="flex-1 flex items-end justify-between relative border-l border-b border-outline-variant/30 px-lg pb-md">
                    {/* Grid background */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-md">
                      <div className="w-full border-t border-outline"></div>
                      <div className="w-full border-t border-outline"></div>
                      <div className="w-full border-t border-outline"></div>
                    </div>

                    <div className="flex items-end w-full justify-around h-full">
                      {chartData.map((row, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-end h-full">
                          <div className="flex items-end gap-1.5">
                            {/* Bar 1 (Senior/Low condition) */}
                            <div 
                              title={`${seriesLabels[0]}: ${row.senior}%`}
                              className="w-8 bg-[#0F4C81] rounded-t shadow-sm transition-all duration-500 hover:brightness-110"
                              style={{ height: `${Math.max(4, row.senior * 3.5)}px` }}
                            />
                            {/* Bar 2 (Adult/Mid condition) */}
                            <div 
                              title={`${seriesLabels[1]}: ${row.adult}%`}
                              className="w-8 bg-[#1E88E5] rounded-t shadow-sm transition-all duration-500 hover:brightness-110"
                              style={{ height: `${Math.max(4, row.adult * 3.5)}px` }}
                            />
                            {/* Bar 3 (Youth/High condition) */}
                            <div 
                              title={`${seriesLabels[2]}: ${row.youth}%`}
                              className="w-8 bg-[#ED6C02] rounded-t shadow-sm transition-all duration-500 hover:brightness-110"
                              style={{ height: `${Math.max(4, row.youth * 3.5)}px` }}
                            />
                          </div>
                          <span className="text-[10px] mt-sm font-label-caps text-on-surface-variant font-bold text-center leading-none">
                            {row.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legend bar */}
                <div className="flex justify-center gap-lg mt-md">
                  <div className="flex items-center gap-xs text-[10px]">
                    <span className="w-2.5 h-2.5 rounded bg-[#0F4C81]"></span>
                    <span>{seriesLabels[0]}</span>
                  </div>
                  <div className="flex items-center gap-xs text-[10px]">
                    <span className="w-2.5 h-2.5 rounded bg-[#1E88E5]"></span>
                    <span>{seriesLabels[1]}</span>
                  </div>
                  <div className="flex items-center gap-xs text-[10px]">
                    <span className="w-2.5 h-2.5 rounded bg-[#ED6C02]"></span>
                    <span>{seriesLabels[2]}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <footer className="py-lg border-t border-outline-variant bg-surface-container-lowest mt-lg">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto gap-md">
            <div className="flex items-center gap-sm">
              <span className="font-bold text-on-surface uppercase tracking-tighter">AITECHID</span>
              <span className="text-outline-variant">|</span>
              <p className="font-label-caps text-on-surface-variant text-xs">
                Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="province" />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
            <div className="flex flex-col">
                <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
                    <span>Menu Utama</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-primary font-bold">Data Kemiskinan Makro {"&"} Mikro</span>
                </nav>
                <h2 className="font-title-md text-primary leading-tight font-bold">Data Alokasi {"&"} Indikator Kemiskinan</h2>
            </div>
        </header>

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
            
            <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm flex flex-col md:flex-row gap-md justify-between items-center">
                <div className="flex flex-wrap gap-sm items-center w-full">
                    <select className="bg-surface-container border border-outline-variant rounded p-sm text-xs text-on-surface-variant">
                        <option>Nasional</option>
                        <option>Jawa Barat</option>
                        <option>Sumatera Utara</option>
                    </select>
                    <select className="bg-surface-container border border-outline-variant rounded p-sm text-xs text-on-surface-variant">
                        <option>Tahun 2026</option>
                        <option>Tahun 2025</option>
                    </select>
                </div>
                <button className="bg-[#0F4C81] text-white px-lg py-2 rounded text-xs font-bold hover:bg-[#0F4C81]/90 whitespace-nowrap">
                    Download CSV
                </button>
            </div>

            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <h4 className="font-title-md text-on-surface font-semibold">Tabel Capaian Indikator Kemiskinan Wilayah</h4>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low">
                        <tr>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Wilayah</th>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Tingkat Kemiskinan (%)</th>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Jumlah Penduduk Miskin</th>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Indeks Kedalaman (P1)</th>
                            <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Indeks Keparahan (P2)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-bold">Aceh</td>
                            <td className="px-md py-md text-right font-data-mono">14.43%</td>
                            <td className="px-md py-md text-right font-data-mono">810.4K</td>
                            <td className="px-md py-md text-right font-data-mono">2.62</td>
                            <td className="px-md py-md text-right font-data-mono">0.68</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-bold">Sumatera Utara</td>
                            <td className="px-md py-md text-right font-data-mono">8.15%</td>
                            <td className="px-md py-md text-right font-data-mono">1.2M</td>
                            <td className="px-md py-md text-right font-data-mono">1.10</td>
                            <td className="px-md py-md text-right font-data-mono">0.24</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-bold">Jawa Barat</td>
                            <td className="px-md py-md text-right font-data-mono">7.62%</td>
                            <td className="px-md py-md text-right font-data-mono">3.8M</td>
                            <td className="px-md py-md text-right font-data-mono">1.04</td>
                            <td className="px-md py-md text-right font-data-mono">0.20</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-bold">Jawa Tengah</td>
                            <td className="px-md py-md text-right font-data-mono">10.47%</td>
                            <td className="px-md py-md text-right font-data-mono">3.7M</td>
                            <td className="px-md py-md text-right font-data-mono">1.52</td>
                            <td className="px-md py-md text-right font-data-mono">0.31</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-bold">Papua</td>
                            <td className="px-md py-md text-right font-data-mono">26.03%</td>
                            <td className="px-md py-md text-right font-data-mono">255.8K</td>
                            <td className="px-md py-md text-right font-data-mono">5.20</td>
                            <td className="px-md py-md text-right font-data-mono">1.44</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        
        <footer className="py-lg border-t border-outline-variant bg-surface-container-lowest mt-lg">
            <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto gap-md">
                <div className="flex items-center gap-sm">
                    <span className="font-bold text-on-surface uppercase tracking-tighter">AITECHID</span>
                    <span className="text-outline-variant">|</span>
                    <p className="font-label-caps text-on-surface-variant text-xs">Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia</p>
                </div>
            </div>
        </footer>
    </main>

    
    </div>
  );
}

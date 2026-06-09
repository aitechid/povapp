"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/10 text-slate-400 font-semibold">
      Loading Spatial Map Engine...
    </div>
  ),
});

export default function Page() {
  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="district" />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
            <div className="flex flex-col">
                <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
                    <span>Pemetaan Spasial</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-primary font-bold">Choropleth Distribution</span>
                </nav>
                <h2 className="font-title-md text-primary leading-tight font-bold">Pemetaan Spasial Kemiskinan Nasional</h2>
            </div>
        </header>

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
            
            <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm flex flex-col md:flex-row gap-md justify-between items-center">
                <div className="flex items-center gap-sm">
                    <button className="bg-[#0F4C81] text-white px-md py-1.5 rounded text-xs font-bold flex items-center gap-xs"><span className="material-symbols-outlined text-sm">layers</span> Layer: Kemiskinan Makro</button>
                    <button className="hover:bg-surface-container text-on-surface-variant px-md py-1.5 rounded text-xs font-semibold flex items-center gap-xs"><span className="material-symbols-outlined text-sm">health_and_safety</span> Layer: Stunting {"&"} Kesejahteraan</button>
                </div>
            </div>

            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm h-[550px] relative overflow-hidden flex items-center justify-center">
                <LeafletMap />
                
                <div className="absolute top-md right-md bg-surface/90 glass-nav border border-outline-variant p-md rounded-xl shadow-xl max-w-sm z-[1000]">
                    <h5 className="font-bold text-primary text-sm">Legend {"&"} Indikator Spasial</h5>
                    <div className="space-y-sm mt-md text-xs">
                        <div className="flex items-center gap-sm"><span className="w-3 h-3 rounded bg-[#10b981]"></span><span>Kemiskinan {"<"} 7% (Low)</span></div>
                        <div className="flex items-center gap-sm"><span className="w-3 h-3 rounded bg-[#0ea5e9]"></span><span>Kemiskinan 7% - 12% (Moderate)</span></div>
                        <div className="flex items-center gap-sm"><span className="w-3 h-3 rounded bg-[#f59e0b]"></span><span>Kemiskinan 12% - 18% (High)</span></div>
                        <div className="flex items-center gap-sm"><span className="w-3 h-3 rounded bg-error"></span><span>Kemiskinan {">"} 18% (Critical)</span></div>
                    </div>
                </div>
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

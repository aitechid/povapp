"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/10 text-slate-400">
      Loading Interactive Map...
    </div>
  ),
});

export default function Page() {
  const [povertyData, setPovertyData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/data/poverty_data.json")
      .then((res) => res.json())
      .then((data) => {
        setPovertyData(data);
      })
      .catch((err) => {
        console.error("Error loading poverty data:", err);
      });
  }, []);

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  const provincesList = povertyData 
    ? Object.keys(povertyData)
        .filter(p => p !== "INDONESIA")
        .map(p => ({
          name: p,
          rate: povertyData[p].kpi.poverty_rate_percent || 0,
          poorCount: povertyData[p].kpi.poor_population_thousands || 0
        }))
        .sort((a, b) => b.rate - a.rate)
    : [];

  return (
    <div className="min-h-screen bg-background pl-64 relative">
      
      

<Sidebar activePage="national" />

<main className="flex-1 flex flex-col min-h-screen">

<header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
<div className="flex flex-col">
<nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
<span>Dashboard</span>
<span className="material-symbols-outlined text-[12px]">chevron_right</span>
<span className="text-primary font-bold">Tingkat Nasional</span>
</nav>
<h2 className="font-title-md text-primary leading-tight">Portal Penanggulangan Kemiskinan dan Analisis</h2>
</div>
<div className="flex items-center gap-lg">
<div className="hidden md:flex items-center gap-md bg-surface-container-low px-md py-1.5 rounded-full border border-outline-variant">
<div className="flex items-center gap-xs border-r border-outline-variant pr-md mr-1">
<span className="font-label-caps text-on-surface-variant">Year</span>
<span className="font-bold text-primary">2026</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</div>
<div className="flex items-center gap-xs">
<span className="font-label-caps text-on-surface-variant">Survey</span>
<span className="font-bold text-primary">SUSENAS Maret</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
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

<div className="p-margin max-w-7xl mx-auto w-full space-y-lg">

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">

<div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-on-surface-variant">Jumlah Penduduk Miskin</span>
<span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
</div>
<div className="flex items-end justify-between">
<div>
<h3 className="font-headline-lg text-primary">25.22 <span className="text-body-sm font-medium text-on-surface-variant">Juta Jiwa</span></h3>
<p className="text-xs text-error font-semibold flex items-center gap-1">
                                -0.68% <span className="font-normal text-on-surface-variant">YoY</span>
</p>
</div>
<div className="h-10 w-24 bg-error/10 rounded overflow-hidden">
<div className="w-full h-full bg-gradient-to-t from-error/20 to-transparent flex items-end">
<div className="w-full h-[2px] bg-error shadow-[0_0_8px_rgba(186,26,26,0.5)] transform translate-y-[-10px] rotate-[10deg]"></div>
</div>
</div>
</div>
<div className="absolute bottom-0 left-0 w-full h-1 bg-error/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
</div>

<div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-on-surface-variant">Tingkat Kemiskinan</span>
<span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
</div>
<div className="flex items-end justify-between">
<div>
<h3 className="font-headline-lg text-primary">9.03<span className="text-body-sm font-medium text-on-surface-variant">%</span></h3>
<p className="text-xs text-error font-semibold flex items-center gap-1">
                                -0.33% <span className="font-normal text-on-surface-variant">YoY</span>
</p>
</div>
<div className="h-10 w-24 bg-error/10 rounded overflow-hidden">
<div className="w-full h-full bg-gradient-to-t from-error/20 to-transparent flex items-end">
<div className="w-full h-[2px] bg-error shadow-[0_0_8px_rgba(186,26,26,0.5)] transform translate-y-[-5px] rotate-[15deg]"></div>
</div>
</div>
</div>
<div className="absolute bottom-0 left-0 w-full h-1 bg-error/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
</div>

<div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-on-surface-variant">Garis Kemiskinan</span>
<span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
</div>
<div className="flex items-end justify-between">
<div>
<h3 className="font-title-md text-primary">Rp 550.458</h3>
<p className="text-xs text-secondary font-semibold flex items-center gap-1">
                                +5.4% <span className="font-normal text-on-surface-variant">/ Bln</span>
</p>
</div>
<div className="h-10 w-24 bg-secondary/10 rounded overflow-hidden">
<div className="w-full h-full bg-gradient-to-t from-secondary/20 to-transparent flex items-end">
<div className="w-full h-[2px] bg-secondary shadow-[0_0_8px_rgba(0,96,168,0.5)] transform translate-y-[-20px] rotate-[-15deg]"></div>
</div>
</div>
</div>
<div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
</div>

<div className="bg-tertiary-fixed p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-on-tertiary-fixed">Wilayah Prioritas</span>
<span className="material-symbols-outlined text-tertiary">warning</span>
</div>
<div className="flex items-end justify-between">
<div>
<h3 className="font-headline-lg text-on-tertiary-fixed">122</h3>
<p className="text-xs text-on-tertiary-fixed-variant font-semibold">
                                Kab/Kota Prioritas <br/> <span className="font-normal opacity-70">Extreme Poverty Focus</span>
</p>
</div>
<div className="p-2 bg-on-tertiary-fixed/10 rounded-full">
<span className="material-symbols-outlined text-tertiary">location_on</span>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden h-[500px]">
<div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
<h4 className="font-title-md text-on-surface">Poverty Distribution Intensity</h4>
<div className="flex gap-sm">
<button className="p-1 hover:bg-surface-container-highest rounded border border-outline-variant"><span className="material-symbols-outlined text-sm">zoom_in</span></button>
<button className="p-1 hover:bg-surface-container-highest rounded border border-outline-variant"><span className="material-symbols-outlined text-sm">zoom_out</span></button>
<button className="p-1 hover:bg-surface-container-highest rounded border border-outline-variant"><span className="material-symbols-outlined text-sm">layers</span></button>
<button className="p-1 hover:bg-surface-container-highest rounded border border-outline-variant"><span className="material-symbols-outlined text-sm">download</span></button>
</div>
</div>
<div className="relative flex-1 bg-secondary-container/5 overflow-hidden min-h-[300px]">

<LeafletMap />

<div className="absolute bottom-lg left-lg p-md bg-surface/90 glass-nav border border-outline-variant rounded-lg shadow-lg z-[1000]">
<p className="font-label-caps text-on-surface-variant mb-sm">Persentase Kemiskinan</p>
<div className="space-y-xs">
<div className="flex items-center gap-md">
<span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
<span className="text-xs text-on-surface-variant">3.0% - 7.0% (Low)</span>
</div>
<div className="flex items-center gap-md">
<span className="w-3 h-3 rounded-full bg-[#0ea5e9]"></span>
<span className="text-xs text-on-surface-variant">7.0% - 12.0% (Moderate)</span>
</div>
<div className="flex items-center gap-md">
<span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
<span className="text-xs text-on-surface-variant">12.0% - 18.0% (High)</span>
</div>
<div className="flex items-center gap-md">
<span className="w-3 h-3 rounded-full bg-error"></span>
<span className="text-xs text-on-surface-variant">{">"} 18.0% (Critical)</span>
</div>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col h-[500px]">
<div className="p-md border-b border-outline-variant bg-surface-container-low">
<h4 className="font-title-md text-on-surface">Top 7 Provinsi Tertinggi</h4>
</div>
<div className="flex-1 overflow-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low sticky top-0">
<tr>
<th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Provinsi</th>
<th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Tingkat (%)</th>
<th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Jumlah</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{provincesList.length === 0 ? (
  <tr>
    <td colSpan={3} className="px-md py-lg text-center text-xs text-on-surface-variant">Loading Top Provinces...</td>
  </tr>
) : (
  provincesList.slice(0, 7).map((prov, idx) => {
    const formattedCount = prov.poorCount >= 1000 
      ? `${(prov.poorCount / 1000).toFixed(2)} Jt`
      : `${prov.poorCount.toFixed(1)} Rb`;

    return (
      <tr key={prov.name} className="hover:bg-surface-container-low transition-colors group">
        <td className="px-md py-sm">
          <div className="flex items-center gap-sm">
            <span className="w-5.5 h-5.5 rounded flex items-center justify-center bg-error/10 text-error font-bold text-[10px]">{idx + 1}</span>
            <span className="text-[11px] font-bold text-on-surface">{toTitleCase(prov.name)}</span>
          </div>
        </td>
        <td className="px-md py-sm text-right font-data-mono text-error font-bold text-[11px]">{prov.rate.toFixed(2)}%</td>
        <td className="px-md py-sm text-right font-data-mono text-on-surface-variant text-[11px]">{formattedCount}</td>
      </tr>
    );
  })
)}
</tbody>
</table>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg overflow-hidden">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-title-md text-on-surface">National Poverty Trend (2010 - 2026)</h4>
<div className="flex gap-sm">
<span className="px-sm py-xs bg-secondary/10 text-secondary font-label-caps text-[10px] rounded">HISTORICAL</span>
<span className="px-sm py-xs bg-tertiary/10 text-tertiary font-label-caps text-[10px] rounded">PREDICTIVE</span>
</div>
</div>
<div className="h-64 w-full flex items-end justify-between relative">

<div className="absolute inset-0 border-l border-b border-outline-variant opacity-30"></div>
<div className="absolute bottom-1/4 left-1/4 w-[1px] h-[100px] border-l border-dashed border-outline-variant z-10">
<div className="absolute top-0 transform -translate-x-1/2 bg-on-surface text-surface text-[10px] px-2 py-1 rounded font-bold">COVID-19</div>
</div>

<div className="flex-1 px-1 h-[70%] bg-primary/10 mx-xs hover:bg-primary/20 transition-all"></div>
<div className="flex-1 px-1 h-[68%] bg-primary/10 mx-xs hover:bg-primary/20 transition-all"></div>
<div className="flex-1 px-1 h-[65%] bg-primary/10 mx-xs hover:bg-primary/20 transition-all"></div>
<div className="flex-1 px-1 h-[63%] bg-primary/10 mx-xs hover:bg-primary/20 transition-all"></div>
<div className="flex-1 px-1 h-[62%] bg-primary/10 mx-xs hover:bg-primary/20 transition-all"></div>
<div className="flex-1 px-1 h-[75%] bg-error/20 mx-xs hover:bg-error/30 transition-all border-t-2 border-error"></div>
<div className="flex-1 px-1 h-[60%] bg-primary/30 mx-xs hover:bg-primary/40 transition-all border-t-2 border-primary"></div>
<div className="flex-1 px-1 h-[55%] bg-primary/40 mx-xs hover:bg-primary/50 transition-all border-t-2 border-primary"></div>
<div className="flex-1 px-1 h-[48%] bg-primary/50 mx-xs hover:bg-primary/60 transition-all border-t-2 border-primary"></div>
</div>
<div className="flex justify-between mt-md px-md">
<span className="text-[10px] font-label-caps text-on-surface-variant">2010</span>
<span className="text-[10px] font-label-caps text-on-surface-variant">2014</span>
<span className="text-[10px] font-label-caps text-on-surface-variant">2018</span>
<span className="text-[10px] font-label-caps text-on-surface-variant">2022</span>
<span className="text-[10px] font-label-caps text-on-surface-variant">2026 (Est)</span>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
<h4 className="font-title-md text-on-surface mb-lg">Segmentasi Kemiskinan Berdasarkan Pendidikan</h4>
<div className="grid grid-cols-12 gap-sm h-64">

<div className="col-span-6 bg-primary-container text-white p-md rounded-lg flex flex-col justify-end group cursor-pointer hover:opacity-90">
<span className="font-headline-lg">42%</span>
<span className="font-label-caps opacity-80 uppercase">Tidak Sekolah / SD</span>
</div>
<div className="col-span-6 flex flex-col gap-sm">
<div className="h-1/2 bg-primary text-white p-md rounded-lg flex flex-col justify-end hover:opacity-90 cursor-pointer">
<span className="font-title-md">28%</span>
<span className="font-label-caps opacity-80 uppercase">SMP</span>
</div>
<div className="h-1/2 grid grid-cols-2 gap-sm">
<div className="bg-secondary-container text-on-secondary-container p-sm rounded-lg flex flex-col justify-end hover:opacity-90 cursor-pointer">
<span className="font-body-md font-bold">22%</span>
<span className="text-[9px] font-label-caps opacity-80 uppercase leading-none">SMA/SMK</span>
</div>
<div className="bg-outline-variant text-on-surface p-sm rounded-lg flex flex-col justify-end hover:opacity-90 cursor-pointer">
<span className="font-body-md font-bold">8%</span>
<span className="text-[9px] font-label-caps opacity-80 uppercase leading-none">Pendidikan Tinggi</span>
</div>
</div>
</div>
</div>
<p className="mt-md text-xs text-on-surface-variant italic">
                        *Data menunjukkan korelasi kuat antara tingkat pendidikan rendah dengan kerentanan kemiskinan ekstrem.
                    </p>
</div>
</div>
</div>

<footer className="mt-auto w-full py-lg border-t border-outline-variant bg-surface-container-lowest">
<div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto gap-md">
<div className="flex items-center gap-sm">
<span className="font-bold text-on-surface uppercase tracking-tighter">AITECHID</span>
<span className="text-outline-variant">|</span>
<p className="font-label-caps text-on-surface-variant">Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia</p>
</div>
<div className="flex gap-lg">
<a className="font-label-caps text-on-surface-variant hover:text-primary underline transition-all" href="#">Kebijakan Privasi</a>
<a className="font-label-caps text-on-surface-variant hover:text-primary underline transition-all" href="#">Syarat {"&"} Ketentuan</a>
<a className="font-label-caps text-on-surface-variant hover:text-primary underline transition-all" href="#">Hubungi Kami</a>
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

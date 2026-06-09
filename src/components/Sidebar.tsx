"use client";

import React from "react";
import Link from "next/link";

interface SidebarProps {
  activePage: string;
}

export default function Sidebar({ activePage }: SidebarProps) {
  const menuItems = [
    { id: "national", label: "Nasional", path: "/national", icon: "home" },
    { id: "province", label: "Provinsi", path: "/province", icon: "analytics" },
    { id: "district", label: "Kabupaten/Kota", path: "/district", icon: "map" },
    { id: "poverty-analysis", label: "Analisis Kemiskinan", path: "/poverty-analysis", icon: "insights" },
  ];

  const operationalItems = [
    { id: "catalog", label: "Katalog Data", path: "/catalog", icon: "database" },
    { id: "upload", label: "Unggah Dataset", path: "/upload", icon: "cloud_upload" },
    { id: "query-builder", label: "Query Studio", path: "/query-builder", icon: "terminal" },
    { id: "api-catalog", label: "API Center", path: "/api-catalog", icon: "api" },
  ];

  const renderItem = (item: { id: string; label: string; path: string; icon: string }) => {
    const isActive = activePage === item.id;
    return (
      <Link
        key={item.id}
        href={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-sky-500/10 text-sky-400 font-semibold border-l-2 border-sky-400"
            : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] transition-colors ${
          isActive ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"
        }`}>
          {item.icon}
        </span>
        <span className="text-sm">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-[#091a2f] border-r border-white/[0.06] flex flex-col p-5 gap-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="w-10 h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white leading-none">Poverty Portal</h1>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Analyst Console</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map(renderItem)}
        
        <div className="pt-6 pb-2 px-4">
          <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase block">Operational</span>
        </div>

        {operationalItems.map(renderItem)}
      </nav>

      {/* Sidebar Footer / Profile Link */}
      <div className="mt-auto space-y-1 border-t border-white/[0.06] pt-4">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            activePage === "profile"
              ? "bg-sky-500/10 text-sky-400 font-semibold border-l-2 border-sky-400"
              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-slate-200">
            settings
          </span>
          <span className="text-sm">Pengaturan Profil</span>
        </Link>
        
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 group"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-rose-400">
            logout
          </span>
          <span className="text-sm">Keluar</span>
        </Link>
      </div>
    </aside>
  );
}

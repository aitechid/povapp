"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";

interface APIEndpoint {
  method: "GET" | "POST" | "DELETE";
  path: string;
  description: string;
  rateLimit: string;
  requestSchema: string;
  responseSchema: string;
}

export default function Page() {
  const [expandedApi, setExpandedApi] = useState<string | null>(null);

  const apis: APIEndpoint[] = [
    {
      method: "POST",
      path: "/api/query",
      description: "Mengeksekusi kueri dinamis pada database aitech.db untuk dataset Rumah Tangga atau Individu dengan filter desil dan logika kondisi.",
      rateLimit: "150 req/min",
      requestSchema: JSON.stringify({
        dataset: "individual",
        deciles: [1, 2],
        conditions: [
          { column: "h_hhmale", operator: "=", value: "1" }
        ]
      }, null, 2),
      responseSchema: JSON.stringify({
        success: true,
        executionTime: "0.015",
        total: 12500,
        rows: [
          {
            id_ruta: "IND-AITECH-000001",
            b4_k3: 1,
            h_hhmale: 1,
            h_hhcount: 6
          }
        ]
      }, null, 2)
    },
    {
      method: "GET",
      path: "/api/query/metadata",
      description: "Mengambil daftar kolom dan metadata indikator yang diizinkan (whitelisted) untuk kueri pada dataset terpilih.",
      rateLimit: "200 req/min",
      requestSchema: "Query Parameters:\n?dataset=household (Default: household)",
      responseSchema: JSON.stringify({
        columns: [
          { column_name: "target", type: "integer", column_label: "Desil Kesejahteraan" },
          { column_name: "h_aset_motorcycle", type: "integer", column_label: "Kepemilikan Sepeda Motor" }
        ]
      }, null, 2)
    },
    {
      method: "GET",
      path: "/api/catalog",
      description: "Mengambil daftar seluruh berkas dataset dan dokumen terdaftar di sistem beserta skema tabel dan baris data.",
      rateLimit: "100 req/min",
      requestSchema: "None (No parameters required)",
      responseSchema: JSON.stringify({
        success: true,
        datasets: [
          {
            id: "aitech",
            name: "aitech.db",
            sizeMB: "11.80",
            owner: "AITECH Ingestion",
            quality: "98.5% (Sangat Baik)",
            description: "Database PBDT Nasional terintegrasi AITECHID.",
            tables: [
              { tableName: "household_pbdt", rows: 50000, columns: 68 }
            ]
          }
        ]
      }, null, 2)
    },
    {
      method: "POST",
      path: "/api/upload",
      description: "Mengunggah berkas database SQLite (.db) atau dokumen referensi (.csv, .xlsx, .pdf, .json) baru ke sistem.",
      rateLimit: "30 req/min",
      requestSchema: "Multipart Form Data:\n- file: File (Required)\n- description: String (Optional)",
      responseSchema: JSON.stringify({
        success: true,
        message: "Berhasil mengunggah dan mengindeks database aitech.db",
        dataset: {
          id: "aitech",
          name: "aitech.db",
          sizeMB: "11.80",
          quality: "98.5% (Sangat Baik)"
        }
      }, null, 2)
    },
    {
      method: "DELETE",
      path: "/api/catalog",
      description: "Menghapus berkas dataset fisik dan catatan registrinya secara permanen dari server berdasarkan ID berkas.",
      rateLimit: "30 req/min",
      requestSchema: "Query Parameters:\n?id=test_mock_db (Required)",
      responseSchema: JSON.stringify({
        success: true,
        message: "Dataset berhasil dihapus"
      }, null, 2)
    },
    {
      method: "GET",
      path: "/api/download",
      description: "Mengunduh file mentah (raw database atau attachment document) dari server berdasarkan ID berkas.",
      rateLimit: "60 req/min",
      requestSchema: "Query Parameters:\n?id=aitech (Required)",
      responseSchema: "Binary Stream (application/octet-stream)"
    },
    {
      method: "GET",
      path: "/api/analysis",
      description: "Menghasilkan data statistik agregasi demografis kemiskinan (Pendidikan, Aset, Kelayakan Rumah) dari database aitech.db.",
      rateLimit: "120 req/min",
      requestSchema: "Query Parameters:\n?indicator=education (Optional: education | assets | housing)\n?region=all (Optional)\n?year=2026 (Optional)",
      responseSchema: JSON.stringify({
        success: true,
        indicator: "education",
        title: "Proporsi Kemiskinan Berdasarkan Pendidikan & Kelompok Umur",
        unit: "% Penduduk Desil 1-4",
        seriesLabels: ["Umur > 55", "Umur 25-54", "Umur 15-24"],
        data: [
          { category: "Tidak Tamat SD", senior: 4, adult: 35, youth: 16 }
        ]
      }, null, 2)
    }
  ];

  const toggleExpand = (apiKey: string) => {
    setExpandedApi(expandedApi === apiKey ? null : apiKey);
  };

  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="api-catalog" />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
          <div className="flex flex-col">
            <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
              <span>Developer Area</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">API Catalog</span>
            </nav>
            <h2 className="font-title-md text-primary leading-tight font-bold">Pusat Integrasi API Kemiskinan</h2>
          </div>
        </header>

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
          {/* Info banner */}
          <div className="p-md bg-primary-container text-[#8ebdf9] rounded-xl flex gap-sm items-center shadow-sm">
            <span className="material-symbols-outlined text-2xl">info</span>
            <div className="text-xs">
              <p className="font-bold text-white">Satu Data Indonesia API Standardization</p>
              <p className="mt-0.5 text-white/80">Seluruh API menggunakan autentikasi OAuth2 / Bearer JWT Token. Limitasi default publik adalah 100 request/menit.</p>
            </div>
          </div>

          {/* Endpoints List */}
          <div className="grid grid-cols-1 gap-md">
            {apis.map((api) => {
              const apiKey = `${api.method}-${api.path}`;
              const isExpanded = expandedApi === apiKey;
              return (
                <div 
                  key={apiKey} 
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  {/* Header row */}
                  <div 
                    className="p-md flex flex-col md:flex-row md:items-center justify-between gap-md cursor-pointer hover:bg-surface-container-low/50 transition-colors"
                    onClick={() => toggleExpand(apiKey)}
                  >
                    <div className="flex items-center gap-sm flex-wrap">
                      <span className={`px-sm py-0.5 rounded text-[10px] font-extrabold font-data-mono ${
                        api.method === "POST" 
                          ? "bg-warning/10 text-warning" 
                          : api.method === "DELETE"
                          ? "bg-error/10 text-error"
                          : "bg-success/10 text-success"
                      }`}>
                        {api.method}
                      </span>
                      <span className="font-bold font-data-mono text-xs text-on-surface">{api.path}</span>
                    </div>
                    <div className="flex items-center gap-md text-xs font-semibold text-on-surface-variant">
                      <span>{api.rateLimit}</span>
                      <button 
                        className="text-primary hover:underline flex items-center gap-xs text-[11px]"
                        onClick={(e) => { e.stopPropagation(); toggleExpand(apiKey); }}
                      >
                        {isExpanded ? "Sembunyikan Skema" : "Lihat Skema & JSON"}
                        <span className="material-symbols-outlined text-sm">
                          {isExpanded ? "expand_less" : "expand_more"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Sub title / description */}
                  <div className="px-md pb-md">
                    <p className="text-xs text-on-surface-variant leading-relaxed pl-1">{api.description}</p>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-outline-variant bg-surface-container-low/30 p-md space-y-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        
                        {/* Request schema */}
                        <div className="space-y-xs">
                          <span className="text-[10px] font-bold font-label-caps text-[#0F4C81]">Request Payload / Query</span>
                          <pre className="p-sm bg-surface-container-lowest border border-outline-variant rounded text-[10px] font-data-mono text-on-surface overflow-x-auto max-h-48 leading-normal">
                            {api.requestSchema}
                          </pre>
                        </div>

                        {/* Response schema */}
                        <div className="space-y-xs">
                          <span className="text-[10px] font-bold font-label-caps text-success">Response JSON Schema</span>
                          <pre className="p-sm bg-surface-container-lowest border border-outline-variant rounded text-[10px] font-data-mono text-on-surface overflow-x-auto max-h-48 leading-normal">
                            {api.responseSchema}
                          </pre>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

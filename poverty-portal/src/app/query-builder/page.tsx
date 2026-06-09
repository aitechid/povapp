"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface IndicatorMeta {
  column: string;
  label: string;
}

interface MetadataResponse {
  household: IndicatorMeta[];
  individual: IndicatorMeta[];
}

interface Condition {
  column: string;
  operator: string;
  value: string;
}

export default function Page() {
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [dataset, setDataset] = useState<"household" | "individual">("household");
  const [deciles, setDeciles] = useState<number[]>([1, 2]);
  const [conditions, setConditions] = useState<Condition[]>([
    { column: "h_aset_motorcycle", operator: "=", value: "0" }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [executionTime, setExecutionTime] = useState<string>("0.0");
  const [generatedSql, setGeneratedSql] = useState<string>("");
  const [showSql, setShowSql] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Column Metadata on Mount
  useEffect(() => {
    fetch("/api/query/metadata")
      .then((res) => res.json())
      .then((data) => {
        setMetadata(data);
        // Default first condition to a valid column
        const defaultCol = dataset === "individual" 
          ? data.individual[0]?.column 
          : data.household[0]?.column;
        if (defaultCol) {
          setConditions([{ column: defaultCol, operator: "=", value: "0" }]);
        }
      })
      .catch((err) => console.error("Error fetching metadata:", err));
  }, [dataset]);

  // Handle Decile Selection Toggle
  const handleDecileToggle = (decile: number) => {
    if (deciles.includes(decile)) {
      setDeciles(deciles.filter((d) => d !== decile));
    } else {
      setDeciles([...deciles, decile]);
    }
  };

  // Add a new condition row
  const addCondition = () => {
    const defaultCol = dataset === "individual"
      ? metadata?.individual[0]?.column || ""
      : metadata?.household[0]?.column || "";
    setConditions([...conditions, { column: defaultCol, operator: "=", value: "0" }]);
  };

  // Remove a condition row
  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  // Update a specific condition field
  const updateCondition = (index: number, key: keyof Condition, val: string) => {
    const updated = [...conditions];
    updated[index][key] = val;
    setConditions(updated);
  };

  // Execute the constructed query against the SQLite backend
  const executeQuery = () => {
    setIsLoading(true);
    setErrorMsg(null);
    fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataset,
        deciles,
        conditions,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setResults(data.rows || []);
          setTotalRows(data.totalRows || 0);
          setExecutionTime(data.executionTimeSec || "0.0");
          setGeneratedSql(data.sql || "");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Query error:", err);
        setErrorMsg("Failed to connect to backend database query runner.");
        setIsLoading(false);
      });
  };

  // Run initial query
  useEffect(() => {
    if (metadata) {
      executeQuery();
    }
  }, [metadata]);

  const activeMeta = dataset === "individual" ? metadata?.individual || [] : metadata?.household || [];

  // Get display columns from the result keys to build table header
  const displayCols = results.length > 0 
    ? Object.keys(results[0]).slice(0, 7) // Show at most 7 columns for readability
    : ["id_ruta", "target"];

  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="query-builder" />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
          <div className="flex flex-col">
            <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
              <span>Ruang Kerja</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">Penyusun Kueri Dinamis</span>
            </nav>
            <h2 className="font-title-md text-primary leading-tight font-bold">Mesin Penyusun Kueri Dinamis (SQLite)</h2>
          </div>
        </header>

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            
            {/* Left Panel: Dataset and Deciles */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm space-y-md h-fit">
              <h3 className="font-title-md text-[#0F4C81] font-bold flex items-center gap-xs">
                <span className="material-symbols-outlined">database</span> Dataset Utama
              </h3>
              
              <div className="space-y-sm">
                {/* Household Dataset Selector */}
                <div 
                  className={`p-md border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                    dataset === "household" 
                      ? "border-2 border-secondary-container bg-secondary-container/5 font-bold" 
                      : "border-outline-variant hover:bg-surface-container-low"
                  }`}
                  onClick={() => setDataset("household")}
                >
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary">home</span>
                    <div>
                      <p className={`text-sm ${dataset === "household" ? "text-primary" : ""}`}>Data Rumah Tangga</p>
                      <p className="text-xs text-on-surface-variant">Indikator sosial ekonomi keluarga</p>
                    </div>
                  </div>
                  {dataset === "household" && <span className="material-symbols-outlined text-primary">check_circle</span>}
                </div>

                {/* Individual Dataset Selector */}
                <div 
                  className={`p-md border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                    dataset === "individual" 
                      ? "border-2 border-secondary-container bg-secondary-container/5 font-bold" 
                      : "border-outline-variant hover:bg-surface-container-low"
                  }`}
                  onClick={() => setDataset("individual")}
                >
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant">person</span>
                    <div>
                      <p className={`text-sm ${dataset === "individual" ? "text-primary" : ""}`}>Data Individu</p>
                      <p className="text-xs text-on-surface-variant">Pemetaan demografis per-person</p>
                    </div>
                  </div>
                  {dataset === "individual" && <span className="material-symbols-outlined text-primary">check_circle</span>}
                </div>
              </div>

              {/* Decile Classifications */}
              <div className="pt-md border-t border-outline-variant space-y-md">
                <span className="text-xs font-bold font-label-caps text-on-surface-variant block">Klasifikasi Desil (Target Kesejahteraan)</span>
                <div className="grid grid-cols-2 gap-sm text-xs">
                  {[1, 2, 3, 4].map((decile) => (
                    <label key={decile} className="flex items-center gap-sm p-sm border border-outline-variant rounded bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                      <input 
                        type="checkbox" 
                        checked={deciles.includes(decile)}
                        onChange={() => handleDecileToggle(decile)}
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span>Desil {decile}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Indicators and Logic Builder */}
            <div className="lg:col-span-8 space-y-lg">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-md space-y-md">
                <div className="flex justify-between items-center">
                  <h4 className="font-title-md text-primary font-bold flex items-center gap-xs">
                    <span className="material-symbols-outlined">schema</span> Pemilihan Indikator & Logika Kueri
                  </h4>
                  <div className="flex gap-xs">
                    <button 
                      className={`px-md py-1 border rounded text-xs font-bold transition-all ${
                        showSql ? "bg-[#0F4C81] text-white" : "border-outline-variant text-on-surface-variant"
                      }`}
                      onClick={() => setShowSql(!showSql)}
                    >
                      {showSql ? "Sembunyikan SQL" : "Visualisasikan SQL"}
                    </button>
                    <button className="px-md py-1 bg-secondary text-white rounded text-xs font-bold cursor-default">Logika AND</button>
                  </div>
                </div>

                {/* Displaying Live SQL Code Block if Toggled */}
                {showSql && (
                  <div className="p-md bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg border border-slate-800 shadow-inner overflow-x-auto">
                    <div className="text-slate-500 mb-1">-- Generated SQL Statement</div>
                    <code>{generatedSql || "-- Buat kueri untuk memvisualisasikan SQL"}</code>
                  </div>
                )}

                {/* Render Logic Rules Dynamically */}
                <div className="space-y-sm">
                  {conditions.length === 0 ? (
                    <div className="p-md text-center text-xs text-on-surface-variant border border-dashed border-outline-variant rounded-xl">
                      Tidak ada filter tambahan. Hasil kueri hanya menyaring klasifikasi Desil yang dipilih.
                    </div>
                  ) : (
                    conditions.map((cond, idx) => (
                      <div key={idx} className="flex flex-col space-y-sm">
                        {idx > 0 && (
                          <div className="flex justify-center">
                            <span className="px-md py-0.5 bg-[#2E7D32]/10 text-[#2E7D32] font-bold text-[10px] rounded-full border border-[#2E7D32]/20">DAN</span>
                          </div>
                        )}
                        <div className="p-sm sm:p-md border border-outline-variant bg-surface-container-low rounded-xl flex flex-col sm:flex-row items-center gap-sm sm:gap-md justify-between">
                          <div className="flex-1 flex flex-col sm:flex-row gap-xs sm:gap-sm w-full">
                            {/* Column Indicator Dropdown */}
                            <select
                              className="flex-1 min-w-[200px] bg-surface-container border border-outline-variant rounded p-sm text-xs font-bold"
                              value={cond.column}
                              onChange={(e) => updateCondition(idx, "column", e.target.value)}
                            >
                              {activeMeta.map((meta) => (
                                <option key={meta.column} value={meta.column}>
                                  {meta.label} ({meta.column})
                                </option>
                              ))}
                            </select>

                            {/* Operator Selector */}
                            <select
                              className="w-full sm:w-20 bg-surface-container border border-outline-variant rounded p-sm text-xs text-center font-bold"
                              value={cond.operator}
                              onChange={(e) => updateCondition(idx, "operator", e.target.value)}
                            >
                              <option value="=">=</option>
                              <option value="!=">!=</option>
                              <option value=">">&gt;</option>
                              <option value="<">&lt;</option>
                              <option value=">=">&gt;=</option>
                              <option value="<=">&lt;=</option>
                            </select>

                            {/* Value Input */}
                            <input
                              type="text"
                              className="w-full sm:w-32 bg-surface-container border border-outline-variant rounded p-sm text-xs font-bold"
                              value={cond.value}
                              onChange={(e) => updateCondition(idx, "value", e.target.value)}
                              placeholder="Nilai"
                            />
                          </div>

                          {/* Delete condition button */}
                          <button 
                            className="p-sm hover:bg-error/10 text-error rounded transition-colors self-end sm:self-auto"
                            onClick={() => removeCondition(idx)}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Error message notice if any */}
                {errorMsg && (
                  <div className="p-md bg-error/10 text-error rounded-xl text-xs font-semibold border border-error/20">
                    Error: {errorMsg}
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                  <button 
                    className="px-md py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-lg font-bold text-xs transition-all flex items-center gap-xs"
                    onClick={addCondition}
                  >
                    <span className="material-symbols-outlined text-sm">add</span> Tambah Indikator Baru
                  </button>
                  <button 
                    className="px-lg py-2 bg-[#2E7D32] text-white rounded-lg font-bold text-xs hover:bg-[#2E7D32]/95 transition-all flex items-center gap-sm shadow"
                    onClick={executeQuery}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                        <span>Mengeksekusi...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">play_arrow</span> 
                        <span>Jalankan Kueri Analisis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Database Results Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h4 className="font-title-md text-on-surface font-semibold">
                    Hasil Pencarian Terpilih ({totalRows.toLocaleString("id-ID")} Baris Cocok)
                  </h4>
                  <span className="text-xs text-[#2E7D32] bg-[#2E7D32]/10 px-sm py-1 rounded font-bold">
                    Estimasi Eksekusi: {executionTime} detik
                  </span>
                </div>
                <div className="flex-1 overflow-auto">
                  {results.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-on-surface-variant text-sm">
                      Kueri tidak mengembalikan data apa pun. Coba kurangi filter kondisi.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low sticky top-0 shadow-sm z-10">
                        <tr>
                          {displayCols.map((col) => (
                            <th key={col} className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">
                              {col.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {results.map((row, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                            {displayCols.map((col) => (
                              <td key={col} className="px-md py-md text-xs font-semibold max-w-[150px] truncate">
                                {col === "id_ruta" ? (
                                  <span className="font-data-mono text-[#0F4C81]">{String(row[col])}</span>
                                ) : (col === "target" || col === "b4_k3") ? (
                                  <span className={`px-sm py-0.5 rounded font-bold text-[10px] ${
                                    row[col] <= 2 ? "bg-error/15 text-error" : "bg-warning/15 text-warning"
                                  }`}>
                                    DESIL {row[col]}
                                  </span>
                                ) : (
                                  String(row[col] ?? "-")
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
              <p className="font-label-caps text-on-surface-variant text-xs">Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}


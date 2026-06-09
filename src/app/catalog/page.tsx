"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface TableMeta {
  tableName: string;
  rows: number;
  columns: number;
}

interface Dataset {
  id: string;
  name: string;
  fileName: string;
  sizeMB: string;
  lastModified: string;
  owner: string;
  quality: string;
  description?: string;
  tables: TableMeta[];
}

export default function Page() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedDataset, setExpandedDataset] = useState<string | null>(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/catalog");
      const data = await res.json();
      if (data.success) {
        setDatasets(data.datasets || []);
      }
    } catch (err) {
      console.error("Failed to load catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDatasets = datasets.filter((d) => {
    const term = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      d.owner.toLowerCase().includes(term) ||
      (d.description && d.description.toLowerCase().includes(term)) ||
      d.tables.some((t) => t.tableName.toLowerCase().includes(term))
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedDataset(expandedDataset === id ? null : id);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus dataset "${name}"? Tindakan ini juga akan menghapus file fisik di server.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/catalog?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDatasets(datasets.filter((d) => d.id !== id));
        if (expandedDataset === id) {
          setExpandedDataset(null);
        }
      } else {
        alert(data.error || "Gagal menghapus dataset.");
      }
    } catch (err) {
      console.error("Error deleting dataset:", err);
      alert("Terjadi kesalahan koneksi saat menghapus dataset.");
    }
  };


  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="catalog" />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
          <div className="flex flex-col">
            <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
              <span>Data Explorer</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">Katalog Dataset Nasional</span>
            </nav>
            <h2 className="font-title-md text-primary leading-tight font-bold">Katalog Data {"&"} Metadata Terpadu</h2>
          </div>
        </header>

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
          {/* Controls Bar */}
          <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm flex flex-col md:flex-row gap-md justify-between items-center">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="Cari dataset, indikator, atau nama tabel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-sm w-full md:w-auto">
              <Link 
                href="/upload" 
                className="bg-[#0F4C81] text-white px-md py-1.5 rounded text-xs font-bold hover:bg-[#0F4C81]/90 flex items-center gap-xs transition-all"
              >
                <span className="material-symbols-outlined text-sm">cloud_upload</span> Unggah Dataset Baru
              </Link>
            </div>
          </div>

          {/* Dataset Table Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h4 className="font-title-md text-on-surface font-semibold">Daftar Dataset Terdaftar</h4>
              <span className="text-xs text-on-surface-variant font-semibold">
                {filteredDatasets.length} Dataset Tersedia
              </span>
            </div>

            {loading ? (
              <div className="p-xl text-center text-on-surface-variant text-sm">
                Memuat katalog dataset...
              </div>
            ) : filteredDatasets.length === 0 ? (
              <div className="p-xl text-center text-on-surface-variant text-sm">
                Belum ada dataset yang terdaftar. Gunakan menu Unggah Dataset Baru untuk memasukkan database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low">
                    <tr>
                      <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Nama File / Dataset</th>
                      <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Ukuran File</th>
                      <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Wali Data / Owner</th>
                      <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Terakhir Diperbarui</th>
                      <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Kualitas</th>
                      <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredDatasets.map((dataset) => (
                      <React.Fragment key={dataset.id}>
                        <tr className="hover:bg-surface-container-low transition-colors">
                          <td className="px-md py-lg">
                            <div className="flex flex-col">
                              <span
                                onClick={() => toggleExpand(dataset.id)}
                                className="font-body-sm font-bold text-on-surface hover:text-[#0F4C81] cursor-pointer flex items-center gap-xs"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {expandedDataset === dataset.id ? "expand_more" : "chevron_right"}
                                </span>
                                {dataset.name}
                              </span>
                              <span className="text-[11px] text-on-surface-variant mt-1 pl-5">
                                {dataset.description || (dataset.tables.length > 0 
                                  ? `Dataset SQLite berisi ${dataset.tables.length} tabel. Klik nama file untuk melihat skema tabel.`
                                  : `Berkas dokumen terdaftar. Klik nama file untuk melihat detail berkas.`)
                                }
                              </span>
                            </div>
                          </td>
                          <td className="px-md py-lg text-sm text-on-surface-variant">{dataset.sizeMB} MB</td>
                          <td className="px-md py-lg text-sm font-semibold text-primary">{dataset.owner}</td>
                          <td className="px-md py-lg text-sm text-on-surface-variant">{dataset.lastModified}</td>
                          <td className="px-md py-lg">
                            <span className="px-sm py-0.5 bg-success/10 text-success font-bold text-[10px] rounded-full">
                              {dataset.quality}
                            </span>
                          </td>
                          <td className="px-md py-lg text-center">
                            <div className="flex gap-sm justify-center">
                              <button
                                onClick={() => toggleExpand(dataset.id)}
                                className="p-1 hover:bg-surface-container-high rounded border border-outline-variant text-on-surface-variant"
                                title="Lihat Detail Tabel"
                              >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                              </button>
                              <a
                                href={`/api/download?id=${dataset.id}`}
                                download
                                className="p-1 hover:bg-surface-container-high rounded border border-outline-variant text-on-surface-variant flex items-center justify-center"
                                title="Unduh File"
                              >
                                <span className="material-symbols-outlined text-sm">download</span>
                              </a>
                              <button
                                onClick={() => handleDelete(dataset.id, dataset.name)}
                                className="p-1 hover:bg-error/10 rounded border border-error/30 text-error transition-colors"
                                title="Hapus Dataset"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Tables Info */}
                        {expandedDataset === dataset.id && (
                          <tr>
                            <td colSpan={6} className="bg-surface-container-low/40 px-lg py-md">
                              <div className="border border-outline-variant rounded-lg bg-surface-container-lowest p-md space-y-sm">
                                <h5 className="text-xs font-bold font-label-caps text-[#0F4C81] flex items-center gap-xs">
                                  <span className="material-symbols-outlined text-sm">
                                    {dataset.tables.length > 0 ? "table_chart" : "description"}
                                  </span>
                                  {dataset.tables.length > 0 ? "Skema Tabel Database" : "Detail Dokumen"}
                                </h5>
                                {dataset.tables.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-xs">
                                    {dataset.tables.map((table) => (
                                      <div 
                                        key={table.tableName}
                                        className="p-sm border border-outline-variant rounded-md bg-surface-container-low flex justify-between items-center"
                                      >
                                        <div>
                                          <p className="text-xs font-bold text-on-surface">{table.tableName}</p>
                                          <p className="text-[10px] text-on-surface-variant mt-0.5">
                                            {table.columns} Kolom Terdeteksi
                                          </p>
                                        </div>
                                        <span className="px-sm py-0.5 bg-secondary-container/10 text-secondary font-bold text-[10px] rounded">
                                          {table.rows.toLocaleString()} Baris Data
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-sm text-xs text-on-surface-variant leading-relaxed">
                                    Tidak ada skema tabel terstruktur yang diekstrak untuk file ini. Berkas dipertahankan dalam server untuk kebutuhan akses dokumen dan unduhan referensi.
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

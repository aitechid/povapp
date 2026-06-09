"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const allowedExtensions = [".db", ".sqlite", ".csv", ".xlsx", ".xls", ".json", ".pdf", ".zip", ".txt", ".docx", ".doc"];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Format file tidak valid. Silakan unggah dokumen yang didukung (${allowedExtensions.join(", ")}).`);
      setStatus("error");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setSuccessMessage(`Berhasil mengunggah ${file.name}. Berkas telah terdaftar.`);
        setFile(null);
        setDescription("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Gagal mengunggah file.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Terjadi kesalahan koneksi saat mengunggah file.");
    }
  };

  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="upload" />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
          <div className="flex flex-col">
            <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
              <span>Data Management</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">Upload Dataset Wizard</span>
            </nav>
            <h2 className="font-title-md text-primary leading-tight font-bold">Unggah Dataset Survei Baru</h2>
          </div>
        </header>

        <div className="p-margin max-w-3xl mx-auto w-full space-y-lg flex-1">
          {/* Progress Steps */}
          <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm flex justify-between items-center text-xs font-bold font-label-caps text-outline">
            <div className="flex items-center gap-sm text-[#0F4C81]">
              <span className="w-6 h-6 rounded-full bg-[#0F4C81]/15 flex items-center justify-center">1</span>
              <span>Upload File</span>
            </div>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <div className="flex items-center gap-sm">
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">2</span>
              <span>Mapping</span>
            </div>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <div className="flex items-center gap-sm">
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">3</span>
              <span>Validation</span>
            </div>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <div className="flex items-center gap-sm">
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">4</span>
              <span>Metadata</span>
            </div>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <div className="flex items-center gap-sm">
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">5</span>
              <span>Submit</span>
            </div>
          </div>

          {/* Upload Box */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg flex flex-col gap-lg">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".db,.sqlite,.csv,.xlsx,.xls,.json,.pdf,.zip,.txt,.docx,.doc" 
            />

            <div 
              className={`border-2 border-dashed rounded-xl p-xl flex flex-col items-center justify-center bg-surface-container-low cursor-pointer transition-colors group ${
                file ? "border-success" : "border-outline-variant hover:border-[#0F4C81]"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
            >
              {status === "uploading" ? (
                <div className="flex flex-col items-center py-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-md"></div>
                  <p className="font-bold text-primary">Mengunggah dan Menganalisis Dokumen...</p>
                  <p className="text-xs text-on-surface-variant mt-xs">Membaca berkas dan mengekstrak properti metadata...</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-5xl text-success mb-md">draft</span>
                  <p className="font-bold text-success">File Terpilih: {file.name}</p>
                  <p className="text-xs text-on-surface-variant mt-xs">Ukuran: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}
                    className="mt-md px-md py-1 border border-outline-variant rounded font-semibold text-xs text-on-surface hover:bg-surface-container transition-all"
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant group-hover:text-[#0F4C81] mb-md transition-colors">cloud_upload</span>
                  <p className="font-bold text-primary">Seret {"&"} Lepaskan file dokumen di sini</p>
                  <p className="text-xs text-on-surface-variant mt-xs">Mendukung .db, .sqlite, .csv, .xlsx, .xls, .json, .pdf, .zip, .txt, .docx, .doc (Maks. 50MB)</p>
                  <button className="mt-md px-md py-2 bg-[#0F4C81] text-white rounded font-bold text-xs hover:bg-[#0F4C81]/95 transition-all">Pilih File Manual</button>
                </div>
              )}
            </div>

            {file && status !== "uploading" && (
              <div className="flex flex-col gap-sm border border-outline-variant p-md rounded-xl bg-surface-container-low">
                <label className="text-xs font-bold font-label-caps text-on-surface-variant">
                  Deskripsi / Keterangan Dataset
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan keterangan mengenai cakupan wilayah, tahun data, atau instansi pembuat dataset ini..."
                  className="w-full min-h-[80px] text-xs p-sm rounded bg-surface border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>
            )}

            {/* Alert Notifications */}
            {status === "error" && (
              <div className="p-md bg-error/10 border-l-4 border-error rounded text-xs flex gap-sm text-on-surface">
                <span className="material-symbols-outlined text-error">error</span>
                <div>
                  <p className="font-bold">Gagal Mengunggah</p>
                  <p className="mt-xs leading-relaxed text-on-surface-variant">{errorMessage}</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="p-md bg-success/10 border-l-4 border-success rounded text-xs flex gap-sm text-on-surface">
                <span className="material-symbols-outlined text-success">check_circle</span>
                <div>
                  <p className="font-bold">Unggahan Berhasil</p>
                  <p className="mt-xs leading-relaxed text-on-surface-variant">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Guidelines Card */}
            <div className="p-md bg-warning/10 border-l-4 border-warning rounded text-xs flex gap-sm text-on-surface">
              <span className="material-symbols-outlined text-warning">warning</span>
              <div>
                <p className="font-bold">Ketentuan Ingestion Satu Data AitechID</p>
                <p className="mt-xs leading-relaxed text-on-surface-variant">Pastikan file menyertakan kolom primer Kode Wilayah (Kemendagri/BPS) serta format kolom tanggal bertipe ISO 8601 (YYYY-MM-DD).</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center border-t border-outline-variant pt-lg">
              <Link href="/catalog" className="px-md py-2 hover:bg-surface-container rounded font-bold text-xs text-on-surface-variant">
                Kembali ke Katalog
              </Link>
              <button 
                onClick={handleUpload}
                disabled={!file || status === "uploading"}
                className={`px-md py-2 bg-[#0F4C81] text-white rounded font-bold text-xs hover:bg-[#0F4C81]/95 transition-all ${
                  (!file || status === "uploading") ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Mulai Proses Ingestion
              </button>
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

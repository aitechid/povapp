"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  const [activeTab, setActiveTab] = React.useState("profile");
  return (
    <div className="min-h-screen bg-background pl-64 relative">
      
      

<Sidebar activePage="profile" />

<div className="flex flex-col min-h-screen">

<header className="fixed top-0 left-64 right-0 h-16 bg-surface/60 backdrop-blur-md border-b border-outline-variant z-50 flex justify-between items-center px-margin shadow-sm">
<div className="flex items-center gap-md">
<div className="flex items-center gap-xs text-on-surface-variant font-label-caps text-label-caps">
<span>Administrasi</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
<span className="text-primary font-bold">Pengaturan Profil</span>
</div>
</div>
<div className="flex items-center gap-lg">
<div className="flex gap-md border-r border-outline-variant pr-lg">
<button className="text-on-surface-variant hover:bg-surface-container-high/50 p-base rounded-full transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:bg-surface-container-high/50 p-base rounded-full transition-all">
<span className="material-symbols-outlined">help_outline</span>
</button>
</div>
<div className="flex items-center gap-sm">
<img className="w-8 h-8 rounded-full border border-primary/20 object-cover" data-alt="Professional headshot of a senior government analyst with graying hair, wearing a clean navy blue suit and a crisp white shirt, posing against a neutral institutional background in soft, natural morning light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0P_YfhhQYgK4MKRzJ7FHKP2BZ6CfJbub_vFYWsN550UsdLrtxqKs7foxFeojcUxNdsRHZRrTbPqYbJQqopxdggThh4Y3tUfZWgcNmCNBanRRWwU5j9yNeFPiufuHx2uLXpa51yg0WOOv-QjFEwgoIqWYF7Q1YnyqckCpC4t3Ykbso8dlb1D_dhgBkxD9R2qwLw_iGchqTytJDl7Y0GJsSVMQcX9oobiNsV8aDywdFWdPLrwCTN_ihcgnVZhMfj4xrnfwBI1in4i8"/>
<span className="font-body-sm text-body-sm font-semibold">Dr. Hartono</span>
</div>
</div>
</header>

<main className="mt-16 p-lg flex-1 bg-background">
<div className="max-w-7xl mx-auto grid grid-cols-12 gap-gutter">

<div className="col-span-12 md:col-span-4 space-y-gutter">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
<div className="flex flex-col items-center text-center">
<div className="relative mb-md">
<img className="w-32 h-32 rounded-full border-4 border-surface shadow-md object-cover" data-alt="Close-up portrait of an authoritative male government official in his late 40s, exuding intelligence and stability. He wears a corporate blue suit, captured with high-end camera equipment using shallow depth of field in a modern glass office environment with cool blue tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWQX9n37nOd4IEu8z1ofpYB3Cvu-1qUQPwarhemh7GWTnLRdCQREksj7hHnKriqcgCCZPDW6me69ewG13jmM_zpJQckCPeZ4KB-Ds2iQUbYHwI0G906THb857YSuQ9dfSQwXah9r4vHlx4rNVOyI4cEtq1S3k9oDWWx9ZVGAvTi_WEztACv1E3Tmz2yiMZ_7vQEdTa1RWQzuTD0OR2wmOqWTB_dfk2WGUb_kib4T28Pr-p7EBO9gUNuZLcxFlHCJix1aSj6IX4pWI"/>
<div className="absolute bottom-0 right-0 bg-secondary p-1 rounded-full border-2 border-surface">
<span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
</div>
<h2 className="font-title-md text-title-md text-primary">Dr. Hartono Prasetyo</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-md">NIP: 198402122008011003</p>
<div className="bg-primary/5 rounded-full px-md py-xs mb-lg flex items-center gap-xs">
<span className="material-symbols-outlined text-primary text-[18px]">gavel</span>
<span className="font-label-caps text-label-caps text-primary">Verified Government Account</span>
</div>
<div className="w-full space-y-sm text-left pt-lg border-t border-outline-variant">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block">Instansi</span>
<span className="font-body-md text-body-md font-medium">AitechID</span>
</div>
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block">Unit Kerja</span>
<span className="font-body-md text-body-md font-medium text-wrap">Bidang Analisis Kemiskinan</span>
</div>
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block">Peran Sistem</span>
<span className="font-body-md text-body-md font-medium">Data Steward / Administrator</span>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-high rounded-xl p-md flex items-start gap-md border border-outline-variant/50">
<span className="material-symbols-outlined text-primary">info</span>
<div>
<p className="font-label-caps text-label-caps text-primary mb-xs">STATUS AKUN</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Terakhir masuk: 24 Mei 2024, 08:42 WIB melalui perangkat Jakarta (IP: 10.22.x.x)</p>
</div>
</div>
</div>

<div className="col-span-12 md:col-span-8">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col h-full">

<div className="px-lg pt-lg border-b border-outline-variant">
<div className="flex gap-lg">
<button className={`pb-md font-body-md text-body-md font-semibold transition-all flex items-center gap-sm ${activeTab === 'profile' ? 'active-tab border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`} id="tab-profile" onClick={() => setActiveTab('profile')}>
<span className="material-symbols-outlined text-[20px]">person</span>
                                    Informasi Profil
                                </button>
<button className={`pb-md font-body-md text-body-md transition-all flex items-center gap-sm ${activeTab === 'security' ? 'active-tab border-b-2 border-primary text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'}`} id="tab-security" onClick={() => setActiveTab('security')}>
<span className="material-symbols-outlined text-[20px]">security</span>
                                    Keamanan
                                </button>
<button className={`pb-md font-body-md text-body-md transition-all flex items-center gap-sm ${activeTab === 'notifications' ? 'active-tab border-b-2 border-primary text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'}`} id="tab-notifications" onClick={() => setActiveTab('notifications')}>
<span className="material-symbols-outlined text-[20px]">notifications</span>
                                    Preferensi Notifikasi
                                </button>
</div>
</div>

<div className="p-lg flex-1">

<div className={activeTab === 'profile' ? "space-y-lg" : "hidden"} id="content-profile">
<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant">Nama Lengkap</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" type="text" value="Dr. Hartono Prasetyo"/>
</div>
<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant">Nomor Induk Pegawai (NIP)</label>
<input className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md cursor-not-allowed opacity-70" disabled type="text" value="198402122008011003"/>
</div>
<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant">Alamat Email Kerja</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" type="email" value="hartono.prasetyo@aitech.id"/>
</div>
<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant">Nomor Telepon</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" type="tel" value="+62 811 2233 4455"/>
</div>
<div className="space-y-xs col-span-2">
<label className="font-label-caps text-label-caps text-on-surface-variant">Instansi Pemerintahan</label>
<input className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md cursor-not-allowed opacity-70" disabled type="text" value="AitechID"/>
</div>
<div className="space-y-xs col-span-2">
<label className="font-label-caps text-label-caps text-on-surface-variant">Bidang / Unit Kerja</label>
<select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all appearance-none">
<option>Bidang Analisis Kemiskinan</option>
<option>Biro Hubungan Masyarakat</option>
<option>Pusat Data dan Informasi</option>
<option>Direktorat Pengentasan Kemiskinan</option>
</select>
</div>
</div>
</div>

<div className={activeTab === 'security' ? "space-y-lg" : "hidden"} id="content-security">
<div className="bg-surface-container border border-outline-variant p-md rounded-xl flex justify-between items-center">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary text-[32px]">password</span>
<div>
<p className="font-body-md text-body-md font-semibold">Kata Sandi</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Terakhir diubah 3 bulan yang lalu</p>
</div>
</div>
<button className="px-md py-xs border border-primary text-primary rounded-lg font-body-sm text-body-sm font-semibold hover:bg-primary/5 transition-all">Ubah Sandi</button>
</div>
<div className="bg-surface-container border border-outline-variant p-md rounded-xl flex justify-between items-center">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary text-[32px]">shield_person</span>
<div>
<p className="font-body-md text-body-md font-semibold">Multi-Factor Authentication (MFA)</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Status: <span className="text-secondary font-bold">AKTIF</span> (Email {"&"} SMS)</p>
</div>
</div>
<button className="px-md py-xs border border-outline text-on-surface-variant rounded-lg font-body-sm text-body-sm font-semibold hover:bg-surface-container-highest transition-all">Kelola MFA</button>
</div>
</div>

<div className={activeTab === 'notifications' ? "space-y-md" : "hidden"} id="content-notifications">
<p className="font-body-md text-body-md text-on-surface-variant">Atur bagaimana sistem memberikan pemberitahuan kepada Anda.</p>
<div className="space-y-sm">
<label className="flex items-center gap-md p-md hover:bg-surface-container-low rounded-xl cursor-pointer">
<input defaultChecked className="w-5 h-5 text-primary focus:ring-primary border-outline rounded" type="checkbox"/>
<div>
<p className="font-body-md text-body-md font-medium">Laporan Analisis Bulanan</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Kirim ringkasan data kemiskinan setiap awal bulan melalui email.</p>
</div>
</label>
<label className="flex items-center gap-md p-md hover:bg-surface-container-low rounded-xl cursor-pointer">
<input defaultChecked className="w-5 h-5 text-primary focus:ring-primary border-outline rounded" type="checkbox"/>
<div>
<p className="font-body-md text-body-md font-medium">Alert Anomali Data</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Berikan notifikasi langsung jika terdeteksi perubahan data signifikan di wilayah pantauan.</p>
</div>
</label>
</div>
</div>
</div>

<div className="p-lg bg-surface-container-low border-t border-outline-variant flex justify-end gap-md rounded-b-xl">
<button className="px-xl py-md text-on-surface-variant border border-outline-variant rounded-lg font-body-md text-body-md font-semibold hover:bg-surface-container-high transition-all">Batal</button>
<button className="px-xl py-md bg-primary-container text-white rounded-lg font-body-md text-body-md font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all">Simpan Perubahan</button>
</div>
</div>
</div>
</div>
</main>

<footer className="w-full py-lg mt-auto bg-surface-container-lowest border-t border-outline-variant">
<div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto gap-md">
<div className="flex flex-col md:items-start items-center">
<span className="font-bold text-on-surface text-label-caps">PORTAL ANALISIS</span>
<p className="font-label-caps text-label-caps text-on-surface-variant">Hak Cipta © 2026 AitechID. Republik Indonesia</p>
</div>
<div className="flex gap-lg font-label-caps text-label-caps">
<a className="text-on-surface-variant hover:text-primary transition-all" href="#">Kebijakan Privasi</a>
<a className="text-on-surface-variant hover:text-primary transition-all" href="#">Syarat {"&"} Ketentuan</a>
<a className="text-on-surface-variant hover:text-primary transition-all" href="#">Hubungi Kami</a>
</div>
</div>
</footer>
</div>


    
    </div>
  );
}

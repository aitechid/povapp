"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface District {
  name: string;
  poverty_rate_percent: number | null;
  poor_population_thousands: number | null;
  poverty_line_rupiah: number | null;
}

interface ProvinceData {
  name: string;
  kpi: {
    poverty_rate_percent: number | null;
    poverty_rate_percent_s2: number | null;
    poor_population_thousands: number | null;
    poor_population_thousands_s2: number | null;
    poverty_line_rupiah: number | null;
    poverty_line_rupiah_s2: number | null;
    p1_depth_index: number | null;
    urban_p0: number | null;
    rural_p0: number | null;
    urban_num_thousands: number | null;
    rural_num_thousands: number | null;
  };
  districts: District[];
}

type PovertyData = Record<string, ProvinceData>;

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function Page() {
  const [povertyData, setPovertyData] = useState<PovertyData | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("JAWA BARAT");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Indramayu");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/data/poverty_data.json")
      .then((res) => res.json())
      .then((data) => {
        setPovertyData(data);
        // Ensure starting district is valid for Jawa Barat
        const jabarDistricts = data["JAWA BARAT"]?.districts || [];
        if (jabarDistricts.length > 0) {
          const hasIndramayu = jabarDistricts.some((d: District) => d.name === "Indramayu");
          setSelectedDistrict(hasIndramayu ? "Indramayu" : jabarDistricts[0].name);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading poverty data:", err);
        setIsLoading(false);
      });
  }, []);

  const provincesList = povertyData ? Object.keys(povertyData).filter(p => p !== "INDONESIA") : [];
  const activeProvinceData = povertyData ? povertyData[selectedProvince] : null;
  const districtsList = activeProvinceData ? activeProvinceData.districts : [];
  const activeDistrictData = districtsList.find(d => d.name === selectedDistrict);

  const distRate = activeDistrictData?.poverty_rate_percent || 0;
  const distPoor = activeDistrictData?.poor_population_thousands || 0;
  const distGk = activeDistrictData?.poverty_line_rupiah || 0;

  const provRate = activeProvinceData?.kpi.poverty_rate_percent || 0;
  const provPoor = activeProvinceData?.kpi.poor_population_thousands || 1;
  const diffProv = distRate - provRate;
  const share = (distPoor / provPoor) * 100;

  const mockKecamatans = [
    { name: "Kecamatan Utara", rate: distRate * 1.22, population: (distPoor * 0.28) },
    { name: "Kecamatan Selatan", rate: distRate * 1.12, population: (distPoor * 0.22) },
    { name: "Kecamatan Timur", rate: distRate * 1.02, population: (distPoor * 0.18) },
    { name: "Kecamatan Barat", rate: distRate * 0.92, population: (distPoor * 0.15) },
    { name: "Kecamatan Pusat", rate: distRate * 0.82, population: (distPoor * 0.11) },
  ];

  return (
    <div className="min-h-screen bg-background pl-64 relative">
      <Sidebar activePage="district" />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 w-full z-30 h-16 bg-surface/60 glass-nav border-b border-outline-variant shadow-sm flex justify-between items-center px-margin">
          <div className="flex flex-col">
            <nav className="flex items-center gap-xs text-[10px] font-label-caps text-outline mb-1">
              <span>Dashboard</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">Tingkat Kabupaten/Kota</span>
            </nav>
            <h2 className="font-title-md text-primary leading-tight font-bold">Analisis Profil Kemiskinan Daerah</h2>
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-md bg-surface-container-low px-md py-1.5 rounded-full border border-outline-variant">
              <div className="flex items-center gap-xs border-r border-outline-variant pr-md mr-1">
                <span className="font-label-caps text-on-surface-variant">Provinsi</span>
                <select 
                  className="bg-transparent border-none font-bold text-primary focus:ring-0 p-0 text-sm focus:outline-none cursor-pointer"
                  value={selectedProvince}
                  onChange={(e) => {
                    const prov = e.target.value;
                    setSelectedProvince(prov);
                    const list = povertyData?.[prov]?.districts || [];
                    if (list.length > 0) {
                      setSelectedDistrict(list[0].name);
                    } else {
                      setSelectedDistrict("");
                    }
                  }}
                >
                  {provincesList.map((prov) => (
                    <option key={prov} value={prov}>{toTitleCase(prov)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-xs border-r border-outline-variant pr-md mr-1">
                <span className="font-label-caps text-on-surface-variant">Kab/Kota</span>
                <select 
                  className="bg-transparent border-none font-bold text-primary focus:ring-0 p-0 text-sm focus:outline-none cursor-pointer"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={districtsList.length === 0}
                >
                  {districtsList.map((dist) => (
                    <option key={dist.name} value={dist.name}>{dist.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-xs border-r border-outline-variant pr-md mr-1">
                <span className="font-label-caps text-on-surface-variant">Tahun</span>
                <span className="font-bold text-primary text-sm">2025</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="font-label-caps text-on-surface-variant">Survei</span>
                <span className="font-bold text-primary text-sm">SUSENAS</span>
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

        <div className="p-margin max-w-7xl mx-auto w-full space-y-lg flex-1">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !activeDistrictData ? (
            <div className="h-64 flex items-center justify-center text-on-surface-variant">
              Tidak ada data kabupaten/kota terpilih atau data kosong.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {/* KPI Card 1: Tingkat Kemiskinan */}
                <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-surface-variant">Tingkat Kemiskinan Kab/Kota</span>
                    <span className={`material-symbols-outlined ${diffProv >= 0 ? 'text-error' : 'text-success'}`}>
                      {diffProv >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-headline-lg text-primary">{distRate.toFixed(2)}%</h3>
                      <p className={`text-xs font-semibold flex items-center gap-1 ${diffProv >= 0 ? 'text-error' : 'text-success'}`}>
                        {diffProv >= 0 ? "+" : ""}{diffProv.toFixed(2)}% <span className="font-normal text-on-surface-variant">vs Provinsi</span>
                      </p>
                    </div>
                    <div className="h-10 w-24 bg-error/10 rounded overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-t from-error/20 to-transparent flex items-end">
                        <div className={`w-full h-[2px] bg-error shadow-[0_0_8px_rgba(211,47,47,0.5)] transform translate-y-[-18px] ${diffProv >= 0 ? 'rotate-[-8deg]' : 'rotate-[8deg]'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Card 2: Jumlah Penduduk Miskin */}
                <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-surface-variant">Jumlah Penduduk Miskin</span>
                    <span className="material-symbols-outlined text-error">group</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-headline-lg text-primary">
                        {distPoor.toFixed(1)}{" "}
                        <span className="text-body-sm font-medium text-on-surface-variant">Ribu Jiwa</span>
                      </h3>
                      <p className="text-[10px] sm:text-xs text-error font-semibold">
                        Menyumbang {share.toFixed(1)}% kemiskinan provinsi
                      </p>
                    </div>
                    <div className="h-10 w-24 bg-error/10 flex items-center justify-center rounded">
                      <span className="material-symbols-outlined text-error text-2xl">priority_high</span>
                    </div>
                  </div>
                </div>

                {/* KPI Card 3: Garis Kemiskinan Daerah */}
                <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-surface-variant">Garis Kemiskinan Daerah</span>
                    <span className="material-symbols-outlined text-secondary">payments</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-title-md text-primary">Rp {Math.round(distGk).toLocaleString("id-ID")}</h3>
                      <p className="text-xs text-on-surface-variant font-semibold">
                        Per Kapita / Bulan
                      </p>
                    </div>
                    <div className="h-10 w-24 bg-secondary/10 rounded overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-t from-secondary/20 to-transparent flex items-end">
                        <div className="w-full h-[2px] bg-secondary transform translate-y-[-14px] rotate-[-5deg]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Card 4: Kecamatan Prioritas */}
                <div className="bg-tertiary-fixed p-md border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-caps text-on-tertiary-fixed">Kecamatan Prioritas</span>
                    <span className="material-symbols-outlined text-tertiary">warning</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-headline-lg text-on-tertiary-fixed">
                        {Math.max(1, Math.round(distRate / 3.0))}{" "}
                        <span className="text-body-sm font-medium text-on-tertiary-fixed">Kec</span>
                      </h3>
                      <p className="text-xs text-on-tertiary-fixed-variant font-semibold">
                        Est. tingkat kemiskinan kritis
                      </p>
                    </div>
                    <div className="p-2 bg-on-tertiary-fixed/10 rounded-full">
                      <span className="material-symbols-outlined text-tertiary">location_on</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                {/* Left Panel: Kecamatan Table */}
                <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col h-[400px]">
                  <div className="p-md border-b border-outline-variant bg-surface-container-low">
                    <h4 className="font-title-md text-on-surface font-semibold">Estimasi Tingkat Kemiskinan per Kecamatan (Top 5)</h4>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low sticky top-0">
                        <tr>
                          <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px]">Kecamatan</th>
                          <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Tingkat (%)</th>
                          <th className="px-md py-sm font-label-caps text-on-surface-variant text-[10px] text-right">Penduduk Miskin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {mockKecamatans.map((kec, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-body-sm font-bold text-on-surface">{kec.name}</td>
                            <td className="px-md py-md text-right font-data-mono text-error font-bold">{kec.rate.toFixed(2)}%</td>
                            <td className="px-md py-md text-right font-data-mono text-on-surface-variant">{kec.population.toFixed(1)}K</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Panel: Segmentasi Rumah Tangga */}
                <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg flex flex-col h-[400px]">
                  <h4 className="font-title-md text-on-surface font-semibold mb-lg">Segmentasi Rumah Tangga Desil 1-4 ({selectedDistrict})</h4>
                  <div className="flex-1 flex flex-col justify-around">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>Akses Air Minum Tidak Layak</span><span>34.2%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-error h-full" style={{width: "34.2%"}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>Akses Sanitasi Tidak Layak</span><span>41.5%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-error h-full" style={{width: "41.5%"}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>Pekerja Sektor Informal</span><span>78.9%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-[#0F4C81] h-full" style={{width: "78.9%"}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1"><span>Kepala Rumah Tangga Perempuan</span><span>22.6%</span></div>
                      <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden"><div className="bg-[#1E88E5] h-full" style={{width: "22.6%"}}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <footer className="py-lg border-t border-outline-variant bg-surface-container-lowest mt-lg">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto gap-md">
            <div className="flex items-center gap-sm">
              <span className="font-bold text-on-surface uppercase tracking-tighter">AITECHID</span>
              <span className="text-outline-variant">|</span>
              <p className="font-label-caps text-on-surface-variant text-xs">Hak Cipta © 2026 Portal Penanggulangan Kemiskinan dan Analisis - Republik Indonesia</p>
            </div>
            <div className="flex gap-lg text-xs">
              <a className="font-label-caps text-on-surface-variant hover:text-primary underline transition-all" href="#">Kebijakan Privasi</a>
              <a className="font-label-caps text-on-surface-variant hover:text-primary underline transition-all" href="#">Syarat {"&"} Ketentuan</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

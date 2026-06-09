"use client";

import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Sample coordinates and 2026 poverty statistics for major Indonesian provinces
const provinceData = [
  { name: "Aceh", coords: [4.695135, 96.749399], rate: 14.43, poorCount: "810.4K", category: "High" },
  { name: "Sumatera Utara", coords: [2.115354, 99.545097], rate: 8.15, poorCount: "1.2M", category: "Moderate" },
  { name: "Sumatera Barat", coords: [-0.73994, 100.808651], rate: 5.95, poorCount: "340K", category: "Low" },
  { name: "Riau", coords: [0.293347, 101.706825], rate: 6.68, poorCount: "480K", category: "Low" },
  { name: "Jambi", coords: [-1.61862, 102.778961], rate: 7.58, poorCount: "280K", category: "Moderate" },
  { name: "Sumatera Selatan", coords: [-3.319437, 103.914398], rate: 11.78, poorCount: "1.05M", category: "Moderate" },
  { name: "Bengkulu", coords: [-3.792845, 102.260764], rate: 14.12, poorCount: "290K", category: "High" },
  { name: "Lampung", coords: [-4.558585, 105.402344], rate: 11.10, poorCount: "970K", category: "Moderate" },
  { name: "DKI Jakarta", coords: [-6.211544, 106.845172], rate: 4.44, poorCount: "480K", category: "Low" },
  { name: "Jawa Barat", coords: [-6.914744, 107.60981], rate: 7.62, poorCount: "3.8M", category: "Moderate" },
  { name: "Jawa Tengah", coords: [-7.150975, 110.140259], rate: 10.47, poorCount: "3.7M", category: "Moderate" },
  { name: "DI Yogyakarta", coords: [-7.875385, 110.426208], rate: 11.04, poorCount: "450K", category: "Moderate" },
  { name: "Jawa Timur", coords: [-7.536064, 112.238402], rate: 10.35, poorCount: "4.1M", category: "Moderate" },
  { name: "Banten", coords: [-6.405817, 106.060018], rate: 6.12, poorCount: "810K", category: "Low" },
  { name: "Bali", coords: [-8.409518, 115.188919], rate: 4.25, poorCount: "190K", category: "Low" },
  { name: "Nusa Tenggara Barat", coords: [-8.652933, 117.361648], rate: 13.82, poorCount: "730K", category: "High" },
  { name: "Nusa Tenggara Timur", coords: [-8.657382, 121.07937], rate: 19.96, poorCount: "1.1M", category: "Critical" },
  { name: "Kalimantan Barat", coords: [-0.278781, 111.475285], rate: 6.71, poorCount: "350K", category: "Low" },
  { name: "Kalimantan Tengah", coords: [-1.681488, 113.382355], rate: 5.25, poorCount: "140K", category: "Low" },
  { name: "Kalimantan Selatan", coords: [-3.092642, 115.283759], rate: 4.38, poorCount: "190K", category: "Low" },
  { name: "Kalimantan Timur", coords: [0.538659, 116.419389], rate: 6.11, poorCount: "240K", category: "Low" },
  { name: "Sulawesi Utara", coords: [0.624693, 123.975005], rate: 7.21, poorCount: "190K", category: "Moderate" },
  { name: "Sulawesi Tengah", coords: [-1.430025, 121.445618], rate: 12.33, poorCount: "390K", category: "High" },
  { name: "Sulawesi Selatan", coords: [-4.14491, 120.125961], rate: 8.57, poorCount: "790K", category: "Moderate" },
  { name: "Sulawesi Tenggara", coords: [-4.124689, 122.078827], rate: 11.20, poorCount: "310K", category: "Moderate" },
  { name: "Maluku", coords: [-3.238461, 130.145273], rate: 17.44, poorCount: "312.2K", category: "High" },
  { name: "Papua", coords: [-4.269928, 138.080353], rate: 26.03, poorCount: "255.8K", category: "Critical" },
  { name: "Papua Tengah", coords: [-3.989269, 136.213379], rate: 29.82, poorCount: "382.4K", category: "Critical" },
  { name: "Papua Pegunungan", coords: [-4.029411, 139.112456], rate: 32.41, poorCount: "420.1K", category: "Critical" }
];

export default function Map() {
  // Returns glow marker styling based on the poverty rate
  const getMarkerStyle = (rate: number) => {
    if (rate > 18.0) {
      return { fillColor: "#ef4444", color: "#f87171" }; // Critical Red
    } else if (rate >= 12.0) {
      return { fillColor: "#f59e0b", color: "#fbbf24" }; // High Orange
    } else if (rate >= 7.0) {
      return { fillColor: "#0ea5e9", color: "#38bdf8" }; // Moderate Blue
    } else {
      return { fillColor: "#10b981", color: "#34d399" }; // Low Green
    }
  };

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/[0.08] shadow-lg">
      <MapContainer
        center={[-2.5, 118.0]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "#091a2f" }}
      >
        {/* Sleek Dark Mode Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {provinceData.map((prov, idx) => {
          const style = getMarkerStyle(prov.rate);
          const radius = Math.max(8, prov.rate * 0.85); // Scale size based on poverty rate

          return (
            <CircleMarker
              key={idx}
              center={prov.coords as [number, number]}
              radius={radius}
              fillOpacity={0.65}
              weight={2}
              {...style}
            >
              {/* Premium popup statistics */}
              <Popup className="custom-popup">
                <div className="p-3 bg-[#091a2f] border border-white/[0.08] text-white rounded-lg min-w-[180px] shadow-xl">
                  <h4 className="text-sm font-bold text-sky-400 mb-1.5 border-b border-white/[0.06] pb-1">{prov.name}</h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex justify-between">
                      <span className="opacity-70">Tingkat Kemiskinan:</span> 
                      <span className="font-bold text-white">{prov.rate}%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="opacity-70">Jumlah Penduduk:</span> 
                      <span className="font-semibold text-white">{prov.poorCount}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="opacity-70">Status Wilayah:</span> 
                      <span className={`font-semibold ${
                        prov.rate > 18.0 ? "text-rose-400" : prov.rate >= 12.0 ? "text-amber-400" : "text-sky-400"
                      }`}>{prov.category}</span>
                    </p>
                  </div>
                </div>
              </Popup>
              {/* Lightweight hovering tooltip */}
              <Tooltip sticky>
                <span className="font-bold text-[#091a2f]">{prov.name}: {prov.rate}%</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

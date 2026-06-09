"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface DistrictProps {
  name: string;
  poverty_rate_percent: number | null;
  poor_population_thousands: number | null;
  poverty_line_rupiah: number | null;
}

interface ProvinceMapProps {
  center: [number, number];
  districts: DistrictProps[];
}

// Helper component to handle map movement
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Generate stable coordinate offsets based on district name to avoid jumping
const getStableCoords = (name: string, center: [number, number]): [number, number] => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = ((Math.abs(hash) % 1000) / 1000 - 0.5) * 0.8;
  const lngOffset = ((Math.abs(hash >> 8) % 1000) / 1000 - 0.5) * 0.8;
  return [center[0] + latOffset, center[1] + lngOffset];
};

export default function ProvinceMap({ center, districts = [] }: ProvinceMapProps) {
  const getMarkerStyle = (rate: number | null) => {
    if (rate === null) return { fillColor: "#94a3b8", color: "#cbd5e1" };
    if (rate > 11.0) {
      return { fillColor: "#ef4444", color: "#f87171" }; // Kritis Red
    } else if (rate >= 8.0) {
      return { fillColor: "#f59e0b", color: "#fbbf24" }; // Tinggi Orange
    } else if (rate >= 5.0) {
      return { fillColor: "#0ea5e9", color: "#38bdf8" }; // Sedang Blue
    } else {
      return { fillColor: "#10b981", color: "#34d399" }; // Rendah Green
    }
  };

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/[0.08] shadow-lg">
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "#091a2f" }}
      >
        <MapController center={center} zoom={8} />
        
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {districts.map((reg, idx) => {
          const style = getMarkerStyle(reg.poverty_rate_percent);
          const rateVal = reg.poverty_rate_percent || 0;
          const radius = Math.max(6, Math.min(22, rateVal * 1.5));
          const coords = getStableCoords(reg.name, center);

          const poorPopStr = reg.poor_population_thousands 
            ? reg.poor_population_thousands >= 1000 
              ? `${(reg.poor_population_thousands / 1000).toFixed(2)} Jt`
              : `${reg.poor_population_thousands.toFixed(1)} Rb`
            : "-";

          const category = rateVal > 11.0 ? "Kritis" : rateVal >= 8.0 ? "Tinggi" : rateVal >= 5.0 ? "Sedang" : "Rendah";

          return (
            <CircleMarker
              key={`${reg.name}-${idx}`}
              center={coords}
              radius={radius}
              fillOpacity={0.65}
              weight={2}
              {...style}
            >
              <Popup>
                <div className="p-3 bg-[#091a2f] border border-white/[0.08] text-white rounded-lg min-w-[170px] shadow-xl">
                  <h4 className="text-sm font-bold text-sky-400 mb-1.5 border-b border-white/[0.06] pb-1">{reg.name}</h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex justify-between">
                      <span className="opacity-70">Tingkat Kemiskinan:</span> 
                      <span className="font-bold text-white">{rateVal ? `${rateVal.toFixed(2)}%` : "-"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="opacity-70">Penduduk Miskin:</span> 
                      <span className="font-semibold text-white">{poorPopStr}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="opacity-70">Kategori:</span> 
                      <span className={`font-semibold ${
                        rateVal > 11.0 ? "text-rose-400" : rateVal >= 8.0 ? "text-amber-400" : "text-sky-400"
                      }`}>{category}</span>
                    </p>
                  </div>
                </div>
              </Popup>
              <Tooltip sticky>
                <span className="font-bold text-[#091a2f]">{reg.name}: {rateVal ? `${rateVal.toFixed(2)}%` : "-"}</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

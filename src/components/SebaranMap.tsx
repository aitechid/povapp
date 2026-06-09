"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Province {
  name: string;
  coords: [number, number];
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  d5: number;
  d6: number;
  d7: number;
}

interface SebaranMapProps {
  provincesData: Province[];
  filterDesil: string;
  activeCoords: [number, number];
  activeZoom: number;
}

// Helper component to handle map movement
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function SebaranMap({
  provincesData,
  filterDesil,
  activeCoords,
  activeZoom,
}: SebaranMapProps) {
  // Format numbers with thousands separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Determine color based on value
  const getColorByVal = (val: number) => {
    if (val > 500000) return "#ef4444"; // Critical Red
    if (val > 250000) return "#f59e0b"; // High Orange
    if (val > 100000) return "#0ea5e9"; // Moderate Blue
    return "#10b981"; // Low Green
  };

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/[0.08] shadow-lg">
      <MapContainer
        center={activeCoords}
        zoom={activeZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "#070d19" }}
      >
        <MapController center={activeCoords} zoom={activeZoom} />
        
        {/* Sleek Dark Mode Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {provincesData.map((prov, idx) => {
          const displayVal =
            filterDesil === "All"
              ? prov.d1 + prov.d2 + prov.d3 + prov.d4 + prov.d5 + prov.d6 + prov.d7
              : (prov as any)[`d${filterDesil.split(" ")[1]}`];

          const radius = Math.max(6, Math.min(25, displayVal / 50000));
          const color = getColorByVal(displayVal);

          return (
            <CircleMarker
              key={`${prov.name}-${filterDesil}-${idx}`}
              center={prov.coords}
              radius={radius}
              fillColor={color}
              color={color}
              weight={1.5}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="p-3 bg-[#091a2f] border border-white/[0.08] text-white rounded-lg min-w-[180px] shadow-xl">
                  <h4 className="text-sm font-bold text-sky-400 mb-1.5 border-b border-white/[0.06] pb-1">
                    {prov.name}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex justify-between gap-md">
                      <span className="opacity-70">Penerima:</span>
                      <span className="font-bold text-white">
                        {formatNumber(displayVal)} Jiwa
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {filterDesil === "All" ? "Total Desil 1-7" : filterDesil}
                    </p>
                  </div>
                </div>
              </Popup>
              <Tooltip sticky>
                <span className="font-bold text-[#091a2f]">
                  {prov.name}: {formatNumber(displayVal)}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

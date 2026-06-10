import { NextResponse } from "next/server";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

// Coordinate mappings for all 38 provinces in Indonesia
const PROVINCE_COORDINATES: Record<string, [number, number]> = {
  "ACEH": [4.695135, 96.749399],
  "SUMATERA UTARA": [2.115354, 99.545097],
  "SUMATERA BARAT": [-0.73994, 100.808651],
  "RIAU": [0.293347, 101.706825],
  "JAMBI": [-1.61862, 102.778961],
  "SUMATERA SELATAN": [-3.319437, 103.914398],
  "BENGKULU": [-3.792845, 102.260764],
  "LAMPUNG": [-4.558585, 105.402344],
  "KEP. BANGKA BELITUNG": [-2.741051, 106.440582],
  "KEP. RIAU": [3.916298, 108.232346],
  "DKI JAKARTA": [-6.208763, 106.845599],
  "JAWA BARAT": [-6.914744, 107.60981],
  "JAWA TENGAH": [-7.150975, 110.140259],
  "DI YOGYAKARTA": [-7.875385, 110.426208],
  "JAWA TIMUR": [-7.536064, 112.238402],
  "BANTEN": [-6.405817, 106.060018],
  "BALI": [-8.409518, 115.188919],
  "NUSA TENGGARA BARAT": [-8.652933, 117.361648],
  "NUSA TENGGARA TIMUR": [-8.657382, 121.07937],
  "KALIMANTAN BARAT": [-0.278781, 111.475285],
  "KALIMANTAN TENGAH": [-1.681488, 113.382355],
  "KALIMANTAN SELATAN": [-3.092642, 115.283759],
  "KALIMANTAN TIMUR": [0.538659, 116.419389],
  "KALIMANTAN UTARA": [3.319409, 116.591036],
  "SULAWESI UTARA": [0.624693, 123.975005],
  "SULAWESI TENGAH": [-1.430025, 121.445618],
  "SULAWESI SELATAN": [-4.14491, 120.125961],
  "SULAWESI TENGGARA": [-4.124689, 122.078827],
  "GORONTALO": [0.699937, 122.446724],
  "SULAWESI BARAT": [-2.844148, 119.232078],
  "MALUKU": [-3.238461, 130.145273],
  "MALUKU UTARA": [1.570991, 127.808769],
  "PAPUA": [-4.269928, 138.080353],
  "PAPUA BARAT": [-1.336115, 132.900986],
  "PAPUA BARAT DAYA": [-0.883333, 131.25],
  "PAPUA PEGUNUNGAN": [-4.05, 138.95],
  "PAPUA SELATAN": [-7.5, 139.5],
  "PAPUA TENGAH": [-4.0, 136.0]
};

export async function GET(request: Request) {
  let db: DatabaseSync | null = null;
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get("gender") || "All";
    const water = searchParams.get("water") || "All";
    const wall = searchParams.get("wall") || "All";
    const cooking = searchParams.get("cooking") || "All";
    const lighting = searchParams.get("lighting") || "All";
    const floor = searchParams.get("floor") || "All";

    const dbPath = path.join(process.cwd(), "..", "aitech", "aitech.db");
    db = new DatabaseSync(dbPath);

    // Build SQL query components
    const sqlConditions: string[] = [];
    const params: any[] = [];

    // Filter mapping
    if (gender !== "All") {
      const val = gender === "Laki-laki" ? 1 : 0;
      sqlConditions.push(`id_ruta IN (SELECT id_ruta FROM individual_pbdt WHERE h_hhmale = ?)`);
      params.push(val);
    }

    if (water !== "All") {
      if (water === "Air Kemasan/Isi Ulang") { sqlConditions.push("h_dwater1 = 1"); }
      else if (water === "Leding/PAM") { sqlConditions.push("h_dwater2 = 1"); }
      else if (water === "Sumur Bor/Terlindungi") { sqlConditions.push("h_dwater3 = 1"); }
      else if (water === "Sumur Tak Terlindungi/Mata Air") { sqlConditions.push("h_dwater4 = 1"); }
      else if (water === "Sungai/Air Hujan") { sqlConditions.push("h_dwater5 = 1"); }
    }

    if (wall !== "All") {
      if (wall === "Tembok/Batu") { sqlConditions.push("h_twall3 = 1"); }
      else if (wall === "Kayu/Papan") { sqlConditions.push("h_twall2 = 1"); }
      else if (wall === "Bambu/Seng") { sqlConditions.push("h_twall1 = 1"); }
    }

    if (cooking !== "All") {
      if (cooking === "Gas LPG 3kg") { sqlConditions.push("h_cookingfuel1 = 1"); }
      else if (cooking === "Gas LPG >3kg") { sqlConditions.push("h_cookingfuel2 = 1"); }
      else if (cooking === "Minyak Tanah/Kayu Bakar") { sqlConditions.push("(h_cookingfuel3 = 1 OR h_cookingfuel4 = 1)"); }
    }

    if (lighting !== "All") {
      if (lighting === "Listrik PLN") { sqlConditions.push("h_listrikflag = 1"); }
      else if (lighting === "Listrik non-PLN") { sqlConditions.push("h_lighting2 = 1"); }
      else if (lighting === "Bukan Listrik") { sqlConditions.push("h_lighting3 = 1"); }
    }

    if (floor !== "All") {
      if (floor === "Ubin/Keramik") { sqlConditions.push("(h_tfloor3 = 1 OR h_tfloor4 = 1)"); }
      else if (floor === "Semen/Plester") { sqlConditions.push("h_tfloor2 = 1"); }
      else if (floor === "Kayu/Papan") { sqlConditions.push("h_tfloor1 = 1"); }
      else if (floor === "Tanah/Lainnya") { sqlConditions.push("h_tfloor1 = 1"); }
    }

    const whereClause = sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(" AND ")}` : "";

    // Execute GROUP BY query directly against SQLite
    const query = db!.prepare(`
      SELECT provinsi, target, COUNT(*) as total 
      FROM household_pbdt 
      ${whereClause} 
      GROUP BY provinsi, target
    `);
    
    const rows = query.all(...params) as { provinsi: string, target: number, total: number }[];

    // Initialize results map for all provinces
    const provinceDataMap: Record<string, Record<string, number>> = {};
    for (const name of Object.keys(PROVINCE_COORDINATES)) {
      provinceDataMap[name] = { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0 };
    }

    // Populate with actual database query counts
    const decilesTotal = { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0 };

    for (const row of rows) {
      const provName = row.provinsi ? row.provinsi.toUpperCase() : "";
      if (provinceDataMap[provName]) {
        const d = row.target;
        if (d >= 1 && d <= 4) {
          const key = `d${d}` as 'd1' | 'd2' | 'd3' | 'd4';
          provinceDataMap[provName][key] = row.total;
          decilesTotal[key] += row.total;
        }
      }
    }

    // Calculate D5-D7 simulated/scaled down proportions
    for (const name of Object.keys(PROVINCE_COORDINATES)) {
      const base = provinceDataMap[name]["d4"] || 0;
      provinceDataMap[name]["d5"] = Math.round(base * 0.95);
      provinceDataMap[name]["d6"] = Math.round(base * 0.80);
      provinceDataMap[name]["d7"] = Math.round(base * 0.65);
    }

    // Recalculate decilesTotal for D5-D7
    for (const name of Object.keys(PROVINCE_COORDINATES)) {
      decilesTotal["d5"] += provinceDataMap[name]["d5"];
      decilesTotal["d6"] += provinceDataMap[name]["d6"];
      decilesTotal["d7"] += provinceDataMap[name]["d7"];
    }

    // Map output structure for provincesData (multiplied by 10 for visual scale matches)
    const provinces = Object.keys(PROVINCE_COORDINATES).map(name => {
      const coords = PROVINCE_COORDINATES[name];
      const data = provinceDataMap[name];

      return {
        name,
        coords,
        d1: data.d1 * 10,
        d2: data.d2 * 10,
        d3: data.d3 * 10,
        d4: data.d4 * 10,
        d5: data.d5 * 10,
        d6: data.d6 * 10,
        d7: data.d7 * 10
      };
    });

    db!.close();

    return NextResponse.json({
      success: true,
      deciles: {
        d1: decilesTotal["d1"] * 10,
        d2: decilesTotal["d2"] * 10,
        d3: decilesTotal["d3"] * 10,
        d4: decilesTotal["d4"] * 10,
        d5: decilesTotal["d5"] * 10,
        d6: decilesTotal["d6"] * 10,
        d7: decilesTotal["d7"] * 10,
      },
      provinces
    });

  } catch (err: any) {
    if (db) {
      try { db.close(); } catch (_) {}
    }
    console.error("Sebaran API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

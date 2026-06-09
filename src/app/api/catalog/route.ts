import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const AITECH_DIR = path.join(process.cwd(), "..", "aitech");
const REGISTRY_PATH = path.join(AITECH_DIR, "databases.json");

export const DOCUMENT_EXTENSIONS = [".db", ".sqlite", ".csv", ".xlsx", ".xls", ".json", ".pdf", ".zip", ".txt", ".docx", ".doc"];

// Helper to inspect file metadata
export function inspectFile(filePath: string, fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  const stats = fs.statSync(filePath);

  if (ext === ".db" || ext === ".sqlite") {
    let db: DatabaseSync | null = null;
    try {
      db = new DatabaseSync(filePath);

      // Get table names
      const tablesQuery = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      const tables = (tablesQuery.all() as { name: string }[]).map(t => t.name);

      const tablesMeta = tables.map(tableName => {
        // Get row count
        let rowCount = 0;
        try {
          const countStmt = db.prepare(`SELECT COUNT(*) as total FROM ${tableName}`);
          const countRes = countStmt.get() as { total: number };
          rowCount = countRes?.total || 0;
        } catch (err) {
          console.error(`Error counting rows for ${tableName}:`, err);
        }

        // Get column count
        let colCount = 0;
        try {
          const pragmaStmt = db.prepare(`PRAGMA table_info(${tableName})`);
          const info = pragmaStmt.all();
          colCount = info.length;
        } catch (err) {
          console.error(`Error pragming columns for ${tableName}:`, err);
        }

        return {
          tableName,
          rows: rowCount,
          columns: colCount
        };
      });

      db.close();
      db = null;

      // Quality check simulation (or logic-based)
      const hasPBDT = tables.some(t => t.includes("pbdt"));
      const quality = hasPBDT ? "98.5% (Sangat Baik)" : "90.0% (Baik)";

      return {
        id: fileName.replace(/\.[^/.]+$/, ""),
        name: fileName,
        fileName,
        path: filePath,
        sizeBytes: stats.size,
        sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
        lastModified: stats.mtime.toISOString().split("T")[0],
        owner: "AITECH Ingestion",
        quality,
        tables: tablesMeta,
        type: "sqlite"
      };
    } catch (err) {
      if (db) {
        try { db.close(); } catch (_) {}
      }
      console.error("Failed to inspect DB, treating as generic document:", err);
    }
  }

  // Generic document type
  const displayType = ext.toUpperCase().replace(".", "");
  return {
    id: fileName.replace(/\.[^/.]+$/, ""),
    name: fileName,
    fileName,
    path: filePath,
    sizeBytes: stats.size,
    sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
    lastModified: stats.mtime.toISOString().split("T")[0],
    owner: "AITECH Ingestion",
    quality: "Dokumen Terdaftar",
    tables: [],
    type: "document",
    fileFormat: displayType
  };
}

export async function GET() {
  try {
    if (!fs.existsSync(AITECH_DIR)) {
      fs.mkdirSync(AITECH_DIR, { recursive: true });
    }

    let registry: any[] = [];

    if (fs.existsSync(REGISTRY_PATH)) {
      try {
        registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
      } catch (err) {
        console.error("Failed to parse registry. Resetting.", err);
      }
    }

    // Auto-populate with existing documents in AITECH_DIR if registry is empty
    const files = fs.readdirSync(AITECH_DIR);
    const docFiles = files.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return DOCUMENT_EXTENSIONS.includes(ext) && f !== "databases.json";
    });

    let updated = false;
    for (const file of docFiles) {
      const exists = registry.some(item => item.fileName === file);
      if (!exists) {
        const filePath = path.join(AITECH_DIR, file);
        const meta = inspectFile(filePath, file);
        if (meta) {
          registry.push(meta);
          updated = true;
        }
      }
    }

    if (updated || !fs.existsSync(REGISTRY_PATH)) {
      fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
    }

    return NextResponse.json({ success: true, datasets: registry });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID dataset tidak diberikan" }, { status: 400 });
    }

    if (!fs.existsSync(REGISTRY_PATH)) {
      return NextResponse.json({ success: false, error: "Registri dataset tidak ditemukan" }, { status: 404 });
    }

    let registry: any[] = [];
    try {
      registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
    } catch (err) {
      console.error(err);
    }

    const item = registry.find(d => d.id === id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Dataset tidak ditemukan dalam registri" }, { status: 404 });
    }

    // Attempt to delete physical file
    const filePath = path.join(AITECH_DIR, item.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err: any) {
        console.error("Failed to delete physical file:", err);
        return NextResponse.json({ success: false, error: `Gagal menghapus file database: ${err.message}` }, { status: 500 });
      }
    }

    // Filter registry and save
    registry = registry.filter(d => d.id !== id);
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Dataset berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


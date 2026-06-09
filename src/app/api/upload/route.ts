import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { inspectFile, DOCUMENT_EXTENSIONS } from "../catalog/route";

const AITECH_DIR = path.join(process.cwd(), "..", "aitech");
const REGISTRY_PATH = path.join(AITECH_DIR, "databases.json");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const fileName = file.name;
    const ext = path.extname(fileName).toLowerCase();
    if (!DOCUMENT_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ 
        success: false, 
        error: `Format file tidak didukung. Format yang didukung: ${DOCUMENT_EXTENSIONS.join(", ")}` 
      }, { status: 400 });
    }

    if (!fs.existsSync(AITECH_DIR)) {
      fs.mkdirSync(AITECH_DIR, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const destPath = path.join(AITECH_DIR, fileName);
    fs.writeFileSync(destPath, buffer);

    // Inspect uploaded file for metadata
    const meta = inspectFile(destPath, fileName);
    if (!meta) {
      // Remove bad database file
      try { fs.unlinkSync(destPath); } catch (_) {}
      return NextResponse.json({ success: false, error: "Gagal memproses berkas dokumen yang diunggah" }, { status: 400 });
    }

    // Set description
    meta.description = description || `Berkas dokumen ${fileName} yang diunggah.`;

    // Read and update registry
    let registry: any[] = [];
    if (fs.existsSync(REGISTRY_PATH)) {
      try {
        registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
      } catch (err) {
        console.error("Failed to parse registry:", err);
      }
    }

    // Filter out existing entries with the same filename and push new metadata
    registry = registry.filter(item => item.fileName !== fileName);
    registry.push(meta);

    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: `Berhasil mengunggah dan mengindeks database ${fileName}`,
      dataset: meta
    });

  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

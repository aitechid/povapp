import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const AITECH_DIR = path.join(process.cwd(), "..", "aitech");
const REGISTRY_PATH = path.join(AITECH_DIR, "databases.json");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berkas tidak diberikan" }, { status: 400 });
    }

    if (!fs.existsSync(REGISTRY_PATH)) {
      return NextResponse.json({ success: false, error: "Registri berkas tidak ditemukan" }, { status: 404 });
    }

    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
    const item = registry.find((d: any) => d.id === id);

    if (!item) {
      return NextResponse.json({ success: false, error: "Berkas tidak ditemukan dalam registri" }, { status: 404 });
    }

    const filePath = path.join(AITECH_DIR, item.fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "File fisik berkas tidak ditemukan di server" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${item.fileName}"`,
      },
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

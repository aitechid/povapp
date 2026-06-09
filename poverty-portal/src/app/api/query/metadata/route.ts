import { DatabaseSync } from "node:sqlite";
import { NextResponse } from "next/server";
import path from "node:path";

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), "..", "aitech", "aitech.db");
    const db = new DatabaseSync(dbPath);
    
    // Fetch household metadata
    const hhQuery = db.prepare("SELECT column_name, column_label FROM household_pbdt_metadata");
    const hhMetadata = hhQuery.all() as { column_name: string; column_label: string | null }[];

    // Fetch individual metadata
    const indQuery = db.prepare("SELECT column_name, column_label FROM individual_pbdt_metadata");
    const indMetadata = indQuery.all() as { column_name: string; column_label: string | null }[];

    db.close();

    // Map column details cleanly
    return NextResponse.json({
      household: hhMetadata.map(col => ({
        column: col.column_name,
        label: col.column_label || col.column_name
      })),
      individual: indMetadata.map(col => ({
        column: col.column_name,
        label: col.column_label || col.column_name
      }))
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

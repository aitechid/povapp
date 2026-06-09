import { DatabaseSync } from "node:sqlite";
import { NextResponse } from "next/server";
import path from "node:path";

const VALID_OPERATORS = ["=", "!=", ">", "<", ">=", "<="];

export async function POST(request: Request) {
  const startTime = process.hrtime();
  let db: DatabaseSync | null = null;
  
  try {
    const body = await request.json();
    const { dataset = "household", deciles = [], conditions = [] } = body;

    // Determine target table and metadata table
    const tableName = dataset === "individual" ? "individual_pbdt" : "household_pbdt";
    const metaTableName = dataset === "individual" ? "individual_pbdt_metadata" : "household_pbdt_metadata";

    const dbPath = path.join(process.cwd(), "..", "aitech", "aitech.db");
    db = new DatabaseSync(dbPath);

    // 1. Fetch valid columns for validation (whitelist to prevent SQL Injection)
    const metaQuery = db.prepare(`SELECT column_name FROM ${metaTableName}`);
    const validCols = new Set(
      (metaQuery.all() as { column_name: string }[]).map(row => row.column_name.toLowerCase())
    );

    // Always allow id_ruta, target, and b4_k3 (decile columns)
    validCols.add("id_ruta");
    validCols.add("target");
    validCols.add("b4_k3");

    // 2. Build SQL query components
    const sqlConditions: string[] = [];
    const params: any[] = [];

    // Filter by deciles
    const decileCol = dataset === "individual" ? "b4_k3" : "target";
    if (Array.isArray(deciles) && deciles.length > 0) {
      // Clean and ensure they are numbers
      const cleanDeciles = deciles.map(d => Number(d)).filter(d => !isNaN(d));
      if (cleanDeciles.length > 0) {
        const placeholders = cleanDeciles.map(() => "?").join(", ");
        sqlConditions.push(`${decileCol} IN (${placeholders})`);
        params.push(...cleanDeciles);
      }
    }

    // Filter by conditions
    for (const cond of conditions) {
      const col = cond.column.toLowerCase();
      const op = cond.operator;
      let val = cond.value;

      // Validate column exists in whitelist
      if (!validCols.has(col)) {
        return NextResponse.json({ error: `Invalid column name: ${cond.column}` }, { status: 400 });
      }

      // Validate operator
      if (!VALID_OPERATORS.includes(op)) {
        return NextResponse.json({ error: `Invalid operator: ${op}` }, { status: 400 });
      }

      // Parse numeric values if they look like numbers
      if (typeof val === "string" && val.trim() !== "") {
        const numVal = Number(val);
        if (!isNaN(numVal)) {
          val = numVal;
        }
      }

      sqlConditions.push(`${col} ${op} ?`);
      params.push(val);
    }

    // Construct final SQL
    let sql = `SELECT * FROM ${tableName}`;
    if (sqlConditions.length > 0) {
      sql += ` WHERE ${sqlConditions.join(" AND ")}`;
    }
    sql += ` LIMIT 100`;

    // 3. Execute count query (without limit) to show total matches
    let countSql = `SELECT COUNT(*) as total FROM ${tableName}`;
    if (sqlConditions.length > 0) {
      countSql += ` WHERE ${sqlConditions.join(" AND ")}`;
    }
    
    const countStmt = db.prepare(countSql);
    const countResult = countStmt.get(...params) as { total: number };
    const totalRows = countResult?.total || 0;

    // 4. Execute main query
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params) as Record<string, any>[];

    // Close database connection
    db.close();
    db = null;

    // Calculate execution time
    const diff = process.hrtime(startTime);
    const executionTimeSec = (diff[0] + diff[1] / 1e9).toFixed(3);

    // Format SQL for display (substitute params for display only)
    let displaySql = sql;
    let paramIdx = 0;
    displaySql = displaySql.replace(/\?/g, () => {
      const p = params[paramIdx++];
      return typeof p === "string" ? `'${p}'` : String(p);
    });

    return NextResponse.json({
      rows,
      totalRows,
      executionTimeSec,
      sql: displaySql
    });
  } catch (error: any) {
    console.error("Database query execution error:", error);
    if (db) {
      try { db.close(); } catch (e) {}
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

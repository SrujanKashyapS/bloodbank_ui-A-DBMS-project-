// app/api/stock/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT Blood_Type, COUNT(*) AS Total_Units_Available
       FROM BLOOD_UNIT
       WHERE Status = 'Available'
       GROUP BY Blood_Type
       ORDER BY Total_Units_Available DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/stock error:", err);
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}

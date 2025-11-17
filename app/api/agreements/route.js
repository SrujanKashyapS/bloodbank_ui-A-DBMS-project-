// app/api/agreements/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT 
          sa.Hospital_ID,
          h.Name AS Hospital_Name,
          sa.Bank_ID,
          b.Name AS Bank_Name,
          sa.Agreement_Date
       FROM SUPPLY_AGREEMENT sa
       JOIN HOSPITAL h ON sa.Hospital_ID = h.Hospital_ID
       JOIN BLOOD_BANK b ON sa.Bank_ID = b.Bank_ID
       ORDER BY sa.Agreement_Date DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/agreements error:", err);
    return NextResponse.json({ error: "Failed to fetch agreements" }, { status: 500 });
  }
}

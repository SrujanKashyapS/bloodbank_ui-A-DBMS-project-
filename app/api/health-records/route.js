// app/api/health-records/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      donorId,
      recordDate,
      bloodPressure,
      hemoglobin,
      isEligible,
    } = body;

    const db = getDB();

    // CALL the stored procedure you created:
    // sp_AddHealthRecord(p_DonorID, p_RecordDate, p_BloodPressure, p_Hemoglobin, p_IsEligible)
    const [resultSets] = await db.query(
      "CALL sp_AddHealthRecord(?, ?, ?, ?, ?)",
      [donorId, recordDate, bloodPressure || null, hemoglobin || null, isEligible ? 1 : 0]
    );

    // The procedure SELECTs the inserted row at the end, which is in resultSets[0]
    const insertedRecord = resultSets?.[0] || [];

    return NextResponse.json({ success: true, record: insertedRecord[0] ?? null });
  } catch (err) {
    console.error("POST /api/health-records error:", err);
    return NextResponse.json({ error: "Failed to add health record" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT Donor_ID, Record_ID, Record_Date, Blood_Pressure, Hemoglobin_lvl, Is_Eligible
       FROM HEALTH_RECORD
       ORDER BY Record_Date DESC
       LIMIT 50`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/health-records error:", err);
    return NextResponse.json({ error: "Failed to fetch health records" }, { status: 500 });
  }
}

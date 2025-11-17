// app/api/units/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT Unit_ID, Bank_ID, Donor_ID, Request_ID, Blood_Type, Status
       FROM BLOOD_UNIT
       ORDER BY Unit_ID`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/units error:", err);
    return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { unitId, bankId, donorId, requestId, bloodType, status } = body;

    const db = getDB();
    // Request_ID is optional, so pass null if empty
    await db.query(
      `INSERT INTO BLOOD_UNIT
       (Unit_ID, Bank_ID, Donor_ID, Request_ID, Blood_Type, Status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Number(unitId),
        Number(bankId),
        Number(donorId),
        requestId ? Number(requestId) : null,
        bloodType,
        status,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/units error:", err);
    return NextResponse.json(
      { error: err?.sqlMessage || "Failed to add unit" },
      { status: 500 }
    );
  }
}

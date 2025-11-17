// app/api/requests/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT br.Request_ID, br.Hospital_ID, br.REQ_BLOOD_TYPE,
              br.Quantity_Units, br.Status
       FROM BLOOD_REQUEST br
       ORDER BY br.Request_ID`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/requests error:", err);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { requestId, hospitalId, reqBloodType, quantityUnits } = body;

    const db = getDB();
    await db.query(
      `INSERT INTO BLOOD_REQUEST
       (Request_ID, Hospital_ID, REQ_BLOOD_TYPE, Quantity_Units, Status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [requestId, hospitalId, reqBloodType, quantityUnits]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/requests error:", err);
    return NextResponse.json({ error: "Failed to add request" }, { status: 500 });
  }
}

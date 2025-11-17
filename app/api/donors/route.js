// app/api/donors/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM DONOR ORDER BY Donor_ID");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/donors error:", err);
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      donorId,
      name,
      age,
      gender,
      address,
      phone,
      bloodType,
    } = body;

    const db = getDB();
    await db.query(
      `INSERT INTO DONOR (Donor_ID, Name, Age, Gender, Address, Ph_N, Blood_Type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [donorId, name, age, gender, address || null, phone, bloodType]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/donors error:", err);
    return NextResponse.json({ error: "Failed to add donor" }, { status: 500 });
  }
}

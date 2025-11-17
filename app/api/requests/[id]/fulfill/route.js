// app/api/requests/[id]/fulfill/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../../../lib/db";

export async function POST(req, { params }) {
  const requestId = Number(params.id);
  try {
    const body = await req.json();
    const { bankId } = body;

    const db = getDB();
    // CALL sp_FulfillBloodRequest(p_RequestID, p_BankID)
    await db.query("CALL sp_FulfillBloodRequest(?, ?)", [requestId, bankId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/requests/[id]/fulfill error:", err);
    // If your procedure SIGNALs an error, you'll see it here
    return NextResponse.json(
      { error: err?.sqlMessage || "Failed to fulfill request" },
      { status: 500 }
    );
  }
}

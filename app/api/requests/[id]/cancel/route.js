// app/api/requests/[id]/cancel/route.js
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db"; // your existing helper

export async function POST(_req, context) {
  try {
    // In Next.js 15+, context.params is a Promise
    const { id } = await context.params;

    const requestId = Number(id);

    if (!Number.isInteger(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Call stored procedure with parameterized query
    const [rows] = await db.query("CALL sp_CancelBloodRequest(?)", [
      requestId,
    ]);

    return NextResponse.json(
      {
        message: "Cancel procedure executed",
        result: rows,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Cancel request error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

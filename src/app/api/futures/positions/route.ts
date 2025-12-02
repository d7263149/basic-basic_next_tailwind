import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "";

    // Proxy to backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/positions?userId=${userId}`;

    const res = await fetch(backendUrl);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    return NextResponse.json(
      { ok: false, error: "Proxy failed" },
      { status: 500 }
    );
  }
}

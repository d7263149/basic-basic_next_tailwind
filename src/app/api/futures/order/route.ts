import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) throw new Error("NEXT_PUBLIC_API_URL missing");

    const res = await fetch(`${url}/api/order/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",        // <── prevents Next from caching (important)
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("❌ Proxy Error:", err);
    return NextResponse.json({ ok: false, error: "proxy_failed" }, { status: 500 });
  }
}

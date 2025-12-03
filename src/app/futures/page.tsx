"use client";

import { useState, useEffect } from "react";
import ToastContainer from "@/components/ToastContainer";

type ToastType = "success" | "error";

export default function FuturesProPage() {
  const userId = 1;

  // UI States
  const [symbol, setSymbol] = useState("XRPUSDT");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");

  const [activeTab, setActiveTab] = useState("Positions");
  const [positions, setPositions] = useState<any[]>([]);

  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: ToastType }[]
  >([]);

  // =====================================================
  // FETCH INITIAL POSITIONS
  // =====================================================
  useEffect(() => {
    if (activeTab !== "Positions") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/positions?userId=${userId}`)
      .then((res) => res.json())
      .then((d) => d.ok && setPositions(d.data));
  }, [activeTab]);

  // =====================================================
  // WEBSOCKET FOR stream:completed
  // =====================================================
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.onmessage = (msg) => {
      const payload = JSON.parse(msg.data);

      if (payload.type !== "completed_trade") return;

      const p = payload.data;
      if (p.userId != userId) return;

      setPositions((prev) => {
        const arr = [...prev];
        const idx = arr.findIndex((x) => x.id === p.id);

        if (idx === -1) arr.unshift(p);
        else arr[idx] = p;

        return arr;
      });
    };

    return () => ws.close();
  }, []);

  // =====================================================
  // LIVE MARK PRICE (Binance)
  // =====================================================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mark?symbol=XRPUSDT`
        );
        const data = await res.json();
        if (data.ok) setLivePrice(Number(data.price));
      } catch {}
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // TOAST SYSTEM
  // =====================================================
  const addToast = (message: string, type: ToastType) => {
    const id = String(Date.now());
    setToasts((t) => [...t, { id, message, type }]);
  };
  const removeToast = (id: string) =>
    setToasts((t) => t.filter((toast) => toast.id !== id));

  // =====================================================
  // PLACE ORDER
  // =====================================================
  const handleOrder = async (side: "buy" | "sell") => {
    if (!amount) return addToast("Enter amount!", "error");

    const body = {
      userId,
      symbol,
      event: "insert",
      qty: Number(amount),
      amount: Number(amount),
      leverage: Number(leverage),
      side,
    };

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/create`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    addToast(`${side.toUpperCase()} order executed`, "success");
    setAmount("");
  };

  // =====================================================
  // PNL FORMULA (Binance Futures Style)
  // =====================================================
  const getPNL = (p: any) => {
    if (!livePrice) return "-";

    const entry = Number(p.entry_price);
    const qty = Number(p.qty_xrp);
    const side = p.side;

    let pnl = 0;

    if (side === "BUY") {
      pnl = (livePrice - entry) * qty;
    } else {
      pnl = (entry - livePrice) * qty;
    }

    return pnl.toFixed(3);
  };

  const renderPNL = (p: any) => {
    if (!livePrice) return "-";
    const pnl = Number(getPNL(p));
    return (
      <span className={pnl >= 0 ? "text-green-400" : "text-red-400"}>
        {pnl}
      </span>
    );
  };

  const renderTime = (p: any) => {
    try {
      return new Date(p.ts_human).toLocaleString();
    } catch {
      return "-";
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 flex flex-col">

      {/* ===========================================
          TOP ROW LAYOUT
      ============================================ */}
      <div className="flex flex-1 gap-4">

        {/* CHART AREA (placeholder) */}
        <div className="flex-1 hidden lg:block bg-black/20 border border-white/10 rounded-2xl">
          <div className="h-full flex items-center justify-center text-gray-500">
            📊 Chart + Depth Area
          </div>
        </div>

        {/* RIGHT ORDER PANEL */}
        <div className="w-full lg:w-[420px] bg-white/10 border border-white/20 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Futures Pro
          </h1>

          {/* Symbol */}
          <label className="text-gray-300 block mb-2">Symbol</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-3 bg-black/40 text-white border border-gray-700 rounded-lg mb-5"
          >
            <option value="XRPUSDT">XRPUSDT</option>
          </select>

          {/* Amount */}
          <label className="text-gray-300 block mb-2">Amount ($)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            className="w-full p-3 bg-black/40 text-white border border-gray-700 rounded-lg mb-5"
            placeholder="Enter dollars"
          />

          {/* Leverage */}
          <label className="text-gray-300 block mb-2">Leverage (x)</label>
          <input
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            type="number"
            min="1"
            max="125"
            className="w-full p-3 bg-black/40 text-white border border-gray-700 rounded-lg mb-6"
          />

          <button
            onClick={() => handleOrder("buy")}
            className="py-3 mb-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
          >
            LONG
          </button>

          <button
            onClick={() => handleOrder("sell")}
            className="py-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
          >
            SHORT
          </button>
        </div>
      </div>

      {/* ===========================================
          BOTTOM TABS + POSITIONS TABLE
      ============================================ */}
      <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col">

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10 mb-3">
          <button
            onClick={() => setActiveTab("Positions")}
            className={`pb-3 ${
              activeTab === "Positions"
                ? "text-yellow-400 font-semibold border-b-2 border-yellow-400"
                : "text-gray-400"
            }`}
          >
            Positions
            <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-[1px] rounded-md">
              {positions.length}
            </span>
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-[#0d1117] text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Qty (XRP)</th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Mark</th>
              <th className="px-4 py-3">Lev</th>
              <th className="px-4 py-3">Side</th>
              <th className="px-4 py-3">PNL</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-800 hover:bg-[#161b22]"
              >
                <td className="px-4 py-3">{p.symbol}</td>
                <td className="px-4 py-3">{p.qty_xrp}</td>
                <td className="px-4 py-3">{p.entry_price}</td>
                <td className="px-4 py-3">
                  {livePrice ? Number(livePrice).toFixed(6) : "-"}
                </td>
                <td className="px-4 py-3">{p.leverage}x</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    p.side === "BUY" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {p.side}
                </td>
                <td className="px-4 py-3">{renderPNL(p)}</td>
                <td className="px-4 py-3">{renderTime(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

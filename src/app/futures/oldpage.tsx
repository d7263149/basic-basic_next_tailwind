"use client";

import { useState, useEffect } from "react";
import ToastContainer from "@/components/ToastContainer";

type ToastType = "success" | "error";

export default function FuturesProPage() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");

  const [toasts, setToasts] = useState<
    { id: string; message: string; type: ToastType }[]
  >([]);

  const [activeTab, setActiveTab] = useState("Positions");

  const [positions, setPositions] = useState<any[]>([]);

  const userId = 1; // 🔥 default test user

  // 🟢 fetch positions when tab selected
  useEffect(() => {
    if (activeTab === "Positions") {
      fetch(`/api/futures/positions?userId=${userId}`)
        .then((res) => res.json())
        .then((d) => d.ok && setPositions(d.data));
    }
  }, [activeTab]);

  const addToast = (message: string, type: ToastType) => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOrder = async (side: "buy" | "sell") => {
    if (!amount) {
      addToast("Enter amount!", "error");
      return;
    }

    const body = {
      userId: 1,
      symbol,
      event: "insert",
      qty: Number(amount),
      amount: Number(amount),
      leverage: Number(leverage),
      side,
    };

    try {
      await fetch("/api/futures/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      addToast(`${side.toUpperCase()} order executed`, "success");
      setAmount(""); // reset input
    } catch {
      addToast("API Error!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 flex flex-col">

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 gap-4">

        {/* LEFT — CHART RESERVED */}
        <div className="flex-1 hidden lg:block bg-black/20 border border-white/10 rounded-2xl backdrop-blur-md">
          <div className="h-full flex items-center justify-center text-gray-500 text-lg">
            📊 Chart + Depth Area
          </div>
        </div>

        {/* RIGHT — ORDER PANEL */}
        <div className="w-full lg:w-[420px] bg-white/10 border border-white/20 rounded-2xl backdrop-blur-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Futures Pro</h1>

          {/* Symbol */}
          <label className="text-gray-300 mb-2 block font-medium">Symbol</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg text-white mb-5"
          >
            <option>XRPUSDT</option>

          </select>

          {/* Amount */}
          <label className="text-gray-300 mb-2 block font-medium">Amount ($)</label>
          <input
            type="number"
            placeholder="Enter dollars"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-black/40 border border-gray-700 text-white rounded-lg mb-5"
          />

          {/* Leverage */}
          <label className="text-gray-300 mb-2 block font-medium">Leverage (x)</label>
          <input
            type="number"
            min="1"
            max="125"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="w-full p-3 bg-black/40 border border-gray-700 text-white rounded-lg mb-6"
          />

          {/* BUY & SELL */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleOrder("buy")}
              className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
            >
              LONG
            </button>

            <button
              onClick={() => handleOrder("sell")}
              className="py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
            >
              SHORT
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 BOTTOM — TABS + CONTENT */}
      <div className="mt-4 bg-black/30 border border-white/10 rounded-xl backdrop-blur-md p-4 flex flex-col">

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10 mb-3 overflow-x-auto">
          {[
            { name: "Positions", count: positions.length },
            { name: "Open Orders" },
            { name: "Order History" },
            { name: "Transaction History" },
            { name: "Assets" },
          ].map((t) => (
            <button
              key={t.name}
              onClick={() => setActiveTab(t.name)}
              className={`pb-3 whitespace-nowrap transition ${
                activeTab === t.name
                  ? "text-yellow-400 font-semibold border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.name}
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-[1px] rounded-md">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 min-h-[220px] text-gray-300 overflow-auto">
          {activeTab === "Positions" &&
            (positions.length > 0 ? (
              <table className="w-full text-sm text-gray-300">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="py-2 text-left">Symbol</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Lev</th>
                    <th className="py-2 text-right">Side</th>
                    <th className="py-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p) => (
                    <tr key={p.id} className="border-b border-white/5">
                      <td className="py-2">{p.symbol}</td>
                      <td className="py-2 text-right">{p.qty}</td>
                      <td className="py-2 text-right">{p.leverage}x</td>
                      <td
                        className={`py-2 text-right font-semibold ${
                          p.side === "buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {p.side.toUpperCase()}
                      </td>
                      <td className="py-2 text-right">
                        {new Date(p.ts).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full opacity-60">
                No open positions
              </div>
            ))}
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

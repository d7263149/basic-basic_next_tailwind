"use client";
import { useEffect, useState } from "react";

export default function usePositions(userId: number = 1) {
  const [positions, setPositions] = useState<any[]>([]);

  // 🔹 1) initial fetch from REST
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${API}/api/positions?userId=${userId}`)
      .then((res) => res.json())
      .then((d) => d.ok && setPositions(d.data))
      .catch((e) => console.log("REST fetch error:", e));
  }, [userId]);

  // 🔹 2) live updates from WebSocket
  useEffect(() => {
    // const WS = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5001";
    const WS = process.env.NEXT_PUBLIC_WS_URL!;
const ws = new WebSocket(WS);

    console.log('WS',WS);
        console.log('ws', ws);

  ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  if (payload.type !== "position") return;

  const item = payload.data;
  if (item.userId != userId) return;

  setPositions((prev) => {
    const updated = [...prev];
    const index = updated.findIndex((p) => p.id === item.id);

    if (index === -1) {
      updated.unshift(item);
    } else {
      updated[index] = item;
    }

    return updated;
  });
};


    return () => ws.close();
  }, [userId]);

  return positions;
}

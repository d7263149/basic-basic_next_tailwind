"use client";
import usePositions from "@/hooks/usePositions";

export default function TestPage() {
  const positions = usePositions(1); // default userId = 1

  return (
    <div style={{ padding: 20 }}>
      <h2>📌 Live Positions</h2>
      <pre>{JSON.stringify(positions, null, 2)}</pre>
    </div>
  );
}

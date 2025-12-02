"use client";

import { useEffect, useState } from "react";

type ToastItemProps = {
  id: string;
  message: string;
  type: "success" | "error";
  onClose: (id: string) => void;
};

export default function ToastItem({ id, message, type, onClose }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => (p > 0 ? p - 1 : 0));
    }, 20);

    const hideTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onClose(id), 300);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(hideTimer);
    };
  }, [id, onClose]);

  return (
    <div
      className={`px-5 py-3 rounded-lg shadow-lg text-white flex items-start gap-3 w-72
        transition-all duration-300 transform
        ${fadeOut ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      <div className="flex-1">
        <div className="font-semibold">{message}</div>

        <div className="w-full h-1 mt-2 bg-white/30 rounded overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-white transition-all duration-75"
          ></div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          setFadeOut(true);
          setTimeout(() => onClose(id), 300);
        }}
        className="text-white hover:text-gray-200 font-bold"
      >
        ✕
      </button>
    </div>
  );
}

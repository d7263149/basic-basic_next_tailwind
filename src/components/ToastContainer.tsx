"use client";

import ToastItem from "./ToastItem";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
};

export default function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed right-6 top-20 flex flex-col gap-3 z-50">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          message={t.message}
          type={t.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

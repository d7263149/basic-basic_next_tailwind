import "./globals.css";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export const metadata = {
  title: "Exchange App",
  description: "Trading Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <footer className="w-full bg-gray-900 text-gray-300 py-3 text-center">
          <p>ExchangeX © 2025</p>
        </footer>

      </body>
    </html>
  );
}

import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Exchange App",
  description: "Trading Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">

        {/* HEADER */}
        <header className="w-full bg-black text-white py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">My Exchange Header</h1>

          {/* NAV LINKS */}
          <nav className="flex space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">{children}</main>

        {/* FOOTER */}
        <footer className="w-full bg-gray-900 text-gray-300 py-3 text-center">
          <p>My Footer © 2025</p>
        </footer>

      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Futures", href: "/futures" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-black text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          Exchange<span className="text-blue-500">X</span>
        </h1>

        {/* Menu */}
        <div className="flex space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg transition px-2 py-1 rounded-md 
                  ${isActive ? "text-blue-400 font-semibold border-b-2 border-blue-400" : "text-gray-300 hover:text-white"}
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}

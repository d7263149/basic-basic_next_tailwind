import Image from "next/image";

export default function Home() {
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="p-10 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Tailwind Working 🎉
        </h1>
        
        <p className="mt-4 text-lg text-white/90">
          If you see gradient background + glowing text, Tailwind is active.
        </p>
        
        <button className="mt-6 px-6 py-3 rounded-xl text-white font-semibold bg-black/30 hover:bg-black/40 transition-all">
          Test Button
        </button>
      </div>
    </div>
  );
}

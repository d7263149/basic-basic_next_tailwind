import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ensures /futures and other client routes work in Cloud Run
  trailingSlash: false,

  async rewrites() {
    return [
      {
        source: "/futures",
        destination: "/futures",
      },
      {
        source: "/futures/:slug*",
        destination: "/futures/:slug*",
      },
      // fallback for all client-side routes
      {
        source: "/:path*",
        destination: "/",
      },
    ];
  },

  // allows assets & API calls from backend URL
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // disable strict caching in production
  poweredByHeader: false,
};

export default nextConfig;

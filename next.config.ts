import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Allow missing local assets during first deploy without crashing
    unoptimized: true,
  },
};

export default nextConfig;

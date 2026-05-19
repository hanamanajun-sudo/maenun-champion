import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Firebase popup auth requires COOP to be unsafe-none
          { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
        ],
      },
    ];
  },
};

export default nextConfig;

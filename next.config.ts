import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
      },
      {
        hostname: "0a5a6f57f9f3.ngrok-free.app",
      },
      {
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;

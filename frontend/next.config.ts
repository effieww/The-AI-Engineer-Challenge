import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // When running `next dev` locally, proxy /api/chat to the FastAPI backend.
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
    return [
      {
        source: "/api/chat",
        destination: `${backend}/api/chat`,
      },
    ];
  },
};

export default nextConfig;

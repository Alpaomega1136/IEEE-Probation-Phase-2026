import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  distDir: process.env.NEXT_BUILD_DIR || ".next",
};

export default nextConfig;

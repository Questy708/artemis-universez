import type { NextConfig } from "next";

// Cloudflare Pages uses @opennextjs/cloudflare which handles its own build
// Local/standalone build uses output: "standalone"
const isCloudflare = process.env.BUILD_TARGET === "cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  ...(isCloudflare ? {} : { output: "standalone" }),
};

export default nextConfig;

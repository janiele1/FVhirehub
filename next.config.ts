import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@sparticuz/chromium'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5gb',
    },
  },
};

export default nextConfig;

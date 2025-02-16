import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // The 'incremental' value allows you to adopt PPR for specific routes.
  experimental: {
    ppr: 'incremental'
  }
};

export default nextConfig;

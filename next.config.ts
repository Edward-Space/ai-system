import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  httpAgentOptions: {
    rejectUnauthorized: false,
  },
  images: {
    domains: ['api-gateway.newweb.vn'],
    unoptimized: true,
  },
  webpack: (config: any) => {
    // Handle canvas dependency for react-pdf
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Handle react-pdf worker
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
};

export default nextConfig;

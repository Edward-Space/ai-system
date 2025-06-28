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
};

export default nextConfig;

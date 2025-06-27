import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
    httpAgentOptions: {
    rejectUnauthorized: false,
  },
  //  async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',                               // các route /api/*
  //       destination: 'https://api-gateway.newweb.vn/:path*', // đích proxy
  //     },
  //   ];
  // },
};

export default nextConfig;

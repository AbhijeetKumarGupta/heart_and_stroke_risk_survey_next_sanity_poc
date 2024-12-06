import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
  },
  reactStrictMode: false,
};

export default nextConfig;

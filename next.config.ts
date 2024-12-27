import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    FLAGSMITH_ENVIRONMENT_ID: process.env.FLAGSMITH_ENVIRONMENT_ID,
    BASE_URL: process.env.BASE_URL
  },
  reactStrictMode: false,
};

export default nextConfig;

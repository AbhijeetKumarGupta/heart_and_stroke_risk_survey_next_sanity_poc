import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    FLAGSMITH_ENVIRONMENT_ID: process.env.FLAGSMITH_ENVIRONMENT_ID,
    BE_BASE_URL: process.env.BE_BASE_URL,
    FE_BASE_URL: process.env.FE_BASE_URL,
    CYPRESS_PROJECT_ID: process.env.CYPRESS_PROJECT_ID
  },
  reactStrictMode: false,
};

export default nextConfig;

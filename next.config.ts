import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    FLAGSMITH_ENVIRONMENT_ID: process.env.FLAGSMITH_ENVIRONMENT_ID,
    BE_BASE_URL: process.env.BE_BASE_URL,
    FE_BASE_URL: process.env.FE_BASE_URL,
    CYPRESS_PROJECT_ID: process.env.CYPRESS_PROJECT_ID,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN
  },
  reactStrictMode: false,
};

export default nextConfig;

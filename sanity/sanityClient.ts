import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-12-05',
  useCdn: false,
  stega: { studioUrl: `${process.env.FE_BASE_URL}/admin` },
  token: process.env.SANITY_API_TOKEN,
});

export default client;
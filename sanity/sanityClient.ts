import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-12-05',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export default client;
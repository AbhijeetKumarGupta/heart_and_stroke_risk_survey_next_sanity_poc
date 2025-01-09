import { defineLive } from "next-sanity";
import client from "../sanityClient";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: "vX",
  }),
  browserToken: process.env.SANITY_API_TOKEN,
  serverToken: process.env.SANITY_API_TOKEN,
});
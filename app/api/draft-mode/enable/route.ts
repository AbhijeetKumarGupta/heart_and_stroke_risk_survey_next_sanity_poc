import { defineEnableDraftMode } from "next-sanity/draft-mode";
import client from "@/sanity/sanityClient";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_TOKEN }),
});
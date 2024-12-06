import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {visionTool} from '@sanity/vision';
import schemas from "./sanity/schemas";


export const config = defineConfig({
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || '',
    title: "heart-and-stroke-risk-survey",
    apiVersion: "2024-12-05",
    basePath: "/admin",
    plugins: [structureTool(), visionTool()],
    schema: { types: schemas }
})
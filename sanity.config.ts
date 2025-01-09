import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from 'sanity/presentation';
import {visionTool} from '@sanity/vision';
import schemas from "./sanity/schemas";


export const config = defineConfig({
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || '',
    title: "heart-and-stroke-risk-survey",
    apiVersion: "2024-12-05",
    basePath: "/admin",
    plugins: [
        structureTool(), 
        presentationTool({
            previewUrl: {
              previewMode: {
                enable: "/api/draft-mode/enable",
              },
            },
          }),
        visionTool()
    ],
    schema: { types: schemas }
})
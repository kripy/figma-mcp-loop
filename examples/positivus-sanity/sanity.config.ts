"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Positivus",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Homepage is a singleton — one editable document, no "create new".
            S.listItem()
              .title("Homepage")
              .id("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

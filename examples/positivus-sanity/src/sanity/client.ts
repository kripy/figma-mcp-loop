import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // false → always fresh reads, so content edits show immediately. Flip to true
  // (and add revalidation) if you later want CDN-cached reads in production.
  useCdn: false,
});

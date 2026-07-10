import { defineField, defineType } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({ name: "number", title: "Number", type: "string", description: 'e.g. "01"' }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
  ],
  preview: {
    select: { number: "number", title: "title" },
    prepare: ({ number, title }) => ({ title: `${number ?? ""} ${title ?? ""}`.trim() }),
  },
});

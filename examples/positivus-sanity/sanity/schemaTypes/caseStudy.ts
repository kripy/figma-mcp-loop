import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "object",
  fields: [
    defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
    defineField({ name: "link", title: "Link", type: "link" }),
  ],
  preview: {
    select: { title: "body" },
    prepare: ({ title }) => ({ title: title?.slice(0, 60) ?? "Case study" }),
  },
});

import { defineField, defineType } from "sanity";

/**
 * Figma component: Service Card — variant axis `Theme = Grey | Green | Dark`.
 * The `theme` enum maps 1:1 to the CSS modifiers `.service-card--grey/--green/--dark`.
 * `titleLines` are the two stacked `.tag` spans in the card heading.
 */
export const serviceCard = defineType({
  name: "serviceCard",
  title: "Service card",
  type: "object",
  fields: [
    defineField({
      name: "titleLines",
      title: "Title lines",
      description: "Two stacked highlighted lines, e.g. [\"Search engine\", \"optimization\"].",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().length(2),
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      initialValue: "grey",
      options: {
        list: [
          { title: "Grey", value: "grey" },
          { title: "Green", value: "green" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "illustration",
      title: "Illustration",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "link", title: "Link", type: "link" }),
  ],
  preview: {
    select: { line1: "titleLines.0", line2: "titleLines.1", theme: "theme", media: "illustration" },
    prepare: ({ line1, line2, theme, media }) => ({
      title: [line1, line2].filter(Boolean).join(" "),
      subtitle: `Theme: ${theme}`,
      media,
    }),
  },
});

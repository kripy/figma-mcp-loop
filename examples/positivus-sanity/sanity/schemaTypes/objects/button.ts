import { defineField, defineType } from "sanity";

/**
 * Figma component: Button — variant axis `Style = Primary | Secondary | Accent`.
 * The `style` enum maps 1:1 to the CSS modifiers `.button--primary/--secondary/--accent`.
 */
export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "href", title: "URL", type: "string" }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Accent", value: "accent" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});

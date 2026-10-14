import { defineField, defineType } from "sanity";

/**
 * Figma component: Link — variant axis `Color = Dark | Light | Green`.
 * The `color` enum maps 1:1 to the CSS modifiers `.link--dark/--light/--green`.
 */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "href", title: "URL", type: "string" }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      initialValue: "dark",
      options: {
        list: [
          { title: "Dark", value: "dark" },
          { title: "Light", value: "light" },
          { title: "Green", value: "green" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});

import { defineField, defineType } from "sanity";

/**
 * Singleton document for the `Homepage` route (Figma `📐 Page Layouts`).
 * Each field group corresponds to one `Route/Section` frame, and the whole page
 * is rendered from this document (src/app/page.tsx).
 */
export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "services", title: "Services" },
    { name: "cta", title: "CTA" },
    { name: "caseStudies", title: "Case studies" },
    { name: "process", title: "Process" },
    { name: "team", title: "Team" },
    { name: "testimonials", title: "Testimonials" },
    { name: "contact", title: "Contact" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    // --- Hero ---
    defineField({ name: "heroHeading", title: "Hero heading", type: "string", group: "hero" }),
    defineField({ name: "heroDescription", title: "Hero description", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "heroCta", title: "Hero CTA", type: "button", group: "hero" }),

    // --- Services ---
    defineField({ name: "servicesIntro", title: "Intro tag", type: "string", group: "services" }),
    defineField({ name: "servicesDescription", title: "Description", type: "text", rows: 2, group: "services" }),
    defineField({ name: "services", title: "Service cards", type: "array", of: [{ type: "serviceCard" }], group: "services" }),

    // --- CTA ---
    defineField({ name: "ctaHeading", title: "Heading", type: "string", group: "cta" }),
    defineField({ name: "ctaDescription", title: "Description", type: "text", rows: 2, group: "cta" }),
    defineField({ name: "ctaButton", title: "Button", type: "button", group: "cta" }),

    // --- Case studies ---
    defineField({ name: "caseStudiesIntro", title: "Intro tag", type: "string", group: "caseStudies" }),
    defineField({ name: "caseStudiesDescription", title: "Description", type: "text", rows: 2, group: "caseStudies" }),
    defineField({ name: "caseStudies", title: "Case studies", type: "array", of: [{ type: "caseStudy" }], group: "caseStudies" }),

    // --- Process ---
    defineField({ name: "processIntro", title: "Intro tag", type: "string", group: "process" }),
    defineField({ name: "processDescription", title: "Description", type: "text", rows: 2, group: "process" }),
    defineField({ name: "process", title: "Process steps", type: "array", of: [{ type: "processStep" }], group: "process" }),

    // --- Team ---
    defineField({ name: "teamIntro", title: "Intro tag", type: "string", group: "team" }),
    defineField({ name: "teamDescription", title: "Description", type: "text", rows: 2, group: "team" }),
    defineField({ name: "team", title: "Team members", type: "array", of: [{ type: "teamMember" }], group: "team" }),

    // --- Testimonials ---
    defineField({ name: "testimonialsIntro", title: "Intro tag", type: "string", group: "testimonials" }),
    defineField({ name: "testimonialsDescription", title: "Description", type: "text", rows: 2, group: "testimonials" }),
    defineField({ name: "testimonials", title: "Testimonials", type: "array", of: [{ type: "testimonial" }], group: "testimonials" }),

    // --- Contact ---
    defineField({ name: "contactIntro", title: "Intro tag", type: "string", group: "contact" }),
    defineField({ name: "contactDescription", title: "Description", type: "text", rows: 2, group: "contact" }),

    // --- Footer ---
    defineField({ name: "footerNav", title: "Footer nav links", type: "array", of: [{ type: "navLink" }], group: "footer" }),
    defineField({ name: "footerEmail", title: "Email", type: "string", group: "footer" }),
    defineField({ name: "footerPhone", title: "Phone", type: "string", group: "footer" }),
    defineField({ name: "footerAddress", title: "Address", type: "text", rows: 2, group: "footer" }),
    defineField({ name: "footerCopyright", title: "Copyright line", type: "string", group: "footer" }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});

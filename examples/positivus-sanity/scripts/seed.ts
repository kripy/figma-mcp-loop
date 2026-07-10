/**
 * Seed the full Positivus homepage content into Sanity.
 *
 * Run with:  npm run seed   (→ sanity exec scripts/seed.ts --with-user-token)
 *
 * Uploads service illustrations + team photos as image assets, then creates/
 * replaces the `homePage` singleton with content extracted from the static build.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getCliClient } from "sanity/cli";

const client = getCliClient();

const SERVICES = [
  { file: "service-seo.png", titleLines: ["Search engine", "optimization"], theme: "grey", linkColor: "dark" },
  { file: "service-ppc.png", titleLines: ["Pay-per-click", "advertising"], theme: "green", linkColor: "dark" },
  { file: "service-social.png", titleLines: ["Social Media", "Marketing"], theme: "dark", linkColor: "light" },
  { file: "service-email.png", titleLines: ["Email", "Marketing"], theme: "grey", linkColor: "dark" },
  { file: "service-content.png", titleLines: ["Content", "Creation"], theme: "green", linkColor: "dark" },
  { file: "service-analytics.png", titleLines: ["Analytics and", "Tracking"], theme: "dark", linkColor: "light" },
] as const;

const TEAM = [
  { file: "team-john.png", name: "John Smith", role: "CEO and Founder", bio: "10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy" },
  { file: "team-jane.png", name: "Jane Doe", role: "Director of Operations", bio: "7+ years of experience in project management and team leadership. Strong organizational and communication skills" },
  { file: "team-michael.png", name: "Michael Brown", role: "Senior SEO Specialist", bio: "5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization" },
  { file: "team-emily.png", name: "Emily Johnson", role: "PPC Manager", bio: "3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis" },
  { file: "team-brian.png", name: "Brian Williams", role: "Social Media Specialist", bio: "4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement" },
  { file: "team-sarah.png", name: "Sarah Kim", role: "Content Creator", bio: "2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various industries" },
] as const;

const CASE_STUDIES = [
  "For a local restaurant, we implemented a targeted PPC campaign that resulted in a 50% increase in website traffic and a 25% increase in sales.",
  "For a B2B software company, we developed an SEO strategy that resulted in a first page ranking for key keywords and a 200% increase in organic traffic.",
  "For a national retail chain, we created a social media marketing campaign that increased followers by 25% and generated a 20% increase in online sales.",
];

const PROCESS = [
  { number: "01", title: "Consultation", body: "During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements." },
  { number: "02", title: "Research and Strategy Development", body: "We conduct in-depth research into your industry, competitors, and target audience, then develop a tailored strategy designed to meet your business goals." },
  { number: "03", title: "Implementation", body: "With the strategy agreed, we put the plan into action across the selected channels, setting up campaigns, content, and tracking." },
  { number: "04", title: "Monitoring and Optimization", body: "We continuously monitor performance and optimize campaigns to maximize results and return on investment." },
  { number: "05", title: "Reporting and Communication", body: "You receive regular reports and clear communication about progress, results, and next steps." },
  { number: "06", title: "Continual Improvement", body: "We refine the strategy over time based on data and results, ensuring your marketing keeps improving." },
];

const TESTIMONIAL_QUOTE =
  "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.";

const FOOTER_NAV = ["About Us", "Services", "Use Cases", "Pricing", "Blog"];

async function upload(file: string) {
  const path = join(process.cwd(), "public", "assets", file);
  const asset = await client.assets.upload("image", readFileSync(path), { filename: file });
  console.log(`  uploaded ${file} → ${asset._id}`);
  return asset._id;
}

function imageRef(assetId: string) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

async function main() {
  console.log("Uploading service illustrations…");
  const services = [];
  for (const s of SERVICES) {
    const assetId = await upload(s.file);
    services.push({
      _type: "serviceCard",
      _key: s.file.replace(/\W/g, ""),
      titleLines: [...s.titleLines],
      theme: s.theme,
      illustration: imageRef(assetId),
      link: { _type: "link", label: "Learn more", href: "#", color: s.linkColor },
    });
  }

  console.log("Uploading team photos…");
  const team = [];
  for (const m of TEAM) {
    const assetId = await upload(m.file);
    team.push({
      _type: "teamMember",
      _key: m.file.replace(/\W/g, ""),
      name: m.name,
      role: m.role,
      bio: m.bio,
      socialUrl: "#",
      photo: imageRef(assetId),
    });
  }

  console.log("Writing homePage document…");
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",

    heroHeading: "Navigating the digital landscape for success",
    heroDescription:
      "Our digital marketing agency helps businesses grow and succeed online through a range of services including SEO, PPC, social media marketing, and content creation.",
    heroCta: { _type: "button", label: "Book a consultation", href: "#contact", style: "primary" },

    servicesIntro: "Services",
    servicesDescription:
      "At our digital marketing agency, we offer a range of services to help businesses grow and succeed online. These services include:",
    services,

    ctaHeading: "Let’s make things happen",
    ctaDescription:
      "Contact us today to learn more about how our digital marketing services can help your business grow and succeed online.",
    ctaButton: { _type: "button", label: "Get your free proposal", href: "#contact", style: "primary" },

    caseStudiesIntro: "Case Studies",
    caseStudiesDescription:
      "Explore Real-Life Examples of Our Proven Digital Marketing Success through Our Case Studies",
    caseStudies: CASE_STUDIES.map((body, i) => ({
      _type: "caseStudy",
      _key: `case${i}`,
      body,
      link: { _type: "link", label: "Learn more", href: "#", color: "green" },
    })),

    processIntro: "Our Working Process",
    processDescription: "Step-by-Step Guide to Achieving Your Business Goals",
    process: PROCESS.map((p, i) => ({ _type: "processStep", _key: `step${i}`, ...p })),

    teamIntro: "Team",
    teamDescription:
      "Meet the skilled and experienced team behind our successful digital marketing strategies",
    team,

    testimonialsIntro: "Testimonials",
    testimonialsDescription:
      "Hear from Our Satisfied Clients: Read Our Testimonials to Learn More about Our Digital Marketing Services",
    testimonials: [0, 1, 2].map((i) => ({
      _type: "testimonial",
      _key: `t${i}`,
      quote: TESTIMONIAL_QUOTE,
      name: "John Smith",
      role: "Marketing Director at XYZ Corp",
    })),

    contactIntro: "Contact Us",
    contactDescription: "Connect with Us: Let’s Discuss Your Digital Marketing Needs",

    footerNav: FOOTER_NAV.map((label, i) => ({ _type: "navLink", _key: `nav${i}`, label, href: "#" })),
    footerEmail: "info@positivus.com",
    footerPhone: "555-567-8901",
    footerAddress: "1234 Main St\nMoonstone City, Stardust State 12345",
    footerCopyright: "© 2026 Positivus. All Rights Reserved.",
  });

  console.log("Done. Open /studio → Homepage to edit, or / to view the render.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

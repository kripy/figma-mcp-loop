import { groq } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { client } from "./client";

export const homePageQuery = groq`*[_type == "homePage"][0]{
  heroHeading,
  heroDescription,
  heroCta,
  servicesIntro,
  servicesDescription,
  services[]{
    titleLines,
    theme,
    illustration,
    "aspectRatio": illustration.asset->metadata.dimensions.aspectRatio,
    link
  },
  ctaHeading,
  ctaDescription,
  ctaButton,
  caseStudiesIntro,
  caseStudiesDescription,
  caseStudies[]{ body, link },
  processIntro,
  processDescription,
  process[]{ number, title, body },
  teamIntro,
  teamDescription,
  team[]{
    name,
    role,
    bio,
    socialUrl,
    photo,
    "photoAspect": photo.asset->metadata.dimensions.aspectRatio
  },
  testimonialsIntro,
  testimonialsDescription,
  testimonials[]{ quote, name, role },
  contactIntro,
  contactDescription,
  footerNav[]{ label, href },
  footerEmail,
  footerPhone,
  footerAddress,
  footerCopyright
}`;

type LinkData = { label?: string; href?: string; color?: "dark" | "light" | "green" };
type ButtonData = { label?: string; href?: string; style?: "primary" | "secondary" | "accent" };

export type ServiceCardData = {
  titleLines: [string, string];
  theme: "grey" | "green" | "dark";
  illustration: SanityImageSource;
  aspectRatio?: number;
  link?: LinkData;
};

export type CaseStudyData = { body?: string; link?: LinkData };
export type ProcessStepData = { number?: string; title?: string; body?: string };
export type TeamMemberData = {
  name?: string;
  role?: string;
  bio?: string;
  socialUrl?: string;
  photo?: SanityImageSource;
  photoAspect?: number;
};
export type TestimonialData = { quote?: string; name?: string; role?: string };
export type NavLinkData = { label?: string; href?: string };

export type HomePageData = {
  heroHeading?: string;
  heroDescription?: string;
  heroCta?: ButtonData;
  servicesIntro?: string;
  servicesDescription?: string;
  services?: ServiceCardData[];
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButton?: ButtonData;
  caseStudiesIntro?: string;
  caseStudiesDescription?: string;
  caseStudies?: CaseStudyData[];
  processIntro?: string;
  processDescription?: string;
  process?: ProcessStepData[];
  teamIntro?: string;
  teamDescription?: string;
  team?: TeamMemberData[];
  testimonialsIntro?: string;
  testimonialsDescription?: string;
  testimonials?: TestimonialData[];
  contactIntro?: string;
  contactDescription?: string;
  footerNav?: NavLinkData[];
  footerEmail?: string;
  footerPhone?: string;
  footerAddress?: string;
  footerCopyright?: string;
};

export async function getHomePage(): Promise<HomePageData | null> {
  return client.fetch(homePageQuery, {}, { next: { revalidate: 0 } });
}

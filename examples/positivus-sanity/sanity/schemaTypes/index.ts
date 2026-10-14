import type { SchemaTypeDefinition } from "sanity";

import { button } from "./objects/button";
import { link } from "./objects/link";
import { navLink } from "./objects/navLink";
import { serviceCard } from "./serviceCard";
import { caseStudy } from "./caseStudy";
import { processStep } from "./processStep";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";
import { homePage } from "./homePage";

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects (reusable, map to Figma component variants)
  button,
  link,
  navLink,
  // array item types
  serviceCard,
  caseStudy,
  processStep,
  teamMember,
  testimonial,
  // documents
  homePage,
];

import { urlFor } from "@/sanity/image";
import type { ServiceCardData } from "@/sanity/queries";

const ARROW_BY_COLOR: Record<NonNullable<ServiceCardData["link"]>["color"] & string, string> = {
  dark: "/assets/link-arrow-dark.svg",
  light: "/assets/link-arrow-light.svg",
  green: "/assets/link-arrow-green.svg",
};

/**
 * Figma `Service Card` component rendered from Sanity.
 *
 * Emits exactly the same markup/classes as the verified static build:
 *   <article class="service-card service-card--{theme}"> … two `.tag` spans …
 *   `.link link--{color}` with the matching arrow asset … illustration at 210px wide.
 *
 * The variant axes (theme, link color) come straight from the Sanity enum fields —
 * which is the whole point: editors pick from the design system, code stays in control.
 */
export function ServiceCard({ card }: { card: ServiceCardData }) {
  const { titleLines, theme, illustration, aspectRatio, link } = card;
  const linkColor = link?.color ?? "dark";

  // Green/dark cards use white tags; grey uses the default green tag. Matches the
  // static build (green also has a `.service-card--green .tag` auto-invert in CSS).
  const tagClass = theme === "grey" ? "tag" : "tag tag--white";

  const ar = aspectRatio ?? 210 / 170;
  const displayWidth = 210;
  const displayHeight = Math.round(displayWidth / ar);
  const src = urlFor(illustration).width(displayWidth * 2).fit("max").url();

  return (
    <article className={`service-card service-card--${theme}`}>
      <div className="service-card__text">
        <h3 className="service-card__heading">
          <span className={tagClass}>{titleLines[0]}</span>
          <span className={tagClass}>{titleLines[1]}</span>
        </h3>
        <a href={link?.href ?? "#"} className={`link link--${linkColor}`}>
          <img className="link__icon" src={ARROW_BY_COLOR[linkColor]} alt="" />
          {link?.label ?? "Learn more"}
        </a>
      </div>
      <img
        className="service-card__illustration"
        src={src}
        alt=""
        width={displayWidth}
        height={displayHeight}
      />
    </article>
  );
}

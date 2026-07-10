import { ServiceCard } from "@/components/ServiceCard";
import type { HomePageData } from "@/sanity/queries";

/**
 * Services section — the wired vertical slice. Intro + description + the card grid
 * all come from the Sanity `homePage` document. Markup mirrors the static build's
 * `<section class="section container" id="services">`.
 */
export function Services({ data }: { data: HomePageData }) {
  const cards = data.services ?? [];
  return (
    <section className="section container" id="services">
      <div className="section__intro">
        <h2>
          <span className="tag">{data.servicesIntro ?? "Services"}</span>
        </h2>
        <p className="section__description" style={{ maxWidth: 580 }}>
          {data.servicesDescription}
        </p>
      </div>
      <div className="services">
        {cards.map((card, i) => (
          <ServiceCard key={i} card={card} />
        ))}
      </div>
    </section>
  );
}

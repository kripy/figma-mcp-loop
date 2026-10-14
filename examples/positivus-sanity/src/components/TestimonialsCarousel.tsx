"use client";

import { useRef } from "react";

import type { TestimonialData } from "@/sanity/queries";

/**
 * The original build's 5-line carousel, as a client component, now driven by
 * Sanity testimonials. Same `.testimonials` markup; prev/next scroll the track.
 */
export function TestimonialsCarousel({
  intro,
  description,
  testimonials,
}: {
  intro?: string;
  description?: string;
  testimonials: TestimonialData[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".testimonial");
    const step = (card?.offsetWidth ?? 0) + 50;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="section container" id="testimonials">
      <div className="section__intro">
        <h2>
          <span className="tag">{intro ?? "Testimonials"}</span>
        </h2>
        <p className="section__description" style={{ maxWidth: 473 }}>
          {description}
        </p>
      </div>
      <div className="testimonials">
        <div className="testimonials__track" ref={trackRef}>
          {testimonials.map((t, i) => (
            <figure className="testimonial" key={i}>
              <blockquote className="testimonial__bubble">
                <p>{`“${t.quote ?? ""}”`}</p>
              </blockquote>
              <figcaption className="testimonial__attribution">
                <span className="testimonial__name">{t.name}</span>
                <span className="testimonial__role">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="testimonials__nav">
          <button
            className="testimonials__arrow"
            type="button"
            aria-label="Previous testimonial"
            onClick={() => scroll(-1)}
          >
            <img src="/assets/carousel-arrow-left.svg" alt="" width={20} height={22} />
          </button>
          <img
            className="testimonials__stars"
            src="/assets/carousel-stars.svg"
            alt=""
            width={146}
            height={14}
          />
          <button
            className="testimonials__arrow"
            type="button"
            aria-label="Next testimonial"
            onClick={() => scroll(1)}
          >
            <img
              src="/assets/carousel-arrow-right.svg"
              alt=""
              width={20}
              height={22}
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

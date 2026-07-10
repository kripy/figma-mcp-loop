import { Services } from "@/components/sections/Services";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { urlFor } from "@/sanity/image";
import { getHomePage } from "@/sanity/queries";

export const revalidate = 0;

const ARROW = {
  dark: "/assets/link-arrow-dark.svg",
  light: "/assets/link-arrow-light.svg",
  green: "/assets/link-arrow-green.svg",
} as const;

export default async function HomePage() {
  const data = (await getHomePage()) ?? {};

  return (
    <>
      {/* Hero */}
      <header className="nav container">
        <a className="nav__logo" href="#" aria-label="Positivus home">
          <img src="/assets/logo-icon.svg" alt="" className="nav__logo-icon" />
          <img src="/assets/logo-wordmark.svg" alt="Positivus" className="nav__logo-wordmark" />
        </a>
        <nav className="nav__links" aria-label="Main navigation">
          <a href="#about">About us</a>
          <a href="#services">Services</a>
          <a href="#cases">Use Cases</a>
          <a href="#pricing">Pricing</a>
          <a href="#blog">Blog</a>
          <a href="#contact" className="button button--secondary">Request a quote</a>
        </nav>
      </header>

      <section className="hero container">
        <div className="hero__content">
          <h1>{data.heroHeading}</h1>
          <p className="hero__description">{data.heroDescription}</p>
          <a href={data.heroCta?.href ?? "#contact"} className={`button button--${data.heroCta?.style ?? "primary"}`}>{data.heroCta?.label ?? "Book a consultation"}</a>
        </div>
        <img className="hero__illustration" src="/assets/hero-illustration.png" alt="" width={600} height={515} />
      </section>

      <section className="logos container" aria-label="Trusted by">
        <span className="logos__item" style={{ width: 124 }}><img src="/assets/logo-amazon-word.svg" alt="Amazon" style={{ inset: "25% 0.45% 34.39% 0" }} /><img src="/assets/logo-amazon-smile.svg" alt="" style={{ inset: "66.48% 33.16% 6.25% 14.01%" }} /></span>
        <span className="logos__item" style={{ width: 126 }}><img src="/assets/logo-dribbble.svg" alt="Dribbble" style={{ inset: "18.89% 0.48% 24.39% 0" }} /></span>
        <span className="logos__item" style={{ width: 129 }}><img src="/assets/logo-hubspot-word.svg" alt="HubSpot" style={{ inset: "27.3% 0.3% 16.67% 0" }} /><img src="/assets/logo-hubspot-mark.svg" alt="" style={{ inset: "16.67% 9.47% 17.81% 64.21%" }} /></span>
        <span className="logos__item" style={{ width: 146 }}><img src="/assets/logo-notion.svg" alt="Notion" style={{ inset: "12.5% 0.35% 15.73% 0" }} /></span>
        <span className="logos__item" style={{ width: 125 }}><img src="/assets/logo-netflix.svg" alt="Netflix" style={{ inset: "20.83% 0 16.67% 0" }} /></span>
        <span className="logos__item" style={{ width: 111 }}><img src="/assets/logo-zoom.svg" alt="Zoom" style={{ inset: "29.17% 0.1% 25% 0" }} /></span>
      </section>

      {/* Services */}
      <Services data={data} />

      {/* CTA */}
      <section className="cta container">
        <div className="cta__card">
          <div className="cta__content">
            <h3>{data.ctaHeading}</h3>
            <p>{data.ctaDescription}</p>
            <a href={data.ctaButton?.href ?? "#contact"} className={`button button--${data.ctaButton?.style ?? "primary"}`}>{data.ctaButton?.label ?? "Get your free proposal"}</a>
          </div>
        </div>
        <img className="cta__illustration" src="/assets/cta-illustration.svg" alt="" width={494} height={394} />
      </section>

      {/* Case Studies */}
      <section className="section container" id="cases">
        <div className="section__intro">
          <h2><span className="tag">{data.caseStudiesIntro ?? "Case Studies"}</span></h2>
          <p className="section__description" style={{ maxWidth: 580 }}>{data.caseStudiesDescription}</p>
        </div>
        <div className="case-studies">
          {(data.caseStudies ?? []).map((c, i) => {
            const color = c.link?.color ?? "green";
            return (
              <article className="case-study" key={i}>
                <p>{c.body}</p>
                <a href={c.link?.href ?? "#"} className={`link link--${color}`}>{c.link?.label ?? "Learn more"}<img className="link__arrow" src={ARROW[color]} alt="" /></a>
              </article>
            );
          })}
        </div>
      </section>

      {/* Working Process */}
      <section className="section container" id="process">
        <div className="section__intro">
          <h2><span className="tag">{data.processIntro ?? "Our Working Process"}</span></h2>
          <p className="section__description" style={{ maxWidth: 292 }}>{data.processDescription}</p>
        </div>
        <div className="process">
          {(data.process ?? []).map((step, i) => (
            <details className="process-card" key={i} open={i === 0}>
              <summary>
                <span className="process-card__label"><span className="process-card__number">{step.number}</span><span className="process-card__title">{step.title}</span></span>
                <span className="plus-icon" aria-hidden="true"></span>
              </summary>
              <div className="process-card__body">
                <p>{step.body}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="section container" id="team">
        <div className="section__intro">
          <h2><span className="tag">{data.teamIntro ?? "Team"}</span></h2>
          <p className="section__description" style={{ maxWidth: 473 }}>{data.teamDescription}</p>
        </div>
        <div className="team">
          {(data.team ?? []).map((m, i) => (
            <article className="team-card" key={i}>
              <div className="team-card__person">
                {m.photo ? (
                  <img className="team-card__photo" src={urlFor(m.photo).url()} alt={m.name ?? ""} width={103} height={103} />
                ) : null}
                <div className="team-card__name">
                  <h4>{m.name}</h4>
                  <p>{m.role}</p>
                </div>
                <a className="team-card__social" href={m.socialUrl ?? "#"} aria-label={`${m.name ?? ""} on LinkedIn`}><img src="/assets/social-linkedin-card.svg" alt="" width={34} height={34} /></a>
              </div>
              <hr className="team-card__divider" />
              <p>{m.bio}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel
        intro={data.testimonialsIntro}
        description={data.testimonialsDescription}
        testimonials={data.testimonials ?? []}
      />

      {/* Contact */}
      <section className="section container" id="contact">
        <div className="section__intro">
          <h2><span className="tag">{data.contactIntro ?? "Contact Us"}</span></h2>
          <p className="section__description" style={{ maxWidth: 323 }}>{data.contactDescription}</p>
        </div>
        <div className="contact">
          <form className="contact__form" action="#" method="post">
            <fieldset className="contact__radios">
              <legend className="visually-hidden">Reason for contact</legend>
              <label className="radio"><input type="radio" name="reason" value="say-hi" defaultChecked /><span>Say Hi</span></label>
              <label className="radio"><input type="radio" name="reason" value="get-a-quote" /><span>Get a Quote</span></label>
            </fieldset>
            <div className="field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" placeholder="Name" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="contact-email">Email*</label>
              <input id="contact-email" name="email" type="email" placeholder="Email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="contact-message">Message*</label>
              <textarea id="contact-message" name="message" placeholder="Message" required></textarea>
            </div>
            <button className="button button--primary contact__submit" type="submit">Send Message</button>
          </form>
          <img className="contact__illustration" src="/assets/contact-illustration.svg" alt="" width={692} height={648} />
        </div>
      </section>

      {/* Footer */}
      <footer className="container">
        <div className="footer">
          <div className="footer__top">
            <a className="footer__logo" href="#" aria-label="Positivus home">
              <img src="/assets/logo-icon-white.svg" alt="" className="footer__logo-icon" />
              <img src="/assets/logo-wordmark-white.svg" alt="Positivus" className="footer__logo-wordmark" />
            </a>
            <nav className="footer__nav" aria-label="Footer navigation">
              {(data.footerNav ?? []).map((l, i) => (
                <a href={l.href ?? "#"} key={i}>{l.label}</a>
              ))}
            </nav>
            <div className="footer__social">
              <a href="#" aria-label="Positivus on LinkedIn"><img src="/assets/social-linkedin.svg" alt="" width={30} height={30} /></a>
              <a href="#" aria-label="Positivus on Facebook"><img src="/assets/social-facebook.svg" alt="" width={30} height={30} /></a>
              <a href="#" aria-label="Positivus on Twitter"><img src="/assets/social-twitter.svg" alt="" width={30} height={30} /></a>
            </div>
          </div>
          <div className="footer__middle">
            <div className="footer__contact">
              <h4><span className="tag">Contact Us</span></h4>
              <address className="footer__info">
                <p>Email: {data.footerEmail}</p>
                <p>Phone: {data.footerPhone}</p>
                <p>Address: {(data.footerAddress ?? "").split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
                ))}</p>
              </address>
            </div>
            <form className="footer__subscribe" action="#" method="post">
              <label className="visually-hidden" htmlFor="subscribe-email">Email</label>
              <input id="subscribe-email" name="email" type="email" placeholder="Email" required />
              <button className="button button--accent" type="submit">Subscribe to news</button>
            </form>
          </div>
          <div className="footer__bottom">
            <p>{data.footerCopyright ?? "© 2026 Positivus. All Rights Reserved."}</p>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
}

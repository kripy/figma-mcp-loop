import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Nav } from '../../components/Nav'
import { Footer } from '../../components/Footer'

export const dynamic = 'force-dynamic'

const STAR = '/assets/star.svg'

function MediaBand({ variant, background, label }: { variant: string; background: string; label?: string | null }) {
  const cls = `case-media${background === 'cream' ? ' case-media--cream' : ''}`
  if (variant === 'wide') {
    return (
      <section className={cls}>
        <div className="case-media__row"><div className="case-ph case-ph--wide">{label || 'Image'}</div></div>
      </section>
    )
  }
  if (variant === 'tall') {
    return (
      <section className={cls}>
        <div className="case-media__row"><div className="case-ph case-ph--tall">{label || 'Photo'}</div></div>
      </section>
    )
  }
  return (
    <section className={cls}>
      <div className="case-media__row">
        <div className="case-ph case-ph--phone">{label || 'Screen'}</div>
        <div className="case-ph case-ph--phone">{label || 'Screen'}</div>
      </div>
    </section>
  )
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const cs = docs[0]
  if (!cs) notFound()

  // CTA heading with the accent phrase in teal
  const heading = cs.ctaHeading
  const accent = cs.ctaAccent || ''
  const ai = accent ? heading.indexOf(accent) : -1

  return (
    <>
      <Nav />

      <section className="case-hero" aria-label={`${cs.title} hero`}>
        <div className="case-hero__device"><div className="case-hero__screen" /></div>
      </section>

      <section className="case-intro">
        <div className="case-intro__inner">
          <div className="case-intro__main">
            <h1 className="case-intro__title">{cs.title}</h1>
            {cs.subtitle ? <p className="case-intro__subtitle">{cs.subtitle}</p> : null}
            <p className="case-intro__lead">{cs.intro}</p>
            <a className="case-btn" href="#">Learn more about {cs.title} →</a>
          </div>
          <aside className="case-aside">
            <div className="case-badges">
              {Array.from({ length: 5 }).map((_, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <span className="case-badge" key={i}><img src={STAR} alt="" /></span>
              ))}
            </div>
            {cs.services?.length ? (
              <div>
                <p className="case-aside__label">Our work</p>
                <ul className="case-services">
                  {cs.services.map((s) => <li key={s.id}>{s.label}</li>)}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {cs.layout?.map((block, i) => {
        switch (block.blockType) {
          case 'media':
            return <MediaBand key={i} variant={block.variant} background={block.background} label={block.label} />
          case 'split':
            return (
              <section className="case-split" key={i}>
                <div className="case-split__inner">
                  <div>
                    <p className="case-split__label">{block.leftLabel}</p>
                    <p className="case-split__text">{block.leftText}</p>
                  </div>
                  <div>
                    <p className="case-split__label">{block.rightLabel}</p>
                    <p className="case-split__text">{block.rightText}</p>
                  </div>
                </div>
              </section>
            )
          case 'quote':
            return (
              <section className="case-quote" key={i}>
                <div className="case-quote__inner">
                  <blockquote>{block.text}</blockquote>
                  <p className="case-quote__by">
                    <b>{block.author}</b>
                    {block.role || ''}
                  </p>
                </div>
              </section>
            )
          case 'chapter':
            return (
              <section className="case-chapter" key={i}>
                <div className="case-chapter__inner">
                  <h2 className="case-chapter__title">{block.title}</h2>
                  <div className="case-chapter__body">
                    {block.paragraphs?.map((p) => <p key={p.id}>{p.text}</p>)}
                  </div>
                </div>
              </section>
            )
          default:
            return null
        }
      })}

      <section className="case-cta">
        <div className="case-cta__inner">
          <h2>
            {ai >= 0 ? (
              <>
                {heading.slice(0, ai)}
                <a href="/#contact">{accent}</a>
                {heading.slice(ai + accent.length)}
              </>
            ) : (
              heading
            )}
          </h2>
          <a className="case-cta__btn" href="/#contact">Get in touch →</a>
        </div>
      </section>

      <Footer />
    </>
  )
}

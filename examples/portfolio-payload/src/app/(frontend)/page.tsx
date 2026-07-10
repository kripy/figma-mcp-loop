import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { mediaAlt, mediaUrl } from './lib'

export const dynamic = 'force-dynamic'

const workSlug = (title: string) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export default async function HomePage() {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home', depth: 1 })

  return (
    <>
      <Nav />

      <section className="header section">
        <div className="header__inner">
          <div className="header__text">
            <div className="header__headline">
              <span className="header__eyebrow">{home.hero.eyebrow}</span>
              <h1 className="header__title">{home.hero.title}</h1>
            </div>
            <p className="header__sub">{home.hero.sub}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="header__image"
            src={mediaUrl(home.hero.image)}
            alt={mediaAlt(home.hero.image)}
            width={495}
            height={424}
          />
        </div>
      </section>

      <section className="skills section">
        <div className="skills__inner">
          {home.skills?.map((s) => (
            <article className="skill" key={s.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="skill__img" src={mediaUrl(s.image)} alt="" width={130} height={130} />
              <div className="skill__text">
                <h3 className="skill__title">{s.title}</h3>
                <p>{s.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="work section" id="work">
        <h2 className="work__title">{home.workTitle}</h2>
        <div className="work__cards">
          {[0, 1].map((stripe) => (
            <div className="work__stripe" key={stripe}>
              {home.work?.slice(stripe * 3, stripe * 3 + 3).map((w) => (
                <Link className="work-card" href={`/work/${workSlug(w.title)}`} key={w.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="work-card__img"
                    src={mediaUrl(w.image)}
                    alt={w.title}
                    width={315}
                    height={315}
                  />
                  <div className="work-card__head">
                    <span className="work-card__title">{w.title}</span>
                    <span>{w.artist}</span>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="clients section">
        <h2 className="clients__title">{home.clientsTitle}</h2>
        <div className="clients__cards">
          {home.clients?.map((c) => (
            <article className="client-card" key={c.id}>
              <div className="client-card__inner">
                <p className="client-card__quote">{c.quote}</p>
                <div className="client-card__info">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="client-card__avatar"
                    src={mediaUrl(c.avatar)}
                    alt=""
                    width={50}
                    height={50}
                  />
                  <div className="client-card__rate">
                    <div className="client-card__stars" aria-label="5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src="/assets/star.svg" alt="" />
                      ))}
                    </div>
                    <p className="client-card__name">
                      {c.name},<br />
                      {c.company}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

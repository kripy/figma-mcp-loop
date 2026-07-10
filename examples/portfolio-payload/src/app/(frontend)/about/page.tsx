import { getPayload } from 'payload'

import config from '@/payload.config'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { mediaUrl, nl2br } from '../lib'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'About — My awesome portfolio' }

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about', depth: 1 })

  return (
    <>
      <Nav />

      <section className="about-header section">
        <div className="about-header__inner">
          <div className="persona">
            <div className="persona__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(about.persona.image)} alt={about.persona.name} width={195} height={195} />
            </div>
            <p className="persona__caption">
              <b>{about.persona.name}</b>
              <br />
              {about.persona.role}
            </p>
          </div>
          <p className="about-header__bio">
            <b>Bio:</b>
            <br />
            {about.bio}
          </p>
        </div>
      </section>

      <section className="about-body section">
        <div className="about-body__inner">
          <p className="about-body__lead">{about.lead}</p>
          <div className="about-body__lines">
            {about.lines?.map((l) => (
              <p
                key={l.id}
                className={`about-body__line${l.highlight ? ' about-body__line--hl' : ''}`}
              >
                {nl2br(l.text)}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

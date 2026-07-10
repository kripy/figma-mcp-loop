import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { mediaAlt, mediaUrl } from '../lib'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Work — My awesome portfolio' }

export default async function WorkIndexPage() {
  const payload = await getPayload({ config })
  const { docs: cases } = await payload.find({
    collection: 'case-studies',
    sort: 'title',
    limit: 100,
    depth: 1,
  })

  return (
    <>
      <Nav />

      <section className="work-index section">
        <h1 className="work-index__heading">Selected work</h1>
        <div className="work-grid">
          {cases.map((cs) => (
            <Link className="work-tile" href={`/work/${cs.slug}`} key={cs.id}>
              {mediaUrl(cs.cardImage) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="work-tile__thumb" src={mediaUrl(cs.cardImage)} alt={mediaAlt(cs.cardImage) || cs.title} />
              ) : (
                <div className="work-tile__thumb">{cs.title}</div>
              )}
              <div className="work-tile__head">
                <span className="work-tile__title">{cs.title}</span>
                {cs.subtitle ? <span className="work-tile__sub">{cs.subtitle}</span> : null}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

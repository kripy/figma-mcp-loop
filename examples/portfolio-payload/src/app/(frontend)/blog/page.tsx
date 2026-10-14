import { getPayload } from 'payload'

import config from '@/payload.config'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { PostTile } from '../components/PostTile'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'The Journal — My awesome portfolio' }

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    limit: 100,
    depth: 1,
  })

  return (
    <>
      <Nav />

      <section className="blog-hero section">
        <span className="blog-hero__eyebrow">The Journal</span>
        <h1 className="blog-hero__title">Thoughts, stories &amp; ideas</h1>
        <p className="blog-hero__sub">
          Notes on design, craft, and the occasional unicorn — straight from the studio.
        </p>
      </section>

      <section className="posts section">
        <h2 className="posts__heading">Latest posts</h2>
        <div className="post-grid">
          {posts.map((post) => (
            <PostTile key={post.id} post={post} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

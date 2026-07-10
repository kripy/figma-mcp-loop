import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Nav } from '../../components/Nav'
import { Footer } from '../../components/Footer'
import { PostTile } from '../../components/PostTile'
import { mediaAlt, mediaUrl, monthYear } from '../../lib'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const post = docs[0]
  if (!post) notFound()

  const { docs: related } = await payload.find({
    collection: 'posts',
    where: { slug: { not_equals: slug } },
    sort: '-publishedDate',
    limit: 3,
    depth: 1,
  })

  const featured = post.featuredImage ?? post.thumbnail
  const meta = [post.author, monthYear(post.publishedDate), post.readingTime && `${post.readingTime} min read`]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <Nav />

      <article>
        <section className="article-header section">
          <span className="article-header__tag">{post.tag}</span>
          <h1 className="article-header__title">{post.title}</h1>
          <p className="article-header__meta">{meta}</p>
        </section>

        <section className="article-featured section">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(featured)} alt={mediaAlt(featured)} width={1080} height={480} />
        </section>

        <section className="article-body section">
          <div className="article-body__inner">
            {post.body ? <RichText data={post.body} /> : null}
          </div>
        </section>
      </article>

      <section className="article-related section">
        <h2 className="article-related__heading">More from the journal</h2>
        <div className="post-grid">
          {related.map((r) => (
            <PostTile key={r.id} post={r} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

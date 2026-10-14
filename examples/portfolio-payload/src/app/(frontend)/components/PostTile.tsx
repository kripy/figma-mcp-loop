import Link from 'next/link'

import type { Post } from '@/payload-types'
import { mediaAlt, mediaUrl, monthYear } from '../lib'

export function PostTile({ post }: { post: Post }) {
  return (
    <Link className="post-tile" href={`/posts/${post.slug}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="post-tile__thumb"
        src={mediaUrl(post.thumbnail)}
        alt={mediaAlt(post.thumbnail)}
        width={340}
        height={220}
      />
      <div className="post-tile__content">
        <span className="post-tile__tag">{post.tag}</span>
        <h3 className="post-tile__title">{post.title}</h3>
        <p className="post-tile__excerpt">{post.excerpt}</p>
        <p className="post-tile__meta">
          {post.author} &middot; {monthYear(post.publishedDate)}
        </p>
      </div>
    </Link>
  )
}

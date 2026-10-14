import React from 'react'

import type { Media } from '@/payload-types'

/** Render text with `\n` turned into <br/> line breaks (matches the static markup). */
export function nl2br(text: string): React.ReactNode {
  return text.split('\n').map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </React.Fragment>
  ))
}

/** "Jun 2026" — matches the static portfolio's tile/article meta. */
export function monthYear(date?: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

type Upload = number | Media | null | undefined

/** Resolve an upload field to its served URL (relationTo may come back as id or doc). */
export function mediaUrl(m: Upload): string {
  return m && typeof m === 'object' ? (m.url ?? '') : ''
}

export function mediaAlt(m: Upload): string {
  return m && typeof m === 'object' ? (m.alt ?? '') : ''
}

import type { Block, CollectionConfig } from 'payload'

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const MediaBlock: Block = {
  slug: 'media',
  labels: { singular: 'Media band', plural: 'Media bands' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'phones',
      options: [
        { label: 'Two phones', value: 'phones' },
        { label: 'Wide', value: 'wide' },
        { label: 'Tall', value: 'tall' },
      ],
    },
    {
      name: 'background',
      type: 'select',
      required: true,
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Cream', value: 'cream' },
      ],
    },
    { name: 'label', type: 'text', admin: { description: 'Placeholder caption (e.g. Screen, Photo).' } },
  ],
}

const SplitBlock: Block = {
  slug: 'split',
  labels: { singular: 'Two-column split', plural: 'Two-column splits' },
  fields: [
    { name: 'leftLabel', type: 'text', required: true },
    { name: 'leftText', type: 'textarea', required: true },
    { name: 'rightLabel', type: 'text', required: true },
    { name: 'rightText', type: 'textarea', required: true },
  ],
}

const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Pull quote', plural: 'Pull quotes' },
  fields: [
    { name: 'text', type: 'textarea', required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'role', type: 'text' },
  ],
}

const ChapterBlock: Block = {
  slug: 'chapter',
  labels: { singular: 'Chapter', plural: 'Chapters' },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'paragraphs',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'subtitle', 'slug'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'URL segment. Auto-filled from the title if blank.' },
      hooks: {
        beforeValidate: [({ value, data }) => value || (data?.title ? slugify(data.title) : value)],
      },
    },
    { name: 'subtitle', type: 'text', admin: { description: 'e.g. the founder / client name.' } },
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Square thumbnail shown on the /work index and Home cards.' },
    },
    { name: 'intro', type: 'textarea', required: true },
    {
      name: 'services',
      type: 'array',
      labels: { singular: 'Service', plural: 'Services' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [MediaBlock, SplitBlock, QuoteBlock, ChapterBlock],
    },
    {
      name: 'ctaHeading',
      type: 'text',
      required: true,
      defaultValue: 'Have an uncommon problem or promising pitch? Let’s partner up.',
      admin: { position: 'sidebar' },
    },
    {
      name: 'ctaAccent',
      type: 'text',
      admin: { position: 'sidebar', description: 'Part of the heading rendered in teal.' },
    },
  ],
}

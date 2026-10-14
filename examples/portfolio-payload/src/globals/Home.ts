import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  access: { read: () => true },
  admin: { description: 'The landing page: hero, skills, latest work, and client quotes.' },
  fields: [
    {
      type: 'group',
      name: 'hero',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'sub', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'skills',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Skill', plural: 'Skills' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'workTitle', type: 'text', required: true, defaultValue: 'My latest work' },
    {
      name: 'work',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Work card', plural: 'Work cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'artist', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'clientsTitle', type: 'text', required: true, defaultValue: 'Clients' },
    {
      name: 'clients',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Client quote', plural: 'Client quotes' },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'company', type: 'text', required: true },
        { name: 'avatar', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}

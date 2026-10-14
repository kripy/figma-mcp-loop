import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  access: { read: () => true },
  admin: { description: 'The About page: persona card, bio, and the body paragraphs.' },
  fields: [
    {
      type: 'group',
      name: 'persona',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown under a bold "Bio:" label.' },
    },
    { name: 'lead', type: 'textarea', required: true },
    {
      name: 'lines',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [
        { name: 'text', type: 'textarea', required: true },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Render in the teal/pink highlight style.' },
        },
      ],
    },
  ],
}

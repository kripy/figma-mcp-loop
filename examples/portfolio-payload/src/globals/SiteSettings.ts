import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  admin: { description: 'Shared chrome: the footer "work together" message.' },
  fields: [
    { name: 'footerHeading', type: 'text', required: true, defaultValue: 'Let’s work together' },
    { name: 'footerBody', type: 'textarea', required: true },
  ],
}

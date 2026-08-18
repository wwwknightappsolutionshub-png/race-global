import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    description: 'Company identity, contact details, and logos. Changes appear across the whole site.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'legalName', type: 'text', required: true, defaultValue: 'Race General Trading LLC' },
            { name: 'shortName', type: 'text', required: true, defaultValue: 'Race General Trading' },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              defaultValue: 'Import · Export · Quality · Trust',
            },
            {
              name: 'heroLine',
              type: 'text',
              required: true,
              defaultValue: 'African origin. Dubai hub. Global delivery.',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. Leave empty to use the built-in Concept 1 mark.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phone', type: 'text', required: true, defaultValue: '+971 58 844 8307' },
            { name: 'email', type: 'email', required: true, defaultValue: 'contact@racegentrade.com' },
            { name: 'website', type: 'text', defaultValue: 'www.racegentrade.com' },
            {
              name: 'address',
              type: 'textarea',
              required: true,
              defaultValue: 'A3 Garden City, UAE',
            },
            {
              name: 'instagram',
              type: 'text',
              defaultValue: 'https://www.instagram.com/racegentrade',
              admin: { description: 'Full Instagram URL. Shown in the top bar and footer.' },
            },
            {
              name: 'facebook',
              type: 'text',
              defaultValue: 'https://www.facebook.com/racegentrade',
              admin: { description: 'Full Facebook URL. Shown in the top bar and footer.' },
            },
            {
              name: 'twitter',
              type: 'text',
              defaultValue: 'https://twitter.com/racegentrade',
              admin: { description: 'Full Twitter / X URL. Shown in the top bar and footer.' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              defaultValue: 'Race General Trading LLC | African commodities from Dubai',
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              defaultValue:
                'Dubai-based Race General Trading LLC sources, exports, and supplies premium African agricultural commodities to buyers in the Middle East, Asia, and Europe.',
            },
          ],
        },
      ],
    },
  ],
}

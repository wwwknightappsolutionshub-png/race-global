import type { CollectionConfig } from 'payload'

export const Commodities: CollectionConfig = {
  slug: 'commodities',
  labels: {
    singular: 'Commodity',
    plural: 'Commodities',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'originFocus', 'featured', 'order'],
    description: 'Cargo dossiers shown on the public site. Add, hide, or reorder at any time.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path, e.g. avocado → /commodities/avocado',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'originFocus',
      label: 'Origin focus',
      type: 'text',
      required: true,
      admin: {
        description: 'Short origin line shown on the cargo wall, e.g. Nigeria · Kenya',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'specs',
      type: 'array',
      labels: { singular: 'Spec', plural: 'Specs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show on the homepage cargo wall.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 10,
    },
    {
      type: 'collapsible',
      label: 'SEO',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          admin: { description: 'Browser / Google title for this commodity page.' },
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          admin: { description: 'Meta description for this commodity page.' },
        },
        {
          name: 'seoOgImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Social share image. Defaults to the commodity photo.' },
        },
        {
          name: 'seoNoIndex',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Ask search engines not to index this commodity.' },
        },
      ],
    },
  ],
}

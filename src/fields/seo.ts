import type { Field } from 'payload'

/** Reusable on-page SEO group for globals and collections. */
export function seoGroupField(name: string, label: string): Field {
  return {
    name,
    type: 'group',
    label,
    admin: {
      description: 'Search and social preview fields for this page. Leave blank to use site defaults.',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        admin: { description: 'Browser tab and Google title. Aim for ~50–60 characters.' },
      },
      {
        name: 'description',
        type: 'textarea',
        admin: { description: 'Meta description. Aim for ~150–160 characters.' },
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        admin: { description: 'Open Graph / social share image (recommended 1200×630).' },
      },
      {
        name: 'canonicalPath',
        type: 'text',
        admin: {
          description: 'Optional path override, e.g. /about. Leave empty to use the real page URL.',
        },
      },
      {
        name: 'noIndex',
        type: 'checkbox',
        defaultValue: false,
        admin: { description: 'If checked, search engines are asked not to index this page.' },
      },
    ],
  }
}

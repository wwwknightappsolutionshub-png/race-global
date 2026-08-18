import type { CollectionConfig } from 'payload'

export const Values: CollectionConfig = {
  slug: 'values',
  labels: {
    singular: 'Value',
    plural: 'Values',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    description: 'Company values shown on Home and About.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 10 },
  ],
}

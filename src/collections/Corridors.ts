import type { CollectionConfig } from 'payload'

export const Corridors: CollectionConfig = {
  slug: 'corridors',
  labels: {
    singular: 'Trade point',
    plural: 'Trade corridor',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'region', 'order'],
    description: 'Origins, the Dubai hub, and destination markets on the manifest strip.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Origin', value: 'origin' },
        { label: 'Hub', value: 'hub' },
        { label: 'Destination', value: 'destination' },
      ],
    },
    { name: 'region', type: 'text' },
    { name: 'order', type: 'number', required: true, defaultValue: 10 },
  ],
}

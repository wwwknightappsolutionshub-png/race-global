import type { CollectionConfig } from 'payload'

export const ProcessGates: CollectionConfig = {
  slug: 'process-gates',
  labels: {
    singular: 'Process gate',
    plural: 'Process gates',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order'],
    description: 'The eight trade gates visitors scroll through. Reorder by number.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 10 },
  ],
}

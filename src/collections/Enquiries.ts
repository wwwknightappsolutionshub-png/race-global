import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: {
    singular: 'Enquiry',
    plural: 'Enquiries',
  },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'email', 'commodityInterest', 'status', 'createdAt'],
    description: 'Trade enquiries submitted from the public site. Public API create is disabled — only the contact form server action may create rows.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    // Bots were posting straight to /api/enquiries. Creation is server-action only (overrideAccess).
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'contactName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    {
      name: 'phoneNormalized',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'E.164 phone used for duplicate detection.',
      },
    },
    { name: 'commodityInterest', type: 'text', required: true },
    { name: 'originPreference', type: 'text' },
    { name: 'volume', type: 'text' },
    { name: 'destination', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'sourceIp',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

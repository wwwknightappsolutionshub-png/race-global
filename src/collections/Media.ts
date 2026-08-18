import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  admin: {
    description: 'All photos used on the public site. Replacing a file here updates the live page.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility and search.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'card',
        width: 900,
        height: 720,
        position: 'centre',
      },
      {
        name: 'banner',
        width: 1600,
        height: 900,
        position: 'centre',
      },
    ],
  },
}

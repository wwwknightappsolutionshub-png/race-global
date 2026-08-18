import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Commodities } from './collections/Commodities'
import { Values } from './collections/Values'
import { ProcessGates } from './collections/ProcessGates'
import { Corridors } from './collections/Corridors'
import { Enquiries } from './collections/Enquiries'
import { SiteSettings } from './globals/SiteSettings'
import { SiteCopy } from './globals/SiteCopy'
import { seedIfEmpty } from './seed/index'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Race General Trading',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Commodities, Values, ProcessGates, Corridors, Enquiries],
  globals: [SiteSettings, SiteCopy],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
    // SQLite already has the live schema. Auto-push tries to CREATE INDEX
    // statements that already exist and crashes the site.
    push: false,
  }),
  sharp,
  plugins: [],
  async onInit(payload) {
    const generating = process.argv.some((arg) => arg.includes('generate'))
    if (generating) return
    await seedIfEmpty(payload)
  },
})

import type { MetadataRoute } from 'next'
import { getSite } from '../lib/cms'
import { normalizeSiteUrl } from '../lib/seo'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getSite()
  const siteUrl = normalizeSiteUrl(settings.siteUrl || settings.website)
  const allowIndexing = settings.robotsAllowIndexing !== false

  return {
    rules: allowIndexing
      ? {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api'],
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

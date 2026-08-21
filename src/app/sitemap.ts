import type { MetadataRoute } from 'next'
import { getSite } from '../lib/cms'
import { normalizeSiteUrl } from '../lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings, commodities } = await getSite()
  const siteUrl = normalizeSiteUrl(settings.siteUrl || settings.website)
  const now = new Date()

  const staticPaths = ['', '/about', '/what-we-do', '/commodities', '/process', '/contact', '/privacy']

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  const commodityEntries: MetadataRoute.Sitemap = commodities.map((item) => ({
    url: `${siteUrl}/commodities/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...commodityEntries]
}

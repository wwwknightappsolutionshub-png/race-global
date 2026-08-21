import type { Metadata } from 'next'
import { mediaUrl } from './media'

export type SeoFields = {
  title?: string | null
  description?: string | null
  ogImage?: unknown
  canonicalPath?: string | null
  noIndex?: boolean | null
} | null

export type SiteSeoContext = {
  siteUrl: string
  siteName: string
  defaultTitle: string
  defaultDescription: string
  defaultOgImage?: unknown
}

export function normalizeSiteUrl(raw?: string | null): string {
  const fallback = 'https://racegeneraltrading.com'
  if (!raw) return fallback
  const trimmed = raw.trim().replace(/\/$/, '')
  if (!trimmed) return fallback
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

export function absoluteUrl(siteUrl: string, pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  const base = siteUrl.replace(/\/$/, '')
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}

export function absoluteMediaUrl(siteUrl: string, input: unknown, size?: 'card' | 'banner'): string | undefined {
  const path = mediaUrl(input, size)
  return absoluteUrl(siteUrl, path)
}

export function buildPageMetadata(args: {
  seo?: SeoFields
  path: string
  fallbackTitle: string
  fallbackDescription: string
  fallbackImage?: unknown
  site: SiteSeoContext
}): Metadata {
  const { seo, path, fallbackTitle, fallbackDescription, fallbackImage, site } = args
  const title = seo?.title?.trim() || fallbackTitle
  const description = seo?.description?.trim() || fallbackDescription
  const image =
    absoluteMediaUrl(site.siteUrl, seo?.ogImage, 'banner') ||
    absoluteMediaUrl(site.siteUrl, fallbackImage, 'banner') ||
    absoluteMediaUrl(site.siteUrl, site.defaultOgImage, 'banner')
  const canonicalPath = seo?.canonicalPath?.trim() || path
  const canonical = absoluteUrl(site.siteUrl, canonicalPath)

  return {
    metadataBase: new URL(site.siteUrl),
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: site.siteName,
      title,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export function siteSeoContext(settings: {
  siteUrl?: string | null
  website?: string | null
  legalName?: string | null
  shortName?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  tagline?: string | null
  defaultOgImage?: unknown
}): SiteSeoContext {
  return {
    siteUrl: normalizeSiteUrl(settings.siteUrl || settings.website),
    siteName: settings.shortName || settings.legalName || 'Race General Trading',
    defaultTitle:
      settings.seoTitle ||
      `${settings.legalName || 'Race General Trading LLC'} | African commodities from Dubai`,
    defaultDescription:
      settings.seoDescription ||
      settings.tagline ||
      'African origin. Dubai hub. Global delivery.',
    defaultOgImage: settings.defaultOgImage,
  }
}

export function organizationJsonLd(settings: {
  legalName: string
  shortName?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  website?: string | null
  siteUrl?: string | null
  logo?: unknown
  instagram?: string | null
  facebook?: string | null
  twitter?: string | null
}): Record<string, unknown> {
  const siteUrl = normalizeSiteUrl(settings.siteUrl || settings.website)
  const logo = absoluteMediaUrl(siteUrl, settings.logo)
  const sameAs = [settings.instagram, settings.facebook, settings.twitter].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.legalName,
    alternateName: settings.shortName || undefined,
    url: siteUrl,
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
    logo: logo || undefined,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressCountry: 'AE',
        }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  }
}

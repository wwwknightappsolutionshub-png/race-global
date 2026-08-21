import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteHeader } from '../../components/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter'
import { JsonLd } from '../../components/JsonLd'
import { getSite } from '../../lib/cms'
import { buildPageMetadata, organizationJsonLd, siteSeoContext } from '../../lib/seo'
import './styles.css'

// CMS-backed pages must not prerender against an empty SQLite DB at build time.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { settings, copy } = await getSite()
  const site = siteSeoContext(settings)
  return buildPageMetadata({
    seo: copy.homeSeo,
    path: '/',
    fallbackTitle: site.defaultTitle,
    fallbackDescription: site.defaultDescription,
    fallbackImage: copy.heroHubImage || copy.heroOriginImage,
    site,
  })
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const { settings } = await getSite()

  return (
    <html lang="en">
      <body>
        <JsonLd data={organizationJsonLd(settings)} />
        <div className="shell">
          <SiteHeader
            name={settings.shortName}
            tagline={settings.tagline}
            logo={settings.logo}
            phone={settings.phone}
            address={settings.address}
            instagram={settings.instagram || 'https://www.instagram.com/racegentrade'}
            facebook={settings.facebook || 'https://www.facebook.com/racegentrade'}
            twitter={settings.twitter || 'https://twitter.com/racegentrade'}
          />
          <main>{children}</main>
          <SiteFooter
            name={settings.shortName}
            legalName={settings.legalName}
            tagline={settings.tagline}
            phone={settings.phone}
            email={settings.email}
            address={settings.address}
            website={settings.website}
            logo={settings.logo}
            instagram={settings.instagram || 'https://www.instagram.com/racegentrade'}
            facebook={settings.facebook || 'https://www.facebook.com/racegentrade'}
            twitter={settings.twitter || 'https://twitter.com/racegentrade'}
          />
        </div>
      </body>
    </html>
  )
}

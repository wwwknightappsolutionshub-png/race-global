import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteHeader } from '../../components/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter'
import { getSite } from '../../lib/cms'
import './styles.css'

// CMS-backed pages must not prerender against an empty SQLite DB at build time.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite()
  return {
    title: settings.seoTitle || settings.legalName,
    description: settings.seoDescription || settings.tagline,
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const { settings } = await getSite()

  return (
    <html lang="en">
      <body>
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

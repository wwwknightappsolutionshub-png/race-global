import type { Metadata } from 'next'
import { DossierFrame } from '../../../components/DossierFrame'
import { EnquiryForm } from '../../../components/EnquiryForm'
import { getSite } from '../../../lib/cms'
import { splitParagraphs } from '../../../lib/media'
import { buildPageMetadata, siteSeoContext } from '../../../lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { settings, copy } = await getSite()
  return buildPageMetadata({
    seo: copy.contactSeo,
    path: '/contact',
    fallbackTitle: 'Contact | Race General Trading LLC',
    fallbackDescription: copy.contactBody || settings.seoDescription || settings.tagline || '',
    site: siteSeoContext(settings),
  })
}

export default async function ContactPage() {
  const { settings, copy, commodities } = await getSite()

  return (
    <DossierFrame
      kicker={copy.contactKicker || 'RGT-05 · Open a trade file'}
      title={copy.contactHeading || 'Contact'}
      facts={[
        { label: 'Phone', value: settings.phone },
        { label: 'Email', value: settings.email },
        { label: 'Address', value: settings.address },
      ]}
      cta="Call the desk"
      ctaHref={`tel:${settings.phone.replace(/\s/g, '')}`}
    >
      <div className="prose" style={{ marginBottom: 32 }}>
        {splitParagraphs(copy.contactBody).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <EnquiryForm commodities={commodities.map((item) => ({ name: item.name }))} />
    </DossierFrame>
  )
}

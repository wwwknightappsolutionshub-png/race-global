import type { Metadata } from 'next'
import { DossierFrame } from '../../../components/DossierFrame'
import { getSite } from '../../../lib/cms'
import { splitParagraphs } from '../../../lib/media'
import { buildPageMetadata, siteSeoContext } from '../../../lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { settings, copy } = await getSite()
  return buildPageMetadata({
    seo: copy.privacySeo,
    path: '/privacy',
    fallbackTitle: 'Privacy | Race General Trading LLC',
    fallbackDescription: 'Privacy policy for Race General Trading LLC enquiry and contact data.',
    site: siteSeoContext(settings),
  })
}

export default async function PrivacyPage() {
  const { copy } = await getSite()

  return (
    <DossierFrame kicker="RGT-06 · Legal" title="Privacy" facts={[]} cta="">
      <div className="prose">
        {splitParagraphs(copy.privacyBody).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </DossierFrame>
  )
}

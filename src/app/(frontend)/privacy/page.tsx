import type { Metadata } from 'next'
import { DossierFrame } from '../../../components/DossierFrame'
import { getSite } from '../../../lib/cms'
import { splitParagraphs } from '../../../lib/media'

export const metadata: Metadata = {
  title: 'Privacy | Race General Trading LLC',
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

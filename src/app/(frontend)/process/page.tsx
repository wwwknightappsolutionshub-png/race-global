import type { Metadata } from 'next'
import { DossierFrame } from '../../../components/DossierFrame'
import { ProcessGates } from '../../../components/ProcessGates'
import { getSite } from '../../../lib/cms'
import { buildPageMetadata, siteSeoContext } from '../../../lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { settings, copy } = await getSite()
  return buildPageMetadata({
    seo: copy.processSeo,
    path: '/process',
    fallbackTitle: 'Process | Race General Trading LLC',
    fallbackDescription: copy.processIntro || settings.seoDescription || settings.tagline || '',
    site: siteSeoContext(settings),
  })
}

export default async function ProcessPage() {
  const { copy, gates } = await getSite()

  return (
    <DossierFrame
      kicker={copy.processKicker || 'RGT-04 · Why our process works'}
      title="Eight gates from enquiry to delivery."
      facts={[{ label: 'Control points', value: `${gates.length} gates` }]}
    >
      <p className="muted" style={{ marginBottom: 28 }}>
        {copy.processIntro}
      </p>
      <ProcessGates
        gates={gates.map((gate) => ({
          id: gate.id,
          label: gate.label,
          body: gate.body,
        }))}
      />
    </DossierFrame>
  )
}

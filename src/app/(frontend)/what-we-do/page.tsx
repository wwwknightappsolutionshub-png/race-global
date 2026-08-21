import type { Metadata } from 'next'
import { DossierFrame } from '../../../components/DossierFrame'
import { getSite } from '../../../lib/cms'
import { mediaAlt, mediaUrl, splitParagraphs } from '../../../lib/media'
import { buildPageMetadata, siteSeoContext } from '../../../lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { settings, copy } = await getSite()
  return buildPageMetadata({
    seo: copy.workSeo,
    path: '/what-we-do',
    fallbackTitle: 'What we do | Race General Trading LLC',
    fallbackDescription: copy.workIntro || settings.seoDescription || settings.tagline || '',
    fallbackImage: copy.sourcingImage || copy.exportImage,
    site: siteSeoContext(settings),
  })
}

export default async function WhatWeDoPage() {
  const { copy } = await getSite()
  const sourcing = mediaUrl(copy.sourcingImage, 'banner')
  const exported = mediaUrl(copy.exportImage, 'banner')

  return (
    <DossierFrame
      kicker={copy.workKicker || 'RGT-02 · Scope of work'}
      title="From African origin to destination door."
      facts={[
        { label: 'Workstream 01', value: copy.sourcingTitle || 'Sourcing' },
        { label: 'Workstream 02', value: copy.exportTitle || 'Export & supply chain' },
      ]}
    >
      <div className="prose" style={{ marginBottom: 40 }}>
        {splitParagraphs(copy.workIntro).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="scope">
        <article>
          {sourcing ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sourcing} alt={mediaAlt(copy.sourcingImage, 'Sourcing')} />
          ) : (
            <div className="corridor-fallback origin" style={{ height: 360 }} />
          )}
          <div className="scope-copy">
            <p className="ledger-label">01</p>
            <h2>{copy.sourcingTitle}</h2>
            <p>{copy.sourcingBody}</p>
          </div>
        </article>
        <article>
          {exported ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={exported} alt={mediaAlt(copy.exportImage, 'Export')} />
          ) : (
            <div className="corridor-fallback hub" style={{ height: 360 }} />
          )}
          <div className="scope-copy">
            <p className="ledger-label">02</p>
            <h2>{copy.exportTitle}</h2>
            <p>{copy.exportBody}</p>
          </div>
        </article>
      </div>
    </DossierFrame>
  )
}

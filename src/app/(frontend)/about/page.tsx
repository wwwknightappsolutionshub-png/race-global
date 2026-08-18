import type { Metadata } from 'next'
import { DossierFrame } from '../../../components/DossierFrame'
import { ValuesLedger } from '../../../components/ValuesLedger'
import { ManifestStrip } from '../../../components/ManifestStrip'
import { getSite } from '../../../lib/cms'
import { mediaAlt, mediaUrl, splitParagraphs } from '../../../lib/media'

export const metadata: Metadata = {
  title: 'About | Race General Trading LLC',
}

export default async function AboutPage() {
  const { settings, copy, values, corridor } = await getSite()
  const photo = mediaUrl(copy.aboutImage, 'banner')

  return (
    <DossierFrame
      kicker={copy.aboutKicker || 'RGT-01 · Company dossier'}
      title={copy.aboutHeading || settings.legalName}
      facts={[
        { label: 'Legal name', value: settings.legalName },
        { label: 'Desk', value: settings.address },
        { label: 'Origins', value: 'Nigeria · Kenya · Egypt · Rwanda' },
      ]}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="dossier-photo" src={photo} alt={mediaAlt(copy.aboutImage, 'Origin agriculture')} />
      ) : null}
      <div className="prose">
        {splitParagraphs(copy.aboutBody).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h2 style={{ margin: '40px 0 16px', fontSize: 32 }}>Values on the ledger</h2>
      <ValuesLedger
        variant="accordion"
        values={values.map((value) => ({
          id: value.id,
          title: value.title,
          body: value.body,
        }))}
      />
      <div style={{ marginTop: 48 }}>
        <ManifestStrip
          points={corridor.map((point) => ({
            id: point.id,
            name: point.name,
            role: point.role,
            region: point.region,
          }))}
        />
      </div>
    </DossierFrame>
  )
}

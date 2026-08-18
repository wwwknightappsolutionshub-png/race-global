import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DossierFrame } from '../../../../components/DossierFrame'
import { CargoCarousel } from '../../../../components/CargoCarousel'
import { getCms, getSite } from '../../../../lib/cms'
import { mediaAlt, mediaUrl, splitParagraphs } from '../../../../lib/media'

type Args = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getCms()
  const found = await payload.find({
    collection: 'commodities',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const cargo = found.docs[0]
  if (!cargo) return { title: 'Commodity | Race General Trading LLC' }
  return {
    title: cargo.seoTitle || `${cargo.name} | Race General Trading LLC`,
    description: cargo.seoDescription || cargo.tagline,
  }
}

export default async function CommodityPage({ params }: Args) {
  const { slug } = await params
  const payload = await getCms()
  const { commodities } = await getSite()
  const found = await payload.find({
    collection: 'commodities',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const cargo = found.docs[0]
  if (!cargo) notFound()

  const photo = mediaUrl(cargo.image, 'banner')
  const related = commodities.filter((item) => item.slug !== cargo.slug)

  return (
    <DossierFrame
      kicker={`RGT-CARGO · ${cargo.slug}`}
      title={cargo.name}
      facts={[
        { label: 'Origin focus', value: cargo.originFocus },
        { label: 'Tagline', value: cargo.tagline },
      ]}
      cta={`Enquire on ${cargo.name}`}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="dossier-photo" src={photo} alt={mediaAlt(cargo.image, cargo.name)} />
      ) : null}
      <div className="prose">
        {splitParagraphs(cargo.body).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {cargo.specs && cargo.specs.length > 0 ? (
        <dl className="specs">
          {cargo.specs.map((spec) => (
            <div key={`${spec.label}-${spec.value}`}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {related.length > 0 ? (
        <CargoCarousel
          heading="Other cargo"
          items={related.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            tagline: item.tagline,
            originFocus: item.originFocus,
            image: item.image,
          }))}
        />
      ) : null}
    </DossierFrame>
  )
}

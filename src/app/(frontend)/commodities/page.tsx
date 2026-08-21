import type { Metadata } from 'next'
import { CargoBook } from '../../../components/CargoBook'
import { getSite } from '../../../lib/cms'
import { buildPageMetadata, siteSeoContext } from '../../../lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { settings, copy } = await getSite()
  return buildPageMetadata({
    seo: copy.commoditiesSeo,
    path: '/commodities',
    fallbackTitle: 'Commodities | Race General Trading LLC',
    fallbackDescription: copy.cargoIntro || settings.seoDescription || settings.tagline || '',
    site: siteSeoContext(settings),
  })
}

export default async function CommoditiesPage() {
  const { commodities } = await getSite()

  return (
    <CargoBook
      kicker="RGT-03 · On the book"
      heading="What we specialize in."
      intro="We specialize in the international sourcing and export of high-quality agricultural commodities. Open a dossier for origin notes and typical specifications."
      items={commodities.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        tagline: item.tagline,
        originFocus: item.originFocus,
        image: item.image,
      }))}
    />
  )
}

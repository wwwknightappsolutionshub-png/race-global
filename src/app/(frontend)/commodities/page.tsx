import type { Metadata } from 'next'
import { CargoBook } from '../../../components/CargoBook'
import { getSite } from '../../../lib/cms'

export const metadata: Metadata = {
  title: 'Commodities | Race General Trading LLC',
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

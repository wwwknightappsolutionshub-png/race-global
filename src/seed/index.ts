import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'
import sharp from 'sharp'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.resolve(dirname, 'images')

type Downloaded = Record<string, number>

const IMAGE_SOURCES: { key: string; file: string; alt: string; url: string }[] = [
  {
    key: 'avocado',
    file: 'avocado.jpg',
    alt: 'Fresh avocados',
    url: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'citrus',
    file: 'citrus.jpg',
    alt: 'Citrus fruit — oranges, lemons and limes',
    url: 'https://images.pexels.com/photos/1414122/pexels-photo-1414122.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'habanero',
    file: 'habanero.jpg',
    alt: 'Habanero chilli peppers',
    url: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'coffee',
    file: 'coffee.jpg',
    alt: 'Roasted coffee beans',
    url: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'herbs',
    file: 'herbs.jpg',
    alt: 'Fresh culinary herbs',
    url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'maize',
    file: 'maize.jpg',
    alt: 'Maize cobs for flour milling',
    url: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'cassava',
    file: 'cassava.jpg',
    alt: 'Cassava roots',
    url: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'beans',
    file: 'beans.jpg',
    alt: 'Dried beans',
    url: 'https://images.pexels.com/photos/1352199/pexels-photo-1352199.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'origin',
    file: 'origin.jpg',
    alt: 'African agricultural fields at origin',
    url: 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'hub',
    file: 'hub.jpg',
    alt: 'Dubai skyline as a trade hub',
    url: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'origin2',
    file: 'origin2.jpg',
    alt: 'Harvested crops at African origin',
    url: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'origin3',
    file: 'origin3.jpg',
    alt: 'Grain fields at origin',
    url: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'hub2',
    file: 'hub2.jpg',
    alt: 'Cargo port and containers',
    url: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    key: 'hub3',
    file: 'hub3.jpg',
    alt: 'Dubai waterfront trade hub',
    url: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
]

const COMMODITIES = [
  {
    name: 'Avocado',
    slug: 'avocado',
    imageKey: 'avocado',
    tagline: 'Export-grade fruit from East African highlands.',
    originFocus: 'Kenya · Rwanda',
    order: 10,
    body: 'We source premium avocados from selected farms and packhouses in Kenya and Rwanda, coordinating harvest windows, cold chain, and export documentation so buyers receive consistent, specification-grade fruit.',
    specs: [
      { label: 'Typical origin', value: 'Kenya, Rwanda' },
      { label: 'Form', value: 'Fresh Hass and export varieties' },
      { label: 'Buyers', value: 'Importers, wholesalers, ripeners' },
    ],
  },
  {
    name: 'Citrus',
    slug: 'citrus',
    imageKey: 'citrus',
    tagline: 'Oranges, lemons and limes for juice and fresh markets.',
    originFocus: 'Egypt · Africa',
    order: 20,
    body: 'Race General Trading supplies citrus programmes from North African and wider African origins, matching variety, size, and packing to importer specifications for fresh and processing channels.',
    specs: [
      { label: 'Typical origin', value: 'Egypt and other African origins' },
      { label: 'Form', value: 'Fresh citrus — orange, lemon, lime' },
      { label: 'Buyers', value: 'Importers, juice processors, distributors' },
    ],
  },
  {
    name: 'Habanero chilli',
    slug: 'habanero-chilli',
    imageKey: 'habanero',
    tagline: 'High-heat chilli from West African growers.',
    originFocus: 'Nigeria',
    order: 30,
    body: 'We work with trusted Nigerian suppliers of habanero chilli for fresh and dried programmes, with quality checks on colour, moisture, and packing before export from origin through Dubai.',
    specs: [
      { label: 'Typical origin', value: 'Nigeria' },
      { label: 'Form', value: 'Fresh or dried, as specified' },
      { label: 'Buyers', value: 'Spice houses, wholesalers, manufacturers' },
    ],
  },
  {
    name: 'Coffee Beans',
    slug: 'coffee-beans',
    imageKey: 'coffee',
    tagline: 'Arabica lots from East African origins.',
    originFocus: 'Kenya · Rwanda',
    order: 40,
    body: 'We source green coffee beans from Kenya, Rwanda, and other African origins, working with cooperatives and certified lots so roasters and importers can lock consistent cup profiles and volumes.',
    specs: [
      { label: 'Typical origin', value: 'Kenya, Rwanda' },
      { label: 'Form', value: 'Green coffee beans' },
      { label: 'Buyers', value: 'Importers, roasters, distributors' },
    ],
  },
  {
    name: 'Herbs',
    slug: 'herbs',
    imageKey: 'herbs',
    tagline: 'Culinary herbs for wholesale and food manufacturing.',
    originFocus: 'Egypt · Kenya · Africa',
    order: 50,
    body: 'Fresh and dried culinary herbs are sourced from African growers and packed to buyer specification — from rosemary and thyme through other contracted herbs — with inspection before shipment.',
    specs: [
      { label: 'Typical origin', value: 'Egypt, Kenya, other African origins' },
      { label: 'Form', value: 'Fresh packed or dried' },
      { label: 'Buyers', value: 'Wholesalers, food manufacturers' },
    ],
  },
  {
    name: 'Maize flours',
    slug: 'maize-flours',
    imageKey: 'maize',
    tagline: 'Milled maize for food and industrial buyers.',
    originFocus: 'Nigeria · Kenya · Africa',
    order: 60,
    body: 'Maize flour programmes are built from African grain origins with milling, packing, and moisture specifications agreed in advance so food manufacturers and distributors receive a stable, exportable product.',
    specs: [
      { label: 'Typical origin', value: 'Nigeria, Kenya, other African origins' },
      { label: 'Form', value: 'Maize flour / meal, packed to spec' },
      { label: 'Buyers', value: 'Manufacturers, wholesalers, distributors' },
    ],
  },
  {
    name: 'Cassava flours',
    slug: 'cassava-flours',
    imageKey: 'cassava',
    tagline: 'Cassava flour from West and East African processors.',
    originFocus: 'Nigeria · Africa',
    order: 70,
    body: 'We source cassava flour from selected African processors, aligning starch profile, granulation, and packaging with importer requirements and coordinating export documentation from origin.',
    specs: [
      { label: 'Typical origin', value: 'Nigeria and other African origins' },
      { label: 'Form', value: 'Cassava flour, packed to spec' },
      { label: 'Buyers', value: 'Food manufacturers, wholesalers' },
    ],
  },
  {
    name: 'Beans',
    slug: 'beans',
    imageKey: 'beans',
    tagline: 'Pulses and beans for food service and packing.',
    originFocus: 'Egypt · Kenya · Africa',
    order: 80,
    body: 'Beans and related pulses are sourced from African origins against grade, size, and moisture specifications, with quality inspection and export paperwork handled as part of the corridor from farm to destination.',
    specs: [
      { label: 'Typical origin', value: 'Egypt, Kenya, other African origins' },
      { label: 'Form', value: 'Dried beans, graded and packed' },
      { label: 'Buyers', value: 'Importers, wholesalers, packers' },
    ],
  },
]

async function downloadImage(url: string, dest: string) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10_000) return
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'RaceGeneralTradingSeed/1.0',
      Accept: 'image/jpeg,image/*,*/*',
    },
  })
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
}

async function writeFallbackImage(dest: string) {
  await sharp({
    create: {
      width: 1600,
      height: 1000,
      channels: 3,
      background: { r: 15, g: 61, b: 46 },
    },
  })
    .jpeg({ quality: 80 })
    .toFile(dest)
}

async function uploadImages(payload: Payload): Promise<Downloaded> {
  fs.mkdirSync(imagesDir, { recursive: true })
  const ids: Downloaded = {}

  for (const img of IMAGE_SOURCES) {
    const found = await payload.find({
      collection: 'media',
      where: { alt: { equals: img.alt } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs[0]) {
      ids[img.key] = found.docs[0].id as number
      continue
    }

    const dest = path.join(imagesDir, img.file)
    try {
      await downloadImage(img.url, dest)
    } catch (error) {
      payload.logger.error(`Image download failed for ${img.key}: ${String(error)}`)
      await writeFallbackImage(dest)
    }

    const created = await payload.create({
      collection: 'media',
      data: { alt: img.alt },
      filePath: dest,
      overrideAccess: true,
    })
    ids[img.key] = created.id as number
  }

  return ids
}

export async function seedIfEmpty(payload: Payload) {
  const existing = await payload.find({
    collection: 'commodities',
    limit: 50,
    overrideAccess: true,
  })
  const existingSlugs = new Set(existing.docs.map((doc) => doc.slug))
  const missingCargos = COMMODITIES.filter((cargo) => !existingSlugs.has(cargo.slug))
  if (existing.totalDocs > 0 && missingCargos.length === 0) {
    await ensureHeroGallery(payload)
    return
  }

  const isFresh = existing.totalDocs === 0
  if (!isFresh) {
    payload.logger.info(`Seeding missing commodities: ${missingCargos.map((c) => c.name).join(', ')}`)
  } else {
    payload.logger.info('Seeding Race General Trading content…')
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@racegentrade.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'RaceAdmin2026!'

  const users = await payload.count({ collection: 'users', overrideAccess: true })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'Race Admin',
      },
      overrideAccess: true,
    })
    payload.logger.info(`Admin user created: ${adminEmail}`)
  }

  const media = await uploadImages(payload)

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      legalName: 'Race General Trading LLC',
      shortName: 'Race General Trading',
      tagline: 'Import · Export · Quality · Trust',
      heroLine: 'African origin. Dubai hub. Global delivery.',
      phone: '+971 58 844 8307',
      email: 'contact@racegentrade.com',
      website: 'www.racegentrade.com',
      address: 'A3 Garden City, UAE',
      instagram: 'https://www.instagram.com/racegentrade',
      facebook: 'https://www.facebook.com/racegentrade',
      twitter: 'https://twitter.com/racegentrade',
      seoTitle: 'Race General Trading LLC | African commodities from Dubai',
      seoDescription:
        'Dubai-based Race General Trading LLC sources, exports, and supplies premium African agricultural commodities to buyers in the Middle East, Asia, and Europe.',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'site-copy',
    data: {
      homeKicker: 'RGT-00 · Trade corridor',
      homeIntro:
        "Race General Trading LLC is a Dubai-based international commodity trading company connecting Africa's agricultural resources with buyers across the Middle East, Asia, Europe, and other global markets.",
      homeCta: 'Contact us',
      cargoKicker: 'Cargo',
      cargoHeading: 'Cargo on the book',
      cargoIntro:
        'We specialize in the international sourcing and export of high-quality agricultural commodities from African origin through Dubai.',
      heroOriginImage: media.origin,
      heroHubImage: media.hub,
      heroOriginGallery: gallery(media.origin2, media.origin3),
      heroHubGallery: gallery(media.hub2, media.hub3),
      aboutKicker: 'RGT-01 · Company dossier',
      aboutHeading: 'A sourcing partner, not a one-off shipment.',
      aboutBody:
        "Built on integrity, reliability, and long-term partnerships, we specialize in sourcing, exporting, and supplying premium agricultural commodities directly from trusted producers across Nigeria, Kenya, Egypt, Rwanda, and other strategic African markets.\n\nOur extensive supplier network, rigorous quality standards, and efficient logistics enable us to deliver products that consistently meet international specifications. More than a trading company, we are a dependable sourcing partner committed to helping businesses secure high-quality agricultural products with confidence.\n\nAt Race General Trading, we don't simply move products — we create lasting business relationships built on trust, transparency, and value.",
      aboutImage: media.origin,
      workKicker: 'RGT-02 · Scope of work',
      workIntro:
        'Race General Trading delivers end-to-end agricultural commodity trading solutions, connecting African producers with international buyers through a reliable and efficient supply chain. From sourcing to export documentation and logistics coordination, we manage every stage so clients receive quality products on schedule and at competitive market prices.',
      sourcingTitle: 'Agricultural commodity sourcing',
      sourcingBody:
        'We source premium agricultural commodities directly from carefully selected farms, cooperatives, and certified suppliers across Africa, ensuring consistent quality and competitive pricing.',
      exportTitle: 'Export & supply chain management',
      exportBody:
        'We manage export documentation, quality inspections, packaging, logistics coordination, customs compliance, and international shipping to ensure smooth delivery from origin to destination.',
      sourcingImage: media.origin,
      exportImage: media.hub,
      processKicker: 'RGT-04 · Why our process works',
      processIntro:
        'Every shipment moves through eight gates. Each one is a control point — enquiry, specification, supplier, price, inspection, documents, logistics, and delivery support.',
      reasons: [
        {
          title: 'Dubai strategic location',
          body: "Operating from Dubai gives us access to one of the world's leading trade and logistics hubs, enabling efficient global distribution.",
        },
        {
          title: 'Quality assurance',
          body: 'Every shipment undergoes quality verification to ensure compliance with customer specifications and international standards.',
        },
        {
          title: 'Reliable supply chain',
          body: 'From sourcing to export documentation and shipping coordination, we manage every stage with professionalism and accountability.',
        },
        {
          title: 'Competitive pricing',
          body: 'Our extensive supplier network enables us to deliver excellent value without compromising quality.',
        },
        {
          title: 'Long-term partnership',
          body: "We believe lasting relationships create sustainable success. Our goal is to become a trusted extension of our clients' procurement teams.",
        },
      ],
      contactKicker: 'RGT-05 · Open a trade file',
      contactHeading: "Let's build lasting trade partnerships.",
      contactBody:
        "Whether you're looking for a dependable supplier, consistent product quality, or a trusted sourcing partner across Africa, Race General Trading is ready to support your business. Get in touch today to discuss your sourcing requirements.",
      privacyBody:
        'Race General Trading LLC collects only the information you submit through our enquiry form — company details, contact data, and sourcing requirements — so we can respond to your request. We do not sell personal data. To update or remove an enquiry, email contact@racegentrade.com.',
    },
    overrideAccess: true,
  })

  if (isFresh) {
  const values = [
    {
      title: 'Integrity',
      body: 'We conduct every transaction with honesty, transparency, and ethical business practices.',
    },
    {
      title: 'Quality',
      body: 'We work only with trusted suppliers and implement strict quality control to ensure every shipment meets international standards.',
    },
    {
      title: 'Reliability',
      body: 'Our clients depend on us for consistent supply, timely delivery, and dependable service.',
    },
    {
      title: 'Partnership',
      body: 'We believe successful trading is built on long-term relationships rather than one-time transactions.',
    },
    {
      title: 'Sustainability',
      body: 'We support responsible sourcing that benefits farmers, communities, and future generations.',
    },
    {
      title: 'Excellence',
      body: 'From sourcing to final delivery, we strive for operational excellence in every stage of the supply chain.',
    },
  ]

  for (const [index, value] of values.entries()) {
    await payload.create({
      collection: 'values',
      data: { ...value, order: (index + 1) * 10 },
      overrideAccess: true,
    })
  }

  const gates = [
    {
      label: 'Client inquiry',
      body: 'Tell us the commodity, volume, destination, and specification. We open a trade file and respond with origin options.',
    },
    {
      label: 'Product specification',
      body: 'Grade, packing, moisture, and inspection standards are locked so every lot is measured against the same dossier.',
    },
    {
      label: 'Supplier selection',
      body: 'We nominate farms, cooperatives, or certified processors from our African network who can meet the spec and calendar.',
    },
    {
      label: 'Price confirmation',
      body: 'Origin price, logistics, and Incoterms are confirmed in writing before cargo is committed.',
    },
    {
      label: 'Quality inspection',
      body: 'Lots are verified against the agreed specification before they leave origin.',
    },
    {
      label: 'Export documentation',
      body: 'We coordinate certificates, packing lists, and customs paperwork required for a clean export.',
    },
    {
      label: 'Shipment & logistics',
      body: 'Freight and routing are arranged from African origin through Dubai and onward to destination.',
    },
    {
      label: 'Delivery support',
      body: 'We stay on the file through arrival so buyers have a single accountable partner, not a dropped shipment.',
    },
  ]

  for (const [index, gate] of gates.entries()) {
    await payload.create({
      collection: 'process-gates',
      data: { ...gate, order: (index + 1) * 10 },
      overrideAccess: true,
    })
  }

  const corridor = [
    { name: 'Nigeria', role: 'origin' as const, region: 'West Africa', order: 10 },
    { name: 'Kenya', role: 'origin' as const, region: 'East Africa', order: 20 },
    { name: 'Egypt', role: 'origin' as const, region: 'North Africa', order: 30 },
    { name: 'Rwanda', role: 'origin' as const, region: 'East Africa', order: 40 },
    { name: 'Dubai', role: 'hub' as const, region: 'United Arab Emirates', order: 50 },
    { name: 'Middle East', role: 'destination' as const, region: 'Destination', order: 60 },
    { name: 'Asia', role: 'destination' as const, region: 'Destination', order: 70 },
    { name: 'Europe', role: 'destination' as const, region: 'Destination', order: 80 },
  ]

  for (const point of corridor) {
    await payload.create({
      collection: 'corridors',
      data: point,
      overrideAccess: true,
    })
  }
  }

  for (const cargo of missingCargos) {
    const image = media[cargo.imageKey]
    if (!image) {
      payload.logger.error(`Skipping ${cargo.name} — image not available`)
      continue
    }

    await payload.create({
      collection: 'commodities',
      data: {
        name: cargo.name,
        slug: cargo.slug,
        tagline: cargo.tagline,
        originFocus: cargo.originFocus,
        body: cargo.body,
        specs: cargo.specs,
        featured: true,
        order: cargo.order,
        image,
        seoTitle: `${cargo.name} | Race General Trading LLC`,
        seoDescription: cargo.tagline,
      },
      overrideAccess: true,
    })
  }

  payload.logger.info('Seed complete.')
}

function gallery(...ids: Array<number | undefined>) {
  return ids.filter((id): id is number => typeof id === 'number').map((image) => ({ image }))
}

async function ensureHeroGallery(payload: Payload) {
  const copy = await payload.findGlobal({ slug: 'site-copy', depth: 0 })
  if ((copy.heroOriginGallery?.length ?? 0) > 0 && (copy.heroHubGallery?.length ?? 0) > 0) return

  payload.logger.info('Seeding hero fade galleries…')
  const media = await uploadImages(payload)
  await payload.updateGlobal({
    slug: 'site-copy',
    data: {
      heroOriginGallery: gallery(media.origin2, media.origin3),
      heroHubGallery: gallery(media.hub2, media.hub3),
    },
    overrideAccess: true,
  })
}

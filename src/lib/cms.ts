import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getCms = cache(async () => {
  return getPayload({ config })
})

export async function getSite() {
  const payload = await getCms()
  const [settings, copy, commodities, values, gates, corridor] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.findGlobal({ slug: 'site-copy' }),
    payload.find({
      collection: 'commodities',
      sort: 'order',
      limit: 50,
      depth: 1,
    }),
    payload.find({ collection: 'values', sort: 'order', limit: 20 }),
    payload.find({ collection: 'process-gates', sort: 'order', limit: 20 }),
    payload.find({ collection: 'corridors', sort: 'order', limit: 40 }),
  ])

  return {
    settings,
    copy,
    commodities: commodities.docs,
    values: values.docs,
    gates: gates.docs,
    corridor: corridor.docs,
  }
}

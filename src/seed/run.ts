import { getPayload } from 'payload'
import config from '@payload-config'
import { seedIfEmpty } from './index'

const payload = await getPayload({ config })
await seedIfEmpty(payload)
process.exit(0)

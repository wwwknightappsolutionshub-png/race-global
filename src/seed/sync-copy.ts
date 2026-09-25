import { getPayload } from 'payload'
import config from '@payload-config'
import { syncPublicMessaging } from './index'

const payload = await getPayload({ config })
await syncPublicMessaging(payload)
process.exit(0)

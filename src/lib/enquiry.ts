'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export type EnquiryState = {
  ok: boolean
  error: string
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const company = String(formData.get('company') || '').trim()
  const contactName = String(formData.get('contactName') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const commodityInterest = String(formData.get('commodityInterest') || '').trim()
  const originPreference = String(formData.get('originPreference') || '').trim()
  const volume = String(formData.get('volume') || '').trim()
  const destination = String(formData.get('destination') || '').trim()
  const message = String(formData.get('message') || '').trim()

  if (!company || !contactName || !email || !commodityInterest || !message) {
    return { ok: false, error: 'Please complete the required fields on this file.' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'enquiries',
      data: {
        company,
        contactName,
        email,
        phone,
        commodityInterest,
        originPreference,
        volume,
        destination,
        message,
        status: 'new',
      },
    })
    return { ok: true, error: '' }
  } catch {
    return { ok: false, error: 'The file could not be stored. Email contact@racegentrade.com instead.' }
  }
}

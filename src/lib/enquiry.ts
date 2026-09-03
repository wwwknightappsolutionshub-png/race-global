'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import {
  assertIpRateLimit,
  assertNotDuplicateWithin24h,
  checkHoneypotAndTiming,
  checkMessageQuality,
  getClientMeta,
  verifyTurnstileIfConfigured,
} from './enquirySpam'
import { sendEnquiryNotification } from './mail'
import {
  normalizeEmail,
  verifyEmailAddress,
  verifyPhoneExistsGlobally,
  verifyPhoneNumber,
} from './verifyContact'

export type EnquiryState = {
  ok: boolean
  error: string
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const spamGate = checkHoneypotAndTiming(formData)
  if (!spamGate.ok) {
    return { ok: false, error: spamGate.error || 'Unable to accept this submission.' }
  }

  const turnstile = await verifyTurnstileIfConfigured(String(formData.get('cf-turnstile-response') || ''))
  if (!turnstile.ok) {
    return { ok: false, error: turnstile.error || 'Security check failed.' }
  }

  const company = String(formData.get('company') || '').trim()
  const contactName = String(formData.get('contactName') || '').trim()
  const emailRaw = String(formData.get('email') || '').trim()
  const phoneRaw = String(formData.get('phone') || '').trim()
  const commodityInterest = String(formData.get('commodityInterest') || '').trim()
  const originPreference = String(formData.get('originPreference') || '').trim()
  const volume = String(formData.get('volume') || '').trim()
  const destination = String(formData.get('destination') || '').trim()
  const message = String(formData.get('message') || '').trim()

  if (!company || !contactName || !emailRaw || !phoneRaw || !commodityInterest || !message) {
    return { ok: false, error: 'Please complete the required fields on this file.' }
  }

  if (company.length > 200 || contactName.length > 120 || commodityInterest.length > 200) {
    return { ok: false, error: 'One or more fields are too long.' }
  }

  const messageGate = checkMessageQuality(message)
  if (!messageGate.ok) {
    return { ok: false, error: messageGate.error || 'Unable to accept this submission.' }
  }

  const emailCheck = await verifyEmailAddress(emailRaw)
  if (!emailCheck.ok) {
    return { ok: false, error: emailCheck.error || 'Invalid email address.' }
  }
  const email = normalizeEmail(emailRaw)

  const phoneCheck = verifyPhoneNumber(phoneRaw)
  if (!phoneCheck.ok || !phoneCheck.e164) {
    return { ok: false, error: phoneCheck.error || 'Invalid phone number.' }
  }

  const phoneExists = await verifyPhoneExistsGlobally(phoneCheck.e164)
  if (!phoneExists.ok) {
    return { ok: false, error: phoneExists.error || 'Invalid phone number.' }
  }

  const { ip, userAgent } = await getClientMeta()

  try {
    const payload = await getPayload({ config })

    const duplicate = await assertNotDuplicateWithin24h(payload, {
      email,
      phoneNormalized: phoneCheck.e164,
    })
    if (!duplicate.ok) {
      return { ok: false, error: duplicate.error || 'Duplicate submission.' }
    }

    const ipLimit = await assertIpRateLimit(payload, ip)
    if (!ipLimit.ok) {
      return { ok: false, error: ipLimit.error || 'Rate limit exceeded.' }
    }

    const enquiryData = {
      company,
      contactName,
      email,
      phone: phoneRaw,
      phoneNormalized: phoneCheck.e164,
      commodityInterest,
      originPreference,
      volume,
      destination,
      message,
      status: 'new' as const,
      sourceIp: ip,
      userAgent: userAgent.slice(0, 500),
    }

    await payload.create({
      collection: 'enquiries',
      data: enquiryData,
      overrideAccess: true,
    })

    let notifyEmail: string | null = null
    try {
      const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
      notifyEmail = typeof settings?.email === 'string' ? settings.email : null
    } catch {
      notifyEmail = null
    }

    const mail = await sendEnquiryNotification(
      {
        company,
        contactName,
        email,
        phone: phoneCheck.e164,
        commodityInterest,
        originPreference,
        volume,
        destination,
        message,
      },
      notifyEmail,
    )

    if (!mail.sent) {
      console.error('[enquiry] notification email failed:', mail.error)
    }

    return { ok: true, error: '' }
  } catch (error) {
    console.error('[enquiry] submit failed:', error)
    return {
      ok: false,
      error: 'The file could not be stored. Email info@racegeneraltrading.com instead.',
    }
  }
}

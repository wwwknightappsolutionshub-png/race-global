import { headers } from 'next/headers'
import type { Payload, Where } from 'payload'

const MIN_FORM_MS = 4000
const WINDOW_MS = 24 * 60 * 60 * 1000
const MAX_PER_IP_24H = 8

export async function getClientMeta(): Promise<{ ip: string; userAgent: string }> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for') || ''
  const ip =
    forwarded.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    'unknown'
  const userAgent = h.get('user-agent') || ''
  return { ip, userAgent }
}

export function checkHoneypotAndTiming(formData: FormData): { ok: boolean; error?: string } {
  const honey = String(formData.get('website') || formData.get('fax') || '').trim()
  if (honey) {
    return { ok: false, error: 'Unable to accept this submission.' }
  }

  const startedRaw = String(formData.get('formStartedAt') || '')
  const started = Number(startedRaw)
  if (!Number.isFinite(started) || started <= 0) {
    return { ok: false, error: 'Please reload the page and try again.' }
  }

  const elapsed = Date.now() - started
  if (elapsed < MIN_FORM_MS) {
    return { ok: false, error: 'Please take a moment to complete the form, then submit again.' }
  }

  // Reject absurdly old tokens (replay / cached bots)
  if (elapsed > 6 * 60 * 60 * 1000) {
    return { ok: false, error: 'Please reload the page and try again.' }
  }

  return { ok: true }
}

export function checkMessageQuality(message: string): { ok: boolean; error?: string } {
  const text = message.trim()
  if (text.length < 20) {
    return { ok: false, error: 'Please add a bit more detail to your message (at least 20 characters).' }
  }
  if (text.length > 5000) {
    return { ok: false, error: 'Message is too long.' }
  }

  const urls = text.match(/https?:\/\/|www\./gi) || []
  if (urls.length > 2) {
    return { ok: false, error: 'Please remove extra links from your message.' }
  }

  // Repeated character / keyboard spam
  if (/(.)\1{8,}/.test(text) || /^[a-z0-9]{1,3}(\s+[a-z0-9]{1,3}){12,}$/i.test(text)) {
    return { ok: false, error: 'Unable to accept this submission.' }
  }

  return { ok: true }
}

export async function assertNotDuplicateWithin24h(
  payload: Payload,
  opts: { email: string; phoneNormalized: string | null },
): Promise<{ ok: boolean; error?: string }> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString()
  const or: Where[] = [{ email: { equals: opts.email } }]
  if (opts.phoneNormalized) {
    or.push({ phoneNormalized: { equals: opts.phoneNormalized } })
  }

  const existing = await payload.find({
    collection: 'enquiries',
    where: {
      and: [{ createdAt: { greater_than_equal: since } }, { or }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    return {
      ok: false,
      error: 'This email or phone number was already used in the last 24 hours. Please try again tomorrow.',
    }
  }

  return { ok: true }
}

export async function assertIpRateLimit(
  payload: Payload,
  ip: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!ip || ip === 'unknown') return { ok: true }

  const since = new Date(Date.now() - WINDOW_MS).toISOString()
  const existing = await payload.find({
    collection: 'enquiries',
    where: {
      and: [{ createdAt: { greater_than_equal: since } }, { sourceIp: { equals: ip } }],
    },
    limit: MAX_PER_IP_24H,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.totalDocs >= MAX_PER_IP_24H) {
    return {
      ok: false,
      error: 'Too many enquiries from this network. Please try again later or email the desk directly.',
    }
  }

  return { ok: true }
}

export async function verifyTurnstileIfConfigured(token: string): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { ok: true }

  if (!token) {
    return { ok: false, error: 'Please complete the security check.' }
  }

  try {
    const body = new URLSearchParams({ secret, response: token })
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as { success?: boolean }
    if (!data.success) {
      return { ok: false, error: 'Security check failed. Please try again.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Security check unavailable. Please try again shortly.' }
  }
}

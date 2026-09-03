import { promises as dns } from 'dns'
import net from 'net'
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Common disposable / throwaway domains — bots love these. */
const DISPOSABLE_DOMAINS = new Set(
  [
    'mailinator.com',
    'guerrillamail.com',
    'guerrillamail.net',
    '10minutemail.com',
    'tempmail.com',
    'temp-mail.org',
    'yopmail.com',
    'trashmail.com',
    'sharklasers.com',
    'getnada.com',
    'maildrop.cc',
    'discard.email',
    'fakeinbox.com',
    'mailnesia.com',
    'tempail.com',
    'throwaway.email',
    'moakt.com',
    'emailondeck.com',
    'mintemail.com',
    'mailcatch.com',
    'inboxkitten.com',
    'spamgourmet.com',
  ].map((d) => d.toLowerCase()),
)

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizePhone(phone: string, defaultCountry: 'AE' | 'US' | 'GB' | 'NG' | 'IN' = 'AE'): string | null {
  const parsed = parsePhoneNumberFromString(phone.trim(), defaultCountry)
  if (!parsed || !parsed.isValid()) return null
  return parsed.format('E.164')
}

export async function verifyEmailAddress(rawEmail: string): Promise<{ ok: boolean; error?: string }> {
  const email = normalizeEmail(rawEmail)
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, error: 'Enter a valid email address.' }
  }

  const domain = email.split('@')[1]
  if (!domain || DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, error: 'Please use a permanent business or personal email address.' }
  }

  let mxHosts: string[] = []
  try {
    const records = await dns.resolveMx(domain)
    mxHosts = records
      .sort((a, b) => a.priority - b.priority)
      .map((r) => r.exchange)
      .filter(Boolean)
  } catch {
    try {
      await dns.resolve4(domain)
      mxHosts = [domain]
    } catch {
      return { ok: false, error: 'That email domain does not appear to accept mail.' }
    }
  }

  if (mxHosts.length === 0) {
    return { ok: false, error: 'That email domain does not appear to accept mail.' }
  }

  // Soft mailbox probe: accept only clear positives or inconclusive (catch-all / greylist).
  // Hard rejects (5xx) fail the form so invented addresses are blocked.
  const probe = await probeMailbox(mxHosts[0], email)
  if (probe === 'reject') {
    return { ok: false, error: 'That email address could not be verified. Please check and try again.' }
  }

  return { ok: true }
}

export function verifyPhoneNumber(rawPhone: string): { ok: boolean; e164?: string; error?: string } {
  const trimmed = rawPhone.trim()
  if (!trimmed) {
    return { ok: false, error: 'Phone number is required.' }
  }

  // Prefer explicit international format; also try UAE default for local numbers.
  if (isValidPhoneNumber(trimmed) || isValidPhoneNumber(trimmed, 'AE')) {
    const e164 = normalizePhone(trimmed) || normalizePhone(trimmed, 'AE')
    if (e164) return { ok: true, e164 }
  }

  return {
    ok: false,
    error: 'Enter a valid international phone number (include country code, e.g. +971…).',
  }
}

/**
 * Optional Twilio Lookup (Line Type Intelligence / basic lookup) when credentials exist.
 * Without Twilio we still require libphonenumber-valid numbers.
 */
export async function verifyPhoneExistsGlobally(
  e164: string,
): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) {
    return { ok: true }
  }

  try {
    const url = `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(e164)}?Fields=line_type_intelligence`
    const auth = Buffer.from(`${sid}:${token}`).toString('base64')
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      signal: AbortSignal.timeout(8000),
    })

    if (res.status === 404) {
      return { ok: false, error: 'That phone number does not appear to be in service.' }
    }
    if (!res.ok) {
      // Don't block legitimate users if Lookup is down / misconfigured.
      return { ok: true }
    }

    const data = (await res.json()) as {
      valid?: boolean
      line_type_intelligence?: { type?: string }
    }
    if (data.valid === false) {
      return { ok: false, error: 'That phone number does not appear to be in service.' }
    }

    const type = data.line_type_intelligence?.type?.toLowerCase()
    if (type === 'landline' || type === 'mobile' || type === 'fixedvoip' || type === 'nonfixedvoip' || !type) {
      return { ok: true }
    }
    if (type === 'premium' || type === 'sharedcost') {
      return { ok: false, error: 'Please use a standard mobile or business phone number.' }
    }

    return { ok: true }
  } catch {
    return { ok: true }
  }
}

type ProbeResult = 'accept' | 'reject' | 'inconclusive'

async function probeMailbox(mxHost: string, email: string): Promise<ProbeResult> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: mxHost, port: 25 })
    let settled = false
    let buffer = ''
    let step: 'banner' | 'ehlo' | 'mail' | 'rcpt' | 'done' = 'banner'

    const finish = (result: ProbeResult) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.destroy()
      resolve(result)
    }

    const timer = setTimeout(() => finish('inconclusive'), 6000)

    const send = (line: string) => {
      socket.write(`${line}\r\n`)
    }

    socket.setEncoding('utf8')
    socket.on('error', () => finish('inconclusive'))
    socket.on('data', (chunk: string) => {
      buffer += chunk
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!/^\d{3}[\s-]/.test(line)) continue
        const code = Number(line.slice(0, 3))
        const final = line[3] === ' '

        if (!final) continue

        if (step === 'banner') {
          if (code !== 220) return finish('inconclusive')
          step = 'ehlo'
          send('EHLO racegeneraltrading.com')
          continue
        }

        if (step === 'ehlo') {
          if (code >= 400) return finish('inconclusive')
          step = 'mail'
          send('MAIL FROM:<enquiry-verify@racegeneraltrading.com>')
          continue
        }

        if (step === 'mail') {
          if (code >= 400) return finish('inconclusive')
          step = 'rcpt'
          send(`RCPT TO:<${email}>`)
          continue
        }

        if (step === 'rcpt') {
          step = 'done'
          send('QUIT')
          if (code >= 500 && code < 600) return finish('reject')
          if (code >= 200 && code < 300) return finish('accept')
          return finish('inconclusive')
        }
      }
    })
  })
}

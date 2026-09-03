'use client'

import { useActionState, useEffect, useState } from 'react'
import { submitEnquiry, type EnquiryState } from '../lib/enquiry'

const initial: EnquiryState = { ok: false, error: '' }

type Props = {
  commodities: { name: string }[]
  turnstileSiteKey?: string
}

export function EnquiryForm({ commodities, turnstileSiteKey }: Props) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)
  const [startedAt] = useState(() => Date.now())

  useEffect(() => {
    if (!turnstileSiteKey || typeof window === 'undefined') return
    const existing = document.querySelector('script[data-turnstile]')
    if (existing) return
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.setAttribute('data-turnstile', '1')
    document.head.appendChild(script)
  }, [turnstileSiteKey])

  if (state.ok) {
    return (
      <div className="enquiry-done" role="status">
        <p>File received. We will reply to the desk contact you provided.</p>
      </div>
    )
  }

  return (
    <form className="enquiry" action={action} noValidate={false}>
      <input type="hidden" name="formStartedAt" value={String(startedAt)} />

      {/* Honeypot — leave empty. Hidden from humans, filled by many bots. */}
      <div className="enquiry-hp" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="enquiry-grid">
        <label>
          Company
          <input name="company" required autoComplete="organization" maxLength={200} />
        </label>
        <label>
          Contact name
          <input name="contactName" required autoComplete="name" maxLength={120} />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" maxLength={254} />
        </label>
        <label>
          Phone
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+971 …"
            maxLength={30}
          />
        </label>
        <label>
          Commodity
          <select name="commodityInterest" required defaultValue="">
            <option value="" disabled>
              Select cargo
            </option>
            {commodities.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
            <option value="Other / mixed programme">Other / mixed programme</option>
          </select>
        </label>
        <label>
          Origin preference
          <input name="originPreference" placeholder="Nigeria, Kenya…" maxLength={200} />
        </label>
        <label>
          Volume
          <input name="volume" placeholder="e.g. 2 × 20ft / monthly" maxLength={120} />
        </label>
        <label>
          Destination
          <input name="destination" placeholder="UAE, India…" maxLength={200} />
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows={5} required minLength={20} maxLength={5000} />
      </label>

      {turnstileSiteKey ? (
        <div
          className="cf-turnstile"
          data-sitekey={turnstileSiteKey}
          data-theme="light"
        />
      ) : null}

      {state.error ? <p className="enquiry-error">{state.error}</p> : null}
      <button className="file-btn" type="submit" disabled={pending}>
        {pending ? 'Filing…' : 'File this enquiry'}
      </button>
    </form>
  )
}

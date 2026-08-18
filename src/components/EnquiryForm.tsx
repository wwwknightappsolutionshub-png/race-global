'use client'

import { useActionState } from 'react'
import { submitEnquiry, type EnquiryState } from '../lib/enquiry'

const initial: EnquiryState = { ok: false, error: '' }

type Props = {
  commodities: { name: string }[]
}

export function EnquiryForm({ commodities }: Props) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.ok) {
    return (
      <div className="enquiry-done" role="status">
        <p>File received. We will reply to the desk contact you provided.</p>
      </div>
    )
  }

  return (
    <form className="enquiry" action={action}>
      <div className="enquiry-grid">
        <label>
          Company
          <input name="company" required autoComplete="organization" />
        </label>
        <label>
          Contact name
          <input name="contactName" required autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" autoComplete="tel" />
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
          <input name="originPreference" placeholder="Nigeria, Kenya…" />
        </label>
        <label>
          Volume
          <input name="volume" placeholder="e.g. 2 × 20ft / monthly" />
        </label>
        <label>
          Destination
          <input name="destination" placeholder="UAE, India…" />
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows={5} required />
      </label>
      {state.error ? <p className="enquiry-error">{state.error}</p> : null}
      <button className="file-btn" type="submit" disabled={pending}>
        {pending ? 'Filing…' : 'File this enquiry'}
      </button>
    </form>
  )
}

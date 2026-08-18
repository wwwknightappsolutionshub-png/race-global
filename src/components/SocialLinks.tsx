import type { ReactNode } from 'react'
import { whatsappHref } from '../lib/contact'

type Props = {
  instagram?: string | null
  facebook?: string | null
  twitter?: string | null
  phone?: string | null
  showWhatsApp?: boolean
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a className="social-btn" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </a>
  )
}

export function SocialLinks({ instagram, facebook, twitter, phone, showWhatsApp }: Props) {
  return (
    <div className="social-row">
      {instagram ? (
        <IconLink href={instagram} label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
          </svg>
        </IconLink>
      ) : null}
      {facebook ? (
        <IconLink href={facebook} label="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M14.2 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v2h-2.5v2.8H11V21h3.2Z"
            />
          </svg>
        </IconLink>
      ) : null}
      {twitter ? (
        <IconLink href={twitter} label="Twitter">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19.5 7.4c.5-.3.9-.8 1.1-1.4-.5.3-1 .5-1.6.6A2.2 2.2 0 0 0 15.2 8c0 .2 0 .3.1.5-1.8-.1-3.4-1-4.5-2.4-.2.3-.3.7-.3 1.1 0 .8.4 1.4 1 1.8-.4 0-.8-.1-1.1-.3v.1c0 1.1.8 2 1.8 2.2-.2.1-.4.1-.6.1-.1 0-.3 0-.4-.1.3 1 1.2 1.7 2.2 1.7A4.5 4.5 0 0 1 5 16.2 6.3 6.3 0 0 0 8.4 17c4.1 0 6.4-3.4 6.4-6.4v-.3c.5-.3.9-.8 1.2-1.3-.4.2-.9.3-1.4.4Z"
            />
          </svg>
        </IconLink>
      ) : null}
      {showWhatsApp && phone ? (
        <IconLink href={whatsappHref(phone)} label="WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3.2A8.7 8.7 0 0 0 5.1 16.4L4 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Zm4.9 12.4c-.2.6-1.1 1.1-1.8 1.2-.5.1-1.1.1-1.8 0-1.1-.2-2.5-.8-3.7-2-1.2-1.1-2-2.5-2.2-3.3-.2-.8 0-1.5.3-1.8.3-.4.7-.5 1-.5h.7c.2 0 .5 0 .7.6l.9 2.1c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.4.6.9 1.1 1.5 1.5.3.2.5.1.7-.1l.5-.6c.2-.2.4-.1.6 0l1.9 1c.3.1.4.3.3.6Z"
            />
          </svg>
        </IconLink>
      ) : null}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BrandMark } from './BrandMark'
import { SocialLinks } from './SocialLinks'
import { mediaUrl } from '../lib/media'
import { telHref } from '../lib/contact'

type Props = {
  name: string
  tagline: string
  logo?: unknown
  phone: string
  address: string
  instagram?: string | null
  facebook?: string | null
  twitter?: string | null
}

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/what-we-do', label: 'What we do' },
  { href: '/commodities', label: 'Commodities' },
  { href: '/process', label: 'Process' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader({
  name,
  tagline,
  logo,
  phone,
  address,
  instagram,
  facebook,
  twitter,
}: Props) {
  const [open, setOpen] = useState(false)
  const customLogo = mediaUrl(logo)

  return (
    <header className="site-chrome">
      <div className="utility">
        <SocialLinks instagram={instagram} facebook={facebook} twitter={twitter} />
        <div className="utility-meta">
          <a className="utility-phone" href={telHref(phone)}>
            {phone}
          </a>
          <span className="utility-address">{address}</span>
        </div>
      </div>

      <div className="mast">
        <Link href="/" className="mast-brand" onClick={() => setOpen(false)}>
          {customLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customLogo} alt={name} className="mast-logo" />
          ) : (
            <BrandMark className="mast-mark" />
          )}
          <span className="mast-nameblock">
            <span className="mast-name">{name}</span>
            <span className="mast-tag">{tagline}</span>
          </span>
        </Link>

        <button
          className="mast-toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav className={open ? 'mast-nav is-open' : 'mast-nav'} aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

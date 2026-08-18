import Link from 'next/link'
import { BrandMark } from './BrandMark'
import { SocialLinks } from './SocialLinks'
import { mediaUrl } from '../lib/media'
import { telHref } from '../lib/contact'

type Props = {
  name: string
  legalName: string
  tagline: string
  phone: string
  email: string
  address: string
  website?: string | null
  logo?: unknown
  instagram?: string | null
  facebook?: string | null
  twitter?: string | null
}

export function SiteFooter({
  name,
  legalName,
  tagline,
  phone,
  email,
  address,
  website,
  logo,
  instagram,
  facebook,
  twitter,
}: Props) {
  const customLogo = mediaUrl(logo)

  return (
    <footer className="colophon">
      <div className="colophon-grid">
        <div className="colophon-brand">
          {customLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customLogo} alt={name} className="mast-logo" />
          ) : (
            <BrandMark className="mast-mark" />
          )}
          <p className="colophon-name">{name}</p>
          <p className="colophon-tag">{tagline}</p>
          <p className="colophon-legal">{legalName}</p>
        </div>

        <div>
          <p className="ledger-label">Explore</p>
          <nav>
            <Link href="/about">About</Link>
            <Link href="/what-we-do">What we do</Link>
            <Link href="/commodities">Commodities</Link>
            <Link href="/process">Process</Link>
          </nav>
        </div>

        <div className="colophon-contact">
          <p className="ledger-label">Connect with us</p>
          <p>
            <a href={telHref(phone)}>{phone}</a>
          </p>
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
          {website ? (
            <p>
              <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noreferrer">
                {website}
              </a>
            </p>
          ) : null}
          <p>{address}</p>
        </div>

        <div>
          <p className="ledger-label">We&apos;re Social</p>
          <SocialLinks
            instagram={instagram}
            facebook={facebook}
            twitter={twitter}
            phone={phone}
            showWhatsApp
          />
        </div>
      </div>
    </footer>
  )
}

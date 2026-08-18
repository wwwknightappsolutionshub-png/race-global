import type { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  kicker: string
  title: string
  facts?: { label: string; value: string }[]
  cta?: string
  ctaHref?: string
  children: ReactNode
}

export function DossierFrame({
  kicker,
  title,
  facts = [],
  cta = 'Enquire on this',
  ctaHref = '/contact',
  children,
}: Props) {
  return (
    <div className="dossier">
      <aside className="dossier-spine">
        <p className="ledger-label">{kicker}</p>
        <h1>{title}</h1>
        {facts.length > 0 ? (
          <dl>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {cta ? (
          <Link className="file-btn" href={ctaHref}>
            {cta}
          </Link>
        ) : null}
      </aside>
      <div className="dossier-field">{children}</div>
    </div>
  )
}

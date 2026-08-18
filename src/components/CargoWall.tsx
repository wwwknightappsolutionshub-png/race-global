import Link from 'next/link'
import { mediaAlt, mediaUrl } from '../lib/media'

type Cargo = {
  id: number | string
  name: string
  slug: string
  tagline: string
  originFocus: string
  image?: unknown
}

type Props = {
  items: Cargo[]
  kicker?: string
  heading?: string
  intro?: string
}

export function CargoWall({ items, kicker, heading, intro }: Props) {
  return (
    <section className="cargo">
      {heading ? (
        <div className="intro-head">
          {kicker ? <p className="ledger-label">{kicker}</p> : null}
          <div className="intro-head-row">
            <h2>{heading}</h2>
            {intro ? (
              <div className="prose">
                <p>{intro}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <ul className="cargo-wall">
        {items.map((item, index) => {
          const src = mediaUrl(item.image, 'card')
          return (
            <li key={item.id} className={`crate crate-${(index % 3) + 1}`}>
              <Link href={`/commodities/${item.slug}`}>
                <span className="crate-index">C-{String(index + 1).padStart(2, '0')}</span>
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={mediaAlt(item.image, item.name)} />
                ) : null}
                <span className="crate-copy">
                  <strong>{item.name}</strong>
                  <em>{item.originFocus}</em>
                  <span>{item.tagline}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

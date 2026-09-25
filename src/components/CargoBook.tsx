import Link from 'next/link'
import { mediaAlt, mediaUrl } from '../lib/media'

type Cargo = {
  id: number | string
  name: string
  slug: string
  tagline: string
  image?: unknown
}

type Props = {
  items: Cargo[]
  kicker: string
  heading: string
  intro: string
}

export function CargoBook({ items, kicker, heading, intro }: Props) {
  return (
    <section className="cargo-deck">
      <header className="cargo-deck-mast">
        <p className="ledger-label">{kicker}</p>
        <div className="cargo-deck-mast-grid">
          <h1>{heading}</h1>
          <div className="cargo-deck-lede">
            <p>{intro}</p>
            <p className="book-count">{items.length} commodities on the book</p>
          </div>
        </div>
      </header>

      <ul className="cargo-deck-mosaic">
        {items.map((item, index) => {
          const src = mediaUrl(item.image, 'card')
          return (
            <li key={item.id} className={`cargo-tile cargo-tile-${(index % 6) + 1}`}>
              <Link href={`/commodities/${item.slug}`}>
                <span className="cargo-tile-media">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={mediaAlt(item.image, item.name)} />
                  ) : (
                    <span className="corridor-fallback origin" />
                  )}
                </span>
                <span className="cargo-tile-panel">
                  <strong>{item.name}</strong>
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

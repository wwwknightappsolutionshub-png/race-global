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
  kicker: string
  heading: string
  intro: string
}

export function CargoBook({ items, kicker, heading, intro }: Props) {
  return (
    <section className="book">
      <header className="book-head">
        <p className="ledger-label">{kicker}</p>
        <div className="intro-head-row">
          <h1>{heading}</h1>
          <div className="prose">
            <p>{intro}</p>
            <p className="book-count">{items.length} commodities on the book</p>
          </div>
        </div>
      </header>

      <ol className="book-run">
        {items.map((item, index) => {
          const src = mediaUrl(item.image, 'card')
          return (
            <li key={item.id}>
              <Link className="book-row" href={`/commodities/${item.slug}`}>
                <span className="book-idx">C-{String(index + 1).padStart(2, '0')}</span>
                <span className="book-shot">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={mediaAlt(item.image, item.name)} />
                  ) : (
                    <span className="corridor-fallback origin" />
                  )}
                </span>
                <span className="book-meta">
                  <h2>{item.name}</h2>
                  <em>{item.originFocus}</em>
                  <span>{item.tagline}</span>
                </span>
                <span className="book-open">Open dossier</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

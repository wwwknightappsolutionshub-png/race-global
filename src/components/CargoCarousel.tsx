'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import { mediaAlt, mediaUrl } from '../lib/media'

type Cargo = {
  id: number | string
  name: string
  slug: string
  tagline: string
  originFocus: string
  image?: unknown
}

export function CargoCarousel({ items, heading }: { items: Cargo[]; heading?: string }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const resumeAt = useRef(0)

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const track = trackRef.current
    const card = track?.querySelector('.crate') as HTMLElement | null
    if (!track || !card) return

    const step = (card.offsetWidth + 8) * 2
    const max = Math.max(track.scrollWidth - track.clientWidth, 0)
    let left = track.scrollLeft + direction * step
    if (direction === 1 && left > max - 8) left = 0
    if (direction === -1 && left < 8) left = max
    track.scrollTo({ left, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (items.length <= 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => {
      if (Date.now() < resumeAt.current) return
      scrollByPage(1)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [items.length, scrollByPage])

  return (
    <section className="cargo-carousel" aria-label={heading || 'Other cargo'}>
      <div className="cargo-carousel-bar">
        {heading ? <h2>{heading}</h2> : <span />}
        {items.length > 2 ? (
          <div className="cargo-nav">
            <button
              type="button"
              aria-label="Previous cargo"
              onClick={() => {
                resumeAt.current = Date.now() + 8000
                scrollByPage(-1)
              }}
            >
              Prev
            </button>
            <button
              type="button"
              aria-label="Next cargo"
              onClick={() => {
                resumeAt.current = Date.now() + 8000
                scrollByPage(1)
              }}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
      <ul
        className="cargo-carousel-track"
        ref={trackRef}
        onMouseEnter={() => {
          resumeAt.current = Number.POSITIVE_INFINITY
        }}
        onMouseLeave={() => {
          resumeAt.current = Date.now() + 1200
        }}
      >
        {items.map((item, index) => {
          const src = mediaUrl(item.image, 'card')
          return (
            <li key={item.id} className="crate">
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

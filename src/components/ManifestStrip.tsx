'use client'

import { useEffect, useRef, useState } from 'react'

type Point = {
  id: number | string
  name: string
  role: 'origin' | 'hub' | 'destination'
  region?: string | null
}

export function ManifestStrip({ points }: { points: Point[] }) {
  const roots = points.filter((point) => point.role === 'origin')
  const hub = points.find((point) => point.role === 'hub')
  const destinations = points.filter((point) => point.role === 'destination')
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true)
      },
      { threshold: 0.28 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`corridor-flow${active ? ' is-live' : ''}`}
      aria-label="How we work"
    >
      <div className="corridor-flow-inner">
        <header className="corridor-flow-head">
          <p className="ledger-label">How we work</p>
          <h2>Supply moves through one accountable corridor.</h2>
        </header>

        <div className="corridor-flow-track">
          <div className="corridor-stage corridor-stage-supply">
            <span className="corridor-stage-label">Supply</span>
            <ul>
              {roots.map((point, index) => (
                <li key={point.id} style={{ ['--i' as string]: index }}>
                  <strong>{point.name}</strong>
                  {point.region ? <em>{point.region}</em> : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="corridor-flow-link" aria-hidden="true">
            <span className="corridor-flow-pulse" />
          </div>

          <div className="corridor-stage corridor-stage-hub">
            <span className="corridor-stage-label">Hub</span>
            <div className="corridor-hub-card">
              <strong>{hub?.name ?? 'Dubai'}</strong>
              <em>{hub?.region ?? 'United Arab Emirates'}</em>
            </div>
          </div>

          <div className="corridor-flow-link" aria-hidden="true">
            <span className="corridor-flow-pulse" />
          </div>

          <div className="corridor-stage corridor-stage-markets">
            <span className="corridor-stage-label">Markets</span>
            <ul>
              {destinations.map((point, index) => (
                <li key={point.id} style={{ ['--i' as string]: index }}>
                  <strong>{point.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

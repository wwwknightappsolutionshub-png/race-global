'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Gate = {
  id: number | string
  label: string
  body: string
  order?: number | null
}

export function ProcessGates({ gates }: { gates: Gate[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const resumeAt = useRef(0)
  const [index, setIndex] = useState(0)
  const total = gates.length

  const updateIndex = useCallback(() => {
    const track = trackRef.current
    const card = track?.querySelector('.gate') as HTMLElement | null
    if (!track || !card || total === 0) return
    const step = card.offsetWidth + 16
    const next = Math.round(track.scrollLeft / step)
    setIndex(Math.min(Math.max(next, 0), total - 1))
  }, [total])

  const scrollByCard = useCallback(
    (direction: -1 | 1, smooth = true) => {
      const track = trackRef.current
      const card = track?.querySelector('.gate') as HTMLElement | null
      if (!track || !card) return

      const step = card.offsetWidth + 16
      const max = Math.max(track.scrollWidth - track.clientWidth, 0)
      let left = track.scrollLeft + direction * step

      if (direction === 1 && left > max - 8) left = 0
      if (direction === -1 && left < 8) left = max

      track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
    },
    [],
  )

  const pauseThenResume = () => {
    resumeAt.current = Date.now() + 8000
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', updateIndex, { passive: true })
    updateIndex()
    return () => track.removeEventListener('scroll', updateIndex)
  }, [updateIndex])

  useEffect(() => {
    if (total < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => {
      if (Date.now() < resumeAt.current) return
      scrollByCard(1)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [scrollByCard, total])

  return (
    <section className="gates" aria-label="Trade process">
      <div className="gates-bar">
        <p className="gates-count">
          Gate {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <div className="gates-controls">
          <button
            type="button"
            className="gates-btn"
            aria-label="Previous gate"
            onClick={() => {
              pauseThenResume()
              scrollByCard(-1)
            }}
          >
            Previous
          </button>
          <button
            type="button"
            className="gates-btn"
            aria-label="Next gate"
            onClick={() => {
              pauseThenResume()
              scrollByCard(1)
            }}
          >
            Next
          </button>
        </div>
      </div>
      <div
        className="gates-track"
        ref={trackRef}
        onMouseEnter={() => {
          resumeAt.current = Number.POSITIVE_INFINITY
        }}
        onMouseLeave={() => {
          resumeAt.current = Date.now() + 1200
        }}
      >
        {gates.map((gate, gateIndex) => (
          <article key={gate.id} className="gate">
            <span className="gate-seal">{String(gateIndex + 1).padStart(2, '0')}</span>
            <h3>{gate.label}</h3>
            <p>{gate.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

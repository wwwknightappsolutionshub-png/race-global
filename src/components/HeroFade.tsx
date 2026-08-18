'use client'

import { useEffect, useState } from 'react'

export type HeroSlide = {
  src: string
  alt: string
}

type Props = {
  slides: HeroSlide[]
  stamp: string
  fallback: 'origin' | 'hub'
  interval?: number
  delay?: number
}

export function HeroFade({ slides, stamp, fallback, interval = 5600, delay = 0 }: Props) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return undefined

    let timer: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      timer = setInterval(() => {
        setActive((current) => (current + 1) % slides.length)
      }, interval)
    }, delay)

    return () => {
      clearTimeout(start)
      if (timer) clearInterval(timer)
    }
  }, [slides.length, interval, delay])

  return (
    <div className="corridor-pane">
      {slides.length === 0 ? (
        <div className={`corridor-fallback ${fallback}`} />
      ) : (
        <div className="hero-fade" aria-live="off">
          {slides.map((slide, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${slide.src}-${index}`}
              src={slide.src}
              alt={index === active ? slide.alt : ''}
              className={index === active ? 'is-on' : undefined}
            />
          ))}
        </div>
      )}
      <span className="corridor-stamp">{stamp}</span>
    </div>
  )
}

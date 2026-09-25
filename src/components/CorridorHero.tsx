'use client'

import Link from 'next/link'
import { HeroFade, type HeroSlide } from './HeroFade'

type Props = {
  line: string
  cta: string
  originSlides: HeroSlide[]
  hubSlides: HeroSlide[]
}

export function CorridorHero({ line, cta, originSlides, hubSlides }: Props) {
  const words = line.trim().split(/\s+/).filter(Boolean)

  return (
    <section className="corridor" aria-label={line}>
      <HeroFade slides={originSlides} stamp="Supply" fallback="origin" interval={5600} delay={0} />
      <div className="corridor-seam">
        <h1 className="corridor-line">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="corridor-line-word"
              style={{ ['--i' as string]: index }}
            >
              {word}
              {index < words.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </h1>
        <Link className="file-btn corridor-cta" href="/contact">
          {cta}
        </Link>
      </div>
      <HeroFade slides={hubSlides} stamp="Hub" fallback="hub" interval={6400} delay={2800} />
    </section>
  )
}

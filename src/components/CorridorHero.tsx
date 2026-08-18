import Link from 'next/link'
import { HeroFade, type HeroSlide } from './HeroFade'

type Props = {
  kicker: string
  line: string
  cta: string
  originSlides: HeroSlide[]
  hubSlides: HeroSlide[]
}

export function CorridorHero({ kicker, line, cta, originSlides, hubSlides }: Props) {
  return (
    <section className="corridor">
      <HeroFade slides={originSlides} stamp="Origin" fallback="origin" interval={5600} delay={0} />
      <div className="corridor-seam">
        <p className="corridor-kicker">{kicker}</p>
        <h1>{line}</h1>
        <Link className="file-btn" href="/contact">
          {cta}
        </Link>
      </div>
      <HeroFade slides={hubSlides} stamp="Hub" fallback="hub" interval={6400} delay={2800} />
    </section>
  )
}

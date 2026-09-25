import Link from 'next/link'
import { HeroFade, type HeroSlide } from './HeroFade'

type Props = {
  line: string
  cta: string
  originSlides: HeroSlide[]
  hubSlides: HeroSlide[]
}

export function CorridorHero({ line, cta, originSlides, hubSlides }: Props) {
  return (
    <section className="corridor">
      <HeroFade slides={originSlides} stamp="Supply" fallback="origin" interval={5600} delay={0} />
      <div className="corridor-seam">
        <h1>{line}</h1>
        <Link className="file-btn" href="/contact">
          {cta}
        </Link>
      </div>
      <HeroFade slides={hubSlides} stamp="Hub" fallback="hub" interval={6400} delay={2800} />
    </section>
  )
}

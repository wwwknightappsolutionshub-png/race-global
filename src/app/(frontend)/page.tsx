import Link from 'next/link'
import { CorridorHero } from '../../components/CorridorHero'
import { ValuesLedger } from '../../components/ValuesLedger'
import { CargoWall } from '../../components/CargoWall'
import { ProcessGates } from '../../components/ProcessGates'
import { getSite } from '../../lib/cms'
import { heroSlides, splitParagraphs } from '../../lib/media'

export default async function HomePage() {
  const { settings, copy, commodities, values, gates } = await getSite()
  const homeCta = copy.homeCta && copy.homeCta !== 'Open a cargo enquiry' ? copy.homeCta : 'Contact us'

  return (
    <>
      <CorridorHero
        kicker={copy.homeKicker || 'RGT-00 · Trade corridor'}
        line={settings.heroLine}
        cta={homeCta}
        originSlides={heroSlides(copy.heroOriginImage, copy.heroOriginGallery, 'African origin')}
        hubSlides={heroSlides(copy.heroHubImage, copy.heroHubGallery, 'Dubai trade hub')}
      />

      <section className="band intro-band">
        <div className="intro-head">
          <p className="ledger-label">Company</p>
          <div className="intro-head-row">
            <h2>{settings.legalName}</h2>
            <div className="prose">
              {splitParagraphs(copy.homeIntro).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <ValuesLedger
          variant="sheet"
          values={values.map((value) => ({
            id: value.id,
            title: value.title,
            body: value.body,
          }))}
        />
      </section>

      <div className="band cargo-band">
        <CargoWall
          kicker={copy.cargoKicker || 'Cargo'}
          heading={copy.cargoHeading || 'Cargo on the book'}
          intro={
            copy.cargoIntro ||
            'We specialize in the international sourcing and export of high-quality agricultural commodities from African origin through Dubai.'
          }
          items={commodities
            .filter((item) => item.featured)
            .map((item) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              tagline: item.tagline,
              originFocus: item.originFocus,
              image: item.image,
            }))}
        />
      </div>

      <section className="band process-head">
        <p className="ledger-label">{copy.processKicker}</p>
        <h2>Eight gates. One accountable corridor.</h2>
      </section>
      <ProcessGates
        gates={gates.map((gate) => ({
          id: gate.id,
          label: gate.label,
          body: gate.body,
        }))}
      />

      <section className="why">
        <h2>Why we are preferred by many</h2>
        <div className="why-list">
          {(copy.reasons || []).map((reason) => (
            <article key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="close-band">
        <h2>{copy.contactHeading}</h2>
        <Link className="file-btn" href="/contact">
          {homeCta}
        </Link>
      </section>
    </>
  )
}

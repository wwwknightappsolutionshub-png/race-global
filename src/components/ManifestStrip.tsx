type Point = {
  id: number | string
  name: string
  role: 'origin' | 'hub' | 'destination'
  region?: string | null
}

export function ManifestStrip({ points }: { points: Point[] }) {
  const origins = points.filter((point) => point.role === 'origin')
  const hub = points.find((point) => point.role === 'hub')
  const destinations = points.filter((point) => point.role === 'destination')

  return (
    <section className="manifest" aria-label="Trade corridor">
      <p className="ledger-label">How we work</p>
      <div className="manifest-row">
        <div>
          <span className="manifest-role">Origin</span>
          <ol>
            {origins.map((point) => (
              <li key={point.id}>
                <strong>{point.name}</strong>
                {point.region ? <em>{point.region}</em> : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="manifest-arrow" aria-hidden="true">
          →
        </div>
        <div className="manifest-hub">
          <span className="manifest-role">Hub</span>
          <p>
            <strong>{hub?.name ?? 'Dubai'}</strong>
            <em>{hub?.region ?? 'United Arab Emirates'}</em>
          </p>
        </div>
        <div className="manifest-arrow" aria-hidden="true">
          →
        </div>
        <div>
          <span className="manifest-role">Destination</span>
          <ol>
            {destinations.map((point) => (
              <li key={point.id}>
                <strong>{point.name}</strong>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

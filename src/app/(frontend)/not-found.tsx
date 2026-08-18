import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="band">
      <p className="ledger-label">RGT-404</p>
      <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', margin: '12px 0 20px' }}>This file is not on the corridor.</h1>
      <Link className="file-btn" href="/">
        Return home
      </Link>
    </div>
  )
}

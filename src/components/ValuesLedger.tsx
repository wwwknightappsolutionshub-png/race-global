'use client'

import { useState } from 'react'

type Value = {
  id: number | string
  title: string
  body: string
}

type Props = {
  values: Value[]
  variant?: 'stack' | 'sheet' | 'accordion'
}

export function ValuesLedger({ values, variant = 'stack' }: Props) {
  const [openId, setOpenId] = useState<Value['id'] | null>(null)

  if (variant === 'accordion') {
    return (
      <ol className="ledger accordion">
        {values.map((value, index) => {
          const open = openId === value.id
          return (
            <li key={value.id} className={open ? 'is-open' : undefined}>
              <button
                type="button"
                className="ledger-toggle"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : value.id)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{value.title}</h3>
                <em aria-hidden="true">{open ? '−' : '+'}</em>
              </button>
              <div className="ledger-panel" hidden={!open}>
                <p>{value.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol className={variant === 'sheet' ? 'ledger sheet' : 'ledger'}>
      {values.map((value, index) => (
        <li key={value.id}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{value.title}</h3>
            <p>{value.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

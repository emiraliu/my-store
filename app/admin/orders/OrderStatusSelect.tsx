'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus } from './actions'

const STATUSES = [
  { value: 'pending_confirmation', label: 'Pending' },
  { value: 'confirmed',   label: 'Confirmed' },
  { value: 'processing',  label: 'Processing' },
  { value: 'shipped',     label: 'Shipped' },
  { value: 'delivered',   label: 'Delivered' },
  { value: 'cancelled',   label: 'Cancelled' },
]

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState(false)
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    const prev = status
    setStatus(next)
    setError(false)

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, next)
        router.refresh()
      } catch {
        setStatus(prev)
        setError(true)
      }
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        style={{
          border: `0.5px solid ${error ? '#9b4d4d' : 'rgba(44,37,32,0.18)'}`,
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 12,
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          color: '#2c2520',
          background: '#fbf7ef',
          outline: 'none',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.5 : 1,
        }}
      >
        {STATUSES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {error && (
        <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 9.5, color: '#9b4d4d', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Failed
        </span>
      )}
    </div>
  )
}

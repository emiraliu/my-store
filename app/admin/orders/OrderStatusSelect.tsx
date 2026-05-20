'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'pending_confirmation', label: 'Pending confirmation' },
  { value: 'confirmed',   label: 'Confirmed' },
  { value: 'processing',  label: 'Processing' },
  { value: 'shipped',     label: 'Shipped' },
  { value: 'delivered',   label: 'Delivered' },
  { value: 'cancelled',   label: 'Cancelled' },
]

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value
    startTransition(async () => {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    })
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      style={{
        border: '0.5px solid rgba(44,37,32,0.18)',
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 12,
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        color: '#2c2520',
        background: '#fbf7ef',
        outline: 'none',
        cursor: 'pointer',
        opacity: isPending ? 0.5 : 1,
      }}
    >
      {STATUSES.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}

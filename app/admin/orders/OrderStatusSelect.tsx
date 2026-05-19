'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'pending_confirmation', label: 'Pending confirmation' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
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
      className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-black transition-colors bg-white disabled:opacity-50"
    >
      {STATUSES.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}

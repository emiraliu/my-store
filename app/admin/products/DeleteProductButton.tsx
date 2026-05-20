'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('Delete this product?')) return
    startTransition(async () => {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#9b4d4d', fontSize: 12, opacity: isPending ? 0.5 : 1,
        fontFamily: "var(--font-dm-mono), monospace", letterSpacing: '0.04em',
      }}
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}

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
      className="text-red-500 hover:text-red-700 text-xs underline disabled:opacity-50"
    >
      {isPending ? '...' : 'Delete'}
    </button>
  )
}

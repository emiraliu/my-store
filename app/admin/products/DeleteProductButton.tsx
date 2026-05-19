'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('Delete this product?')) return
    startTransition(async () => {
      const supabase = createClient()
      await supabase.from('products').update({ active: false }).eq('id', id)
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

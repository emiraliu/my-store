'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
    >
      <LogOut size={13} />
      Sign out
    </button>
  )
}

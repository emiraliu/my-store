'use client'

import { useRouter } from 'next/navigation'

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
      title="Sign out"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#6b5e52', padding: 4,
        fontSize: 10,
        fontFamily: "var(--font-dm-mono), monospace",
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}
    >
      Out
    </button>
  )
}

'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    window.location.href = '/verify'
  }

  return (
    <button
      onClick={handleLogout}
      title="Sign out"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#6e6e6e', padding: 4,
        fontSize: 10,
        fontFamily: "var(--font-dm-mono), monospace",
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}
    >
      Out
    </button>
  )
}

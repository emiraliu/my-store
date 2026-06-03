'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 20px', borderRadius: 999,
        border: '0.5px solid var(--c-line)',
        background: 'transparent', color: 'var(--c-ink-mute)',
        fontFamily: 'var(--f-body)', fontSize: 13,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget.style.background = '#fff0f0')
        ;(e.currentTarget.style.borderColor = '#fca5a5')
        ;(e.currentTarget.style.color = '#dc2626')
      }}
      onMouseLeave={e => {
        (e.currentTarget.style.background = 'transparent')
        ;(e.currentTarget.style.borderColor = 'var(--c-line)')
        ;(e.currentTarget.style.color = 'var(--c-ink-mute)')
      }}
    >
      <LogOut size={14} strokeWidth={1.6} />
      Sign out
    </button>
  )
}

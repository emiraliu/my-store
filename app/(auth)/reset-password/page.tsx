'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '0.5px solid var(--c-line)',
  borderRadius: 10, padding: '12px 14px',
  fontSize: 14, fontFamily: 'var(--f-body)',
  background: 'var(--c-bg)', color: 'var(--c-ink)',
  outline: 'none',
}

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    // Listen for the PASSWORD_RECOVERY event which fires when
    // the user arrives via the email reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    // Also handle case where session is already active
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.replace('/')
    router.refresh()
  }

  if (!ready) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Validating reset link…
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--c-bg)', padding: '60px 22px 120px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>
            Reset password
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 38, fontWeight: 500, lineHeight: 1 }}>
            New password<span style={{ fontStyle: 'italic' }}>.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ display: 'block', fontSize: 11, fontFamily: 'var(--f-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>
              New password
            </div>
            <div style={{ position: 'relative' }}>
              <input
                style={inputStyle} type={showPassword ? 'text' : 'password'}
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters" required minLength={8} autoFocus
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--c-ink-mute)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(181,112,77,0.08)', border: '0.5px solid var(--c-accent)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 13, color: 'var(--c-accent)', fontFamily: 'var(--f-body)',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            marginTop: 4, background: 'var(--c-ink)', color: 'var(--c-card)',
            border: 'none', borderRadius: 999, padding: '14px',
            fontSize: 14, fontFamily: 'var(--f-body)', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            width: '100%',
          }}>
            {loading ? 'Saving…' : 'Set new password'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--c-ink-mute)', fontFamily: 'var(--f-body)' }}>
          <Link href="/verify" style={{ color: 'var(--c-ink-mute)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}

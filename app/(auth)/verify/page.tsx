'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '0.5px solid var(--c-line)',
  borderRadius: 10, padding: '12px 14px',
  fontSize: 14, fontFamily: 'var(--f-body)',
  background: 'var(--c-bg)', color: 'var(--c-ink)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11,
  fontFamily: 'var(--f-mono)', letterSpacing: '0.06em',
  textTransform: 'uppercase', color: 'var(--c-ink-mute)',
  marginBottom: 6,
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/profile')
    })
  }, [])

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      return
    }

    if (data.admin) {
      router.replace('/admin')
    } else {
      router.replace('/')
    }
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--c-bg)',
      padding: '60px 22px 120px',
    }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>
            Welcome back
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 38, fontWeight: 500, lineHeight: 1 }}>
            Sign in<span style={{ fontStyle: 'italic', color: 'var(--c-accent)' }}>.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Username, email or phone</label>
            <input
              style={inputStyle} type="text"
              value={identifier} onChange={e => setIdentifier(e.target.value)}
              placeholder="username" required
              autoComplete="username"
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                style={inputStyle} type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Your password" required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--c-ink-mute)',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
              >
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

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 4, background: 'var(--c-ink)', color: 'var(--c-card)',
              border: 'none', borderRadius: 999, padding: '14px',
              fontSize: 14, fontFamily: 'var(--f-body)', fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--c-ink-mute)', fontFamily: 'var(--f-body)' }}>
          <Link href="/forgot-password" style={{ color: 'var(--c-ink-mute)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Forgot password?</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--c-ink-mute)', fontFamily: 'var(--f-body)' }}>
          Don{"'"}t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--c-ink)', fontWeight: 500 }}>Create one</Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    setLoading(false)
    if (res.ok) {
      router.replace('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Invalid credentials')
    }
  }

  const inputStyle: React.CSSProperties = {
    height: 46, borderRadius: 10,
    border: '0.5px solid rgba(44,37,32,0.18)',
    background: '#fbf7ef',
    padding: '0 14px',
    fontSize: 14, fontFamily: F.body,
    color: '#2c2520', outline: 'none',
    boxSizing: 'border-box', width: '100%',
  }

  return (
    <>
      <style>{`
        .sa-login-root { display: grid; grid-template-columns: 1fr 1fr; }
        .sa-login-art  { display: flex; }
        .sa-login-form { padding: 48px 64px !important; }
        @media (max-width: 767px) {
          .sa-login-root { grid-template-columns: 1fr; }
          .sa-login-art  { display: none; }
          .sa-login-form { padding: 40px 24px 40px !important; }
        }
      `}</style>
      <div
        className="sa-login-root"
        style={{ position: 'fixed', inset: 0, zIndex: 50, fontFamily: F.body, color: '#2c2520' }}
      >
        {/* ── Left art panel ── */}
        <div className="sa-login-art" style={{
          background: '#7a5a48',
          backgroundImage: [
            'radial-gradient(circle at 20% 80%, rgba(217,179,154,0.35) 0, transparent 45%)',
            'radial-gradient(circle at 80% 20%, rgba(240,231,212,0.18) 0, transparent 50%)',
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 16px)',
          ].join(', '),
          color: '#fbf7ef',
          padding: '44px 48px 36px',
          flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
          {/* Top label */}
          <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7 }}>
            MyStore · Admin
          </div>

          {/* Brand blurb */}
          <div>
            <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 10 }}>
              Behind the store
            </div>
            <h1 style={{
              fontFamily: F.display,
              fontSize: 36, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.01em',
              margin: '0 0 12px', color: '#fbf7ef', whiteSpace: 'nowrap',
            }}>
              Quietly run the shop<em style={{ fontStyle: 'italic', color: '#d9b39a' }}>.</em>
            </h1>
            <p style={{
              fontFamily: F.mono,
              fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
              opacity: 0.65, margin: 0,
            }}>
              MyStore · Admin
            </p>
          </div>

          {/* Bottom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: '#d9b39a', display: 'inline-block' }} />
            Admin panel
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="sa-login-form" style={{
          background: '#efe9df',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', marginBottom: 10 }}>
              Sign in to Admin
            </div>
            <h2 style={{
              fontFamily: F.display,
              fontSize: 32, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em',
              margin: '0 0 4px',
            }}>
              Welcome back<em style={{ fontStyle: 'italic', color: '#b5704d' }}>.</em>
            </h2>
            <p style={{ fontFamily: F.display, fontStyle: 'italic', fontSize: 13, color: '#6b5e52', margin: 0 }}>
              Use your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <span style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52' }}>
                Username
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <span style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52' }}>
                Password
              </span>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 50 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: F.mono, fontSize: 10,
                    color: '#6b5e52', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 20px', fontSize: 12.5 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6b5e52', cursor: 'pointer' }}>
                <div
                  onClick={() => setKeepSignedIn(v => !v)}
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: '0.5px solid rgba(44,37,32,0.18)',
                    background: keepSignedIn ? '#2c2520' : '#fbf7ef',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  {keepSignedIn && (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#fbf7ef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                Keep me signed in
              </label>
              <span style={{ fontFamily: F.mono, fontSize: 10, color: '#6b5e52', letterSpacing: '0.04em' }}>
                Secured · 2FA on
              </span>
            </div>

            {error && (
              <div style={{
                background: 'rgba(155,77,77,0.08)', border: '0.5px solid #9b4d4d',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, color: '#9b4d4d', marginBottom: 14,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 48, borderRadius: 999,
                background: '#2c2520', color: '#fbf7ef',
                border: 'none', fontSize: 14, fontWeight: 500,
                letterSpacing: '0.03em', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: F.body,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in to admin'}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: 24, paddingTop: 18,
            borderTop: '0.5px solid rgba(44,37,32,0.10)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 8,
          }}>
            <Link href="/" style={{
              fontFamily: F.body, fontSize: 12, color: '#6b5e52',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              ← Back to store
            </Link>
            <span style={{ fontFamily: F.mono, fontSize: 9.5, color: '#6b5e52', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              No account? Contact owner
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

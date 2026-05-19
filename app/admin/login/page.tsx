'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f4f4f5',
    }}>
      <div style={{
        background: 'white', borderRadius: 16,
        padding: '40px 36px', width: '100%', maxWidth: 380,
        boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
      }}>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#71717a', marginBottom: 6 }}>
          Admin
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, color: '#09090b' }}>MY STORE</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f3f46', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: '100%', border: '1px solid #e4e4e7', borderRadius: 8,
                padding: '10px 14px', fontSize: 14, outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f3f46', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%', border: '1px solid #e4e4e7', borderRadius: 8,
                padding: '10px 14px', fontSize: 14, outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#09090b', color: 'white', border: 'none',
              borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1, marginTop: 4,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

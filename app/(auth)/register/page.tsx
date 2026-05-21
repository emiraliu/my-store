'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say']

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

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, surname, gender, age, username, password, phone }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      return
    }

    router.replace('/')
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
            New account
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 38, fontWeight: 500, lineHeight: 1 }}>
            Join us<span style={{ fontStyle: 'italic', color: 'var(--c-accent)' }}>.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>First name</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Ana" required />
            </div>
            <div>
              <label style={labelStyle}>Last name</label>
              <input style={inputStyle} value={surname} onChange={e => setSurname(e.target.value)} placeholder="Yıldız" required />
            </div>
          </div>

          {/* Gender + Age row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Gender</label>
              <select
                style={{ ...inputStyle, appearance: 'none', backgroundImage: 'none' }}
                value={gender} onChange={e => setGender(e.target.value)} required
              >
                <option value="" disabled>Select</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <input
                style={inputStyle} type="number" min={13} max={120}
                value={age} onChange={e => setAge(e.target.value)}
                placeholder="24" required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label style={labelStyle}>Username</label>
            <input
              style={inputStyle} value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="ana_yildiz" required minLength={3} maxLength={20}
            />
            <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', marginTop: 4, fontFamily: 'var(--f-mono)' }}>
              Letters, numbers, underscores · 3–20 chars
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                style={inputStyle} type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters" required minLength={8}
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

          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone number</label>
            <input
              style={inputStyle} type="tel"
              value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+44 7911 123456" required
            />
            <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', marginTop: 4, fontFamily: 'var(--f-mono)' }}>
              Include country code · e.g. +44, +1, +90
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--c-ink-mute)', fontFamily: 'var(--f-body)' }}>
          Already have an account?{' '}
          <Link href="/verify" style={{ color: 'var(--c-ink)', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}

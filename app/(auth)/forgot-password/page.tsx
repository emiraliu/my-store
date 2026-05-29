'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

type Step = 'phone' | 'otp' | 'password'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
    setToken(data.token)
    setStep('otp')
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) { setError('Enter the 6-digit code.'); return }
    setStep('password')
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, otp, newPassword }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
    router.replace('/')
    router.refresh()
  }

  const stepLabel = step === 'phone' ? '1 / 3' : step === 'otp' ? '2 / 3' : '3 / 3'

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--c-bg)', padding: '60px 22px 120px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>
            Reset password · {stepLabel}
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 38, fontWeight: 500, lineHeight: 1 }}>
            {step === 'phone' && <>Forgot password<span style={{ fontStyle: 'italic' }}>.</span></>}
            {step === 'otp'   && <>Check your phone<span style={{ fontStyle: 'italic' }}>.</span></>}
            {step === 'password' && <>New password<span style={{ fontStyle: 'italic' }}>.</span></>}
          </div>
          {step === 'otp' && (
            <p style={{ marginTop: 8, fontSize: 13, color: 'var(--c-ink-mute)', fontFamily: 'var(--f-body)', lineHeight: 1.5 }}>
              We sent a 6-digit code to <strong style={{ color: 'var(--c-ink)' }}>{phone}</strong>.
            </p>
          )}
        </div>

        {/* Step 1: phone */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Phone number</label>
              <input
                style={inputStyle} type="tel"
                value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+355 69 000 0000" required autoFocus
              />
            </div>
            {error && <ErrorBox>{error}</ErrorBox>}
            <SubmitBtn loading={loading}>Send code</SubmitBtn>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--c-ink-mute)', fontFamily: 'var(--f-body)' }}>
              Remembered it?{' '}
              <Link href="/verify" style={{ color: 'var(--c-ink)', fontWeight: 500 }}>Sign in</Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>6-digit code</label>
              <input
                style={{ ...inputStyle, letterSpacing: '0.2em', fontSize: 22, textAlign: 'center' }}
                type="text" inputMode="numeric" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000" required autoFocus
              />
            </div>
            {error && <ErrorBox>{error}</ErrorBox>}
            <SubmitBtn loading={false}>Continue</SubmitBtn>
            <button
              type="button"
              onClick={() => { setStep('phone'); setOtp(''); setError('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--c-ink-mute)', fontFamily: 'var(--f-body)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              Use a different number
            </button>
          </form>
        )}

        {/* Step 3: new password */}
        {step === 'password' && (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>New password</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={inputStyle} type={showPassword ? 'text' : 'password'}
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters" required minLength={8} autoFocus
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
            {error && <ErrorBox>{error}</ErrorBox>}
            <SubmitBtn loading={loading}>Set new password</SubmitBtn>
          </form>
        )}

      </div>
    </div>
  )
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(181,112,77,0.08)', border: '0.5px solid var(--c-accent)',
      borderRadius: 8, padding: '10px 14px',
      fontSize: 13, color: 'var(--c-accent)', fontFamily: 'var(--f-body)',
    }}>
      {children}
    </div>
  )
}

function SubmitBtn({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit" disabled={loading}
      style={{
        marginTop: 4, background: 'var(--c-ink)', color: 'var(--c-card)',
        border: 'none', borderRadius: 999, padding: '14px',
        fontSize: 14, fontFamily: 'var(--f-body)', fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}

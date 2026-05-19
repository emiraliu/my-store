'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function VerifyForm() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') ?? ''
  const name = searchParams.get('name') ?? ''
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, token }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Invalid code. Please try again.')
        return
      }
      router.push('/')
      router.refresh()
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Check your messages</h1>
        <p className="text-zinc-500 text-sm mb-8">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-zinc-800">{phone || 'your phone'}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              value={token}
              onChange={e => setToken(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm text-center tracking-[0.3em] text-lg outline-none focus:border-black transition-colors"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isPending || token.length < 6}
            className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Verifying...' : 'Verify & sign in'}
          </button>
        </form>

        <button
          onClick={() => router.push(`/register`)}
          className="w-full mt-4 text-sm text-zinc-500 hover:text-black transition-colors"
        >
          Use a different number
        </button>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}

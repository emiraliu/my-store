'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    const normalized = phone.trim().startsWith('+') ? phone.trim() : `+${phone.trim()}`
    if (normalized.length < 8) {
      setError('Please enter a valid phone number with country code (e.g. +1234567890).')
      return
    }

    startTransition(async () => {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalized, fullName }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to send OTP. Try again.')
        return
      }
      router.push(`/verify?phone=${encodeURIComponent(normalized)}&name=${encodeURIComponent(fullName)}`)
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className="text-zinc-500 text-sm mb-8">
          Enter your phone number to get a verification code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              required
            />
            <p className="text-xs text-zinc-400 mt-1">Include country code, e.g. +1 for US</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Sending code...' : 'Send verification code'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link href="/verify" className="text-black font-medium underline">
            Enter code
          </Link>
        </p>
      </div>
    </div>
  )
}

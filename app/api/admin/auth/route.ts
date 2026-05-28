import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // Sign in with Supabase using their real account credentials
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin-session', 'admin-authed', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin-session', '', { maxAge: 0, path: '/' })
  return res
}

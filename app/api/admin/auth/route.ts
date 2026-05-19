import { NextResponse } from 'next/server'

const ADMIN_USER = process.env.ADMIN_USERNAME ?? 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? 'admin'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin-session', 'admin-authed', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin-session', '', { maxAge: 0, path: '/' })
  return res
}

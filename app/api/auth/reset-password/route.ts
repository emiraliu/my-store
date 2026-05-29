import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

function verifyToken(token: string): { phone: string; otp: string; exp: number } | null {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return null
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(payload).digest('base64url')
  if (sig !== expected) return null
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString())
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const { token, otp, newPassword } = await req.json()

  if (!token || !otp || !newPassword) {
    return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const data = verifyToken(token)
  if (!data) {
    return NextResponse.json({ error: 'Invalid session. Please start over.' }, { status: 400 })
  }
  if (Date.now() > data.exp) {
    return NextResponse.json({ error: 'Code expired. Please start over.' }, { status: 400 })
  }
  if (otp.trim() !== data.otp) {
    return NextResponse.json({ error: 'Incorrect code.' }, { status: 400 })
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('phone', data.phone)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
  }

  const { error: updateErr } = await admin.auth.admin.updateUserById(profile.id, {
    password: newPassword,
  })
  if (updateErr) {
    return NextResponse.json({ error: 'Failed to reset password. Try again.' }, { status: 500 })
  }

  // Auto sign-in after reset
  const fakeEmail = `${data.phone.replace('+', '')}@mystore.user`
  const supabase = await createClient()
  await supabase.auth.signInWithPassword({ email: fakeEmail, password: newPassword })

  return NextResponse.json({ ok: true })
}

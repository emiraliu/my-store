import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

function normalizePhone(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\s\-\(\)]/g, '')
  const withPlus = cleaned.startsWith('+') ? cleaned : `+${cleaned}`
  return /^\+[1-9]\d{7,14}$/.test(withPlus) ? withPlus : null
}

function isUsername(value: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(value.trim())
}

export async function POST(req: NextRequest) {
  const { identifier, password } = await req.json()

  if (!identifier || !password) {
    return NextResponse.json({ error: 'Username/phone and password are required.' }, { status: 400 })
  }

  // Admin shortcut — checked before any DB lookup
  if (ADMIN_USERNAME && identifier === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true, admin: true })
    res.cookies.set('admin-session', 'admin-authed', {
      httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax',
    })
    return res
  }

  // Regular user login
  let fakeEmail: string

  // Email login — sign in directly with the real email
  if (identifier.includes('@')) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: identifier.trim().toLowerCase(), password })
    if (error) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    return NextResponse.json({ ok: true })
  }

  const normalizedPhone = normalizePhone(identifier)
  if (normalizedPhone) {
    fakeEmail = `${normalizedPhone.replace('+', '')}@mystore.user`
  } else if (isUsername(identifier)) {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data: profile } = await admin
      .from('profiles')
      .select('id, phone')
      .eq('username', identifier.trim().toLowerCase())
      .maybeSingle()

    if (!profile?.phone) {
      return NextResponse.json({ error: 'No account found with that username.' }, { status: 401 })
    }

    // Use the actual email stored in Supabase Auth — may be a real email or the fake phone-based one
    const { data: { user: authUser } } = await admin.auth.admin.getUserById(profile.id)
    fakeEmail = authUser?.email ?? `${profile.phone.replace('+', '')}@mystore.user`
  } else {
    return NextResponse.json({ error: 'Enter a valid username or phone number.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password })

  if (error) {
    return NextResponse.json({ error: 'Incorrect credentials.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}

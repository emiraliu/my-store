import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

function normalizePhone(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\s\-\(\)]/g, '')
  const withPlus = cleaned.startsWith('+') ? cleaned : `+${cleaned}`
  return /^\+[1-9]\d{7,14}$/.test(withPlus) ? withPlus : null
}

export async function POST(req: NextRequest) {
  const { name, surname, gender, age, username, password, phone } = await req.json()

  if (!name?.trim() || !surname?.trim() || !gender || !age || !username?.trim() || !password || !phone) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }
  const ageNum = parseInt(age)
  if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
    return NextResponse.json({ error: 'Age must be between 13 and 120.' }, { status: 400 })
  }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json({ error: 'Username must be 3–20 characters: letters, numbers, underscores.' }, { status: 400 })
  }

  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) {
    return NextResponse.json({ error: 'Enter a valid international phone number (e.g. +447911123456).' }, { status: 400 })
  }

  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Check phone already taken
  const { data: existingPhone } = await admin
    .from('profiles')
    .select('id')
    .eq('phone', normalizedPhone)
    .maybeSingle()
  if (existingPhone) {
    return NextResponse.json({ error: 'An account with this phone number already exists.' }, { status: 400 })
  }

  // Check username already taken (only if column exists)
  const { data: existingUser } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .maybeSingle()
  if (existingUser) {
    return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 })
  }

  // Create auth user
  const fakeEmail = `${normalizedPhone.replace('+', '')}@mystore.user`
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: fakeEmail,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name.trim(),
      surname: surname.trim(),
      gender,
      age: ageNum,
      username: username.toLowerCase(),
      phone: normalizedPhone,
    },
  })

  if (createErr || !created.user) {
    console.error('[signup] createUser error:', createErr)
    return NextResponse.json(
      { error: createErr?.message ?? 'Failed to create account.' },
      { status: 400 }
    )
  }

  // Explicitly upsert profile — covers cases where the DB trigger fails
  const { error: profileErr } = await admin.from('profiles').upsert({
    id: created.user.id,
    phone: normalizedPhone,
    full_name: name.trim(),
    surname: surname.trim(),
    username: username.toLowerCase(),
    gender,
    age: ageNum,
  }, { onConflict: 'id' })

  if (profileErr) {
    console.error('[signup] profile upsert error:', profileErr)
    // Clean up the orphaned auth user so the next attempt doesn't get "already exists"
    await admin.auth.admin.deleteUser(created.user.id)
    return NextResponse.json(
      { error: 'Could not save your profile. Make sure the database schema is up to date.' },
      { status: 500 }
    )
  }

  // Sign in to establish session cookies
  const supabase = await createClient()
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email: fakeEmail,
    password,
  })
  if (signInErr) {
    return NextResponse.json({ error: signInErr.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

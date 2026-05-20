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

  // Basic validation
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

  // Use service-role client to check uniqueness and create user
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

  // Check username already taken
  const { data: existingUser } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .maybeSingle()
  if (existingUser) {
    return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 })
  }

  // Create auth user (email_confirm: true skips email verification)
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
    return NextResponse.json({ error: createErr?.message ?? 'Failed to create account.' }, { status: 400 })
  }

  // Sign in immediately to establish session cookies
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

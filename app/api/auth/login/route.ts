import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normalizePhone(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\s\-\(\)]/g, '')
  const withPlus = cleaned.startsWith('+') ? cleaned : `+${cleaned}`
  return /^\+[1-9]\d{7,14}$/.test(withPlus) ? withPlus : null
}

export async function POST(req: NextRequest) {
  const { phone, password } = await req.json()

  if (!phone || !password) {
    return NextResponse.json({ error: 'Phone and password are required.' }, { status: 400 })
  }

  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) {
    return NextResponse.json({ error: 'Enter a valid international phone number (e.g. +447911123456).' }, { status: 400 })
  }

  const fakeEmail = `${normalizedPhone.replace('+', '')}@mystore.user`
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password })

  if (error) {
    return NextResponse.json({ error: 'Incorrect phone number or password.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { createHmac, randomInt } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getTwilioClient } from '@/lib/twilio'

function normalizePhone(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\s\-\(\)]/g, '')
  const withPlus = cleaned.startsWith('+') ? cleaned : `+${cleaned}`
  return /^\+[1-9]\d{7,14}$/.test(withPlus) ? withPlus : null
}

function makeToken(phone: string, otp: string): string {
  const exp = Date.now() + 10 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ phone, otp, exp })).toString('base64url')
  const sig = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  // ── Email flow ──────────────────────────────────────────
  if (body.email) {
    const email = body.email.trim().toLowerCase()
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hidayawear.com'
    const supabase = await createServerClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    })

    // Always return OK — don't reveal whether the email exists
    if (error) console.error('[forgot/email]', error.message)
    return NextResponse.json({ ok: true })
  }

  // ── Phone / SMS flow ────────────────────────────────────
  const { phone } = body
  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) {
    return NextResponse.json({ error: 'Enter a valid phone number.' }, { status: 400 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('phone', normalizedPhone)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: 'No account found with this phone number.' }, { status: 404 })
  }

  const otp = String(randomInt(100000, 999999))
  const token = makeToken(normalizedPhone, otp)

  try {
    const twilio = getTwilioClient()
    await twilio.messages.create({
      body: `Your Hidaya Wear password reset code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: normalizedPhone,
    })
  } catch (e) {
    console.error('[forgot/sms]', e)
    return NextResponse.json({ error: 'Failed to send SMS. Try resetting with your email instead.' }, { status: 500 })
  }

  return NextResponse.json({ token })
}

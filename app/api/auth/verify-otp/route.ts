import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { phone, token } = await req.json()

  if (!phone || !token) {
    return Response.json({ error: 'Phone and token are required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ success: true })
}

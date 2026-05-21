import { createAdminClient } from '@/lib/supabase/server'
import { sendOrderConfirmedSMS, validateTwilioSignature } from '@/lib/twilio'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const params = Object.fromEntries(new URLSearchParams(body))

  const signature = req.headers.get('x-twilio-signature') ?? ''
  const isValid = validateTwilioSignature(
    process.env.TWILIO_AUTH_TOKEN!,
    signature,
    req.url,
    params
  )
  if (!isValid) {
    return new Response('Forbidden', { status: 403 })
  }

  const from: string = params.From ?? ''
  const messageBody: string = (params.Body ?? '').trim().toUpperCase()

  const confirmed = messageBody === 'YES' || messageBody === 'CONFIRM'

  if (!confirmed || !from) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>Sorry, we didn't understand that. Reply YES to confirm your order.</Message></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }

  const supabase = await createAdminClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, status, total')
    .eq('phone', from)
    .eq('status', 'pending_confirmation')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !order) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>No pending order found for your number.</Message></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }

  await supabase.from('orders').update({ status: 'confirmed' }).eq('id', order.id)

  try {
    await sendOrderConfirmedSMS(from, order.id)
  } catch {}

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  )
}

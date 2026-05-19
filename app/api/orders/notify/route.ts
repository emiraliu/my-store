import { sendOrderConfirmationSMS } from '@/lib/twilio'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { orderId, phone, total } = await req.json()

  try {
    await sendOrderConfirmationSMS(phone, orderId, total)
    return Response.json({ success: true })
  } catch (err: any) {
    console.error('Failed to send SMS:', err?.message)
    return Response.json({ error: 'SMS failed' }, { status: 500 })
  }
}

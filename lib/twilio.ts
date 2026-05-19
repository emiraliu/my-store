import twilio from 'twilio'

export function getTwilioClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
}

export async function sendOrderConfirmationSMS(phone: string, orderId: string, total: number) {
  const client = getTwilioClient()
  const shortId = orderId.slice(0, 8).toUpperCase()
  await client.messages.create({
    body: `Your order #${shortId} has been placed! Total: $${total.toFixed(2)} - Cash on delivery. Reply YES to confirm your order.`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: phone,
  })
}

export async function sendOrderConfirmedSMS(phone: string, orderId: string) {
  const client = getTwilioClient()
  const shortId = orderId.slice(0, 8).toUpperCase()
  await client.messages.create({
    body: `Order #${shortId} confirmed! We'll start processing it right away. Thank you for shopping with us!`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: phone,
  })
}

export function validateTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const validator = twilio.validateRequest
  return validator(authToken, signature, url, params)
}

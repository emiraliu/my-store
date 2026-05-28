'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

const inputStyle: React.CSSProperties = {
  height: 48, borderRadius: 10,
  border: '0.5px solid rgba(0,0,0,0.18)',
  background: '#ffffff',
  padding: '0 14px',
  fontSize: 14, fontFamily: F.body,
  color: '#000000', outline: 'none',
  boxSizing: 'border-box', width: '100%',
}

const labelStyle: React.CSSProperties = {
  fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#6e6e6e', display: 'block', marginBottom: 8,
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const shipping = total === 0 ? 0 : total >= 100 ? 0 : 4.90
  const grandTotal = total + shipping

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single()
      if (profile) {
        if (profile.full_name) setFullName(profile.full_name)
        if (profile.phone) setPhone(profile.phone)
        if (profile.address) setAddress(profile.address)
      }
    }
    loadProfile()
  }, [])

  if (items.length === 0) {
    router.replace('/cart')
    return null
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items,
          total,
          status: 'pending_confirmation',
          phone,
          address,
        })
        .select()
        .single()

      if (orderError) {
        setError('Failed to place order. Please try again.')
        return
      }

      await supabase.from('profiles').update({ full_name: fullName, phone, address }).eq('id', user.id)

      await fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, phone, total }),
      })

      clearCart()
      router.push('/profile?ordered=1')
    })
  }

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh', paddingBottom: 120 }}>
      <style>{`
        .co-grid { display: flex; flex-direction: column; gap: 28px; padding: 0 20px; }
        @media (min-width: 768px) {
          .co-grid { flex-direction: row; align-items: flex-start; max-width: 960px; margin: 0 auto; padding: 0 60px; gap: 48px; }
          .co-form-col { flex: 1 1 0; }
          .co-summary-col { flex: 0 0 340px; position: sticky; top: calc(var(--desk-nav-h) + var(--desk-bar-h) + 24px); }
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: '0.5px solid var(--c-line)', marginBottom: 0 }}>
        <div style={{ padding: '40px 20px 24px', maxWidth: 960, margin: '0 auto' }} className="co-header">
          <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e6e6e', marginBottom: 6 }}>
            Checkout
          </div>
          <div style={{ fontFamily: F.display, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, color: '#000000' }}>
            Delivery details<em style={{ fontStyle: 'italic', color: '#000000' }}>.</em>
          </div>
        </div>
      </div>

      <div className="co-grid" style={{ paddingTop: 32 }}>
        {/* Form */}
        <div className="co-form-col">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+355 69 000 0000"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Delivery address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                placeholder="Street, city, postal code..."
                required
                style={{
                  ...inputStyle, height: 'auto', padding: '12px 14px',
                  resize: 'none', lineHeight: 1.5,
                } as React.CSSProperties}
              />
            </div>

            {/* COD note */}
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(0,0,0,0.05)',
              border: '0.5px solid rgba(0,0,0,0.10)',
              fontSize: 12.5, color: '#6e6e6e', lineHeight: 1.5,
            }}>
              <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#000000', marginBottom: 6 }}>
                Cash on delivery
              </div>
              After placing your order you'll receive an SMS. Reply <strong style={{ color: '#000000' }}>YES</strong> to confirm. You pay the courier in cash when the order arrives.
            </div>

            {error && (
              <div style={{
                background: 'rgba(155,77,77,0.08)', border: '0.5px solid #9b4d4d',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, color: '#9b4d4d',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              style={{
                width: '100%', height: 52, borderRadius: 999,
                background: '#000000', color: '#ffffff',
                border: 'none', fontSize: 14, fontWeight: 500,
                letterSpacing: '0.03em', cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
                fontFamily: F.body,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isPending ? (
                'Placing order…'
              ) : (
                <>
                  <Check size={16} strokeWidth={2} />
                  Place order · Pay €{grandTotal.toFixed(2)} on delivery
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="co-summary-col">
          <div style={{
            background: '#ffffff',
            border: '0.5px solid rgba(0,0,0,0.10)',
            borderRadius: 20, overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 18px 12px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e6e6e' }}>
                Order summary
              </div>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(item => (
                <div key={`${item.product_id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: '#6e6e6e', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}{item.size ? ` (${item.size})` : ''} ×{item.quantity}
                  </span>
                  <span style={{ fontFamily: F.mono, fontSize: 12, flexShrink: 0, color: '#000000' }}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: '#6e6e6e' }}>Subtotal</span>
                <span style={{ fontFamily: F.mono, fontSize: 12 }}>€{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: '#6e6e6e' }}>Delivery</span>
                <span style={{ fontFamily: F.mono, fontSize: 12 }}>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#000000' }}>Total</span>
                <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: '#000000' }}>€{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

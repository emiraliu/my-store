'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Truck, Banknote, Check, Minus, Plus } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { getToneColor } from '@/lib/tones'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const [toast, setToast] = useState<string | null>(null)
  const router = useRouter()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  const shipping = total === 0 ? 0 : total >= 100 ? 0 : 4.90
  const grandTotal = total + shipping
  const itemCount = items.reduce((n, i) => n + i.quantity, 0)

  function handlePlaceOrder() {
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: 60, background: 'var(--c-bg)', minHeight: '100dvh' }}>
        <div style={{ padding: '0 22px' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 4 }}>
            YOUR BAG
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 500 }}>Empty.</div>
        </div>
        <div style={{ padding: '40px 32px 0', textAlign: 'center', color: 'var(--c-ink-mute)' }}>
          <p style={{ fontSize: 13 }}>Pieces you add will appear here.</p>
          <Link href="/" style={{
            display: 'inline-block', marginTop: 14, padding: '10px 18px', borderRadius: 999,
            border: '0.5px solid var(--c-line)', color: 'var(--c-ink)',
            fontSize: 13, textDecoration: 'none', fontFamily: 'var(--f-body)',
          }}>Browse the catalog</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh', paddingBottom: 140 }}>
      {/* Header */}
      <div style={{ padding: '60px 22px 6px' }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 4 }}>
          YOUR BAG · {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 500 }}>Bag.</div>
      </div>

      {/* Line items */}
      <div style={{ padding: '6px 22px 0' }}>
        {items.map(item => (
          <div key={`${item.product_id}-${item.size}`} style={{
            display: 'grid', gridTemplateColumns: '84px 1fr auto',
            gap: 14, padding: '14px 0',
            borderBottom: '0.5px solid var(--c-line)',
            alignItems: 'flex-start',
          }}>
            {/* Image */}
            <div style={{
              width: 84, height: 108, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
              backgroundColor: getToneColor('clothing'),
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(44,37,32,0.025) 0 1px, transparent 1px 14px)',
              position: 'relative',
            }}>
              {item.image && (
                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="84px" />
              )}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.name}</div>
              {item.size && (
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--c-ink-mute)', letterSpacing: '0.04em' }}>
                  {item.color ? `${item.color} · ` : ''}{item.size}
                </div>
              )}
              {/* Stepper */}
              <div style={{ marginTop: 8 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  border: '0.5px solid var(--c-line)',
                  borderRadius: 999, background: 'var(--c-card)', overflow: 'hidden',
                }}>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)}
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--c-ink-mute)' }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, minWidth: 18, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--c-ink-mute)' }}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Price */}
            <div style={{ textAlign: 'right', fontFamily: 'var(--f-mono)', fontSize: 13, paddingTop: 2 }}>
              €{(item.price * item.quantity).toFixed(0)}
            </div>
          </div>
        ))}
      </div>

      {/* COD callout */}
      <div style={{ margin: '20px 22px 0' }}>
        <div style={{
          padding: 18, borderRadius: 18,
          background: 'var(--c-cod)', color: 'var(--c-card)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: 'rgba(251,247,239,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Banknote size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 2 }}>PAYMENT</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Cash on delivery</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{
                fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '4px 8px', borderRadius: 999,
                background: 'rgba(251,247,239,0.14)',
              }}>ONLY METHOD</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ fontSize: 12.5, lineHeight: 1.45, opacity: 0.86 }}>
            Pay the courier{' '}
            <span style={{ borderBottom: '0.5px solid currentColor', paddingBottom: 1 }}>€{grandTotal.toFixed(2)}</span>
            {' '}in cash when your order arrives. Inspect every piece before paying — return on the spot if anything is wrong.
          </div>

          {/* Reassurances */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
            paddingTop: 12, borderTop: '0.5px solid rgba(251,247,239,0.18)',
          }}>
            {['Try on at door', 'No card needed', 'Free returns'].map(t => (
              <div key={t} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                fontSize: 10, textAlign: 'center', opacity: 0.86,
                fontFamily: 'var(--f-mono)', letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                <Check size={14} strokeWidth={1.6} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div style={{ padding: '22px 22px 0' }}>
        <TotalRow label="Subtotal" value={`€${total.toFixed(2)}`} />
        <TotalRow label="Delivery" value={shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`} />
        <div style={{ height: 1, background: 'var(--c-line)', margin: '12px 0' }} />
        <TotalRow label="Total · payable on delivery" value={`€${grandTotal.toFixed(2)}`} bold />
        <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', marginTop: 8, fontStyle: 'italic', fontFamily: 'var(--f-display)' }}>
          Estimated arrival 2 — 4 working days.
        </div>
      </div>

      {/* Floating CTA */}
      <div style={{
        position: 'fixed',
        left: 16, right: 16, bottom: 100,
        background: 'rgba(251,247,239,0.92)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        border: '0.5px solid var(--c-line)',
        borderRadius: 28,
        padding: 10,
        boxShadow: '0 10px 30px rgba(44,37,32,0.10)',
        zIndex: 20,
      }}>
        <button onClick={handlePlaceOrder} style={{
          width: '100%', height: 56, borderRadius: 999,
          background: 'var(--c-ink)', color: 'var(--c-card)',
          fontSize: 14, fontWeight: 500, letterSpacing: '0.03em',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'var(--f-body)',
        }}>
          Place order · Pay €{grandTotal.toFixed(0)} on delivery
        </button>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 96, left: '50%',
        transform: `translateX(-50%) translateY(${toast ? 0 : 20}px)`,
        background: 'var(--c-ink)', color: 'var(--c-card)',
        fontSize: 13, padding: '10px 16px', borderRadius: 999,
        zIndex: 50, opacity: toast ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all 0.25s cubic-bezier(.2,.8,.3,1)',
        whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--f-body)',
      }}>
        <Check size={14} strokeWidth={2} />
        <span>{toast}</span>
      </div>
    </div>
  )
}

function TotalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '5px 0', fontSize: bold ? 15 : 13, fontWeight: bold ? 500 : 400,
    }}>
      <span style={{ color: bold ? 'var(--c-ink)' : 'var(--c-ink-mute)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--f-mono)' }}>{value}</span>
    </div>
  )
}

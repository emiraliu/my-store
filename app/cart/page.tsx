'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Truck, Banknote, Check, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
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

  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--c-bg)', minHeight: '100dvh' }}>
        <div className="page-wrap" style={{ padding: '80px 60px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--c-tag-bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <ShoppingBag size={28} strokeWidth={1.3} color="var(--c-ink-mute)" />
          </div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 10 }}>Your bag</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 42, fontWeight: 500, marginBottom: 12 }}>Empty.</div>
          <p style={{ fontSize: 14, color: 'var(--c-ink-mute)', marginBottom: 28 }}>Pieces you add will appear here.</p>
          <Link href="/" className="btn-primary">Browse the collection <ArrowRight size={16} /></Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh' }}>
      {/* Page header */}
      <div style={{ borderBottom: '0.5px solid var(--c-line)' }}>
        <div className="page-wrap" style={{ padding: '40px 60px 24px' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>
            YOUR BAG · {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500 }}>Your Bag.</div>
        </div>
      </div>

      {/* Two-column layout on desktop */}
      <div className="page-wrap" style={{ padding: '0 60px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="cart-grid">
          {/* Items column */}
          <div>
            {/* Column header — desktop only */}
            <div className="desktop-only" style={{
              display: 'grid', gridTemplateColumns: '80px 1fr 120px 80px',
              gap: 16, padding: '16px 0', borderBottom: '0.5px solid var(--c-line)',
              fontFamily: 'var(--f-mono)', fontSize: 9.5, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--c-ink-mute)',
            }}>
              <span>Item</span><span></span><span style={{ textAlign: 'center' }}>Quantity</span><span style={{ textAlign: 'right' }}>Total</span>
            </div>

            {items.map(item => (
              <div key={`${item.product_id}-${item.size}`} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: 16, padding: '20px 0',
                borderBottom: '0.5px solid var(--c-line)',
                alignItems: 'flex-start',
              }} className="cart-item-row">
                {/* Image */}
                <Link href={`/products/${item.product_id}`}>
                  <div style={{
                    width: 80, height: 104, borderRadius: 10, overflow: 'hidden',
                    backgroundColor: getToneColor('clothing'),
                    backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 14px)',
                    position: 'relative', flexShrink: 0,
                  }}>
                    {item.image && <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="80px" />}
                  </div>
                </Link>

                {/* Info + stepper */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <Link href={`/products/${item.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                  </Link>
                  {item.size && (
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--c-ink-mute)', letterSpacing: '0.04em' }}>
                      {item.color ? `${item.color} · ` : ''}Size {item.size}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, marginTop: 2 }}>€{item.price}</div>
                  {/* Stepper */}
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center',
                      border: '0.5px solid var(--c-line)', borderRadius: 999,
                      background: 'var(--c-card)', overflow: 'hidden',
                    }}>
                      <button onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)}
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--c-ink-mute)' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--c-ink-mute)' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => { removeItem(item.product_id, item.size); showToast('Removed') }}
                      style={{ fontFamily: 'var(--f-body)', fontSize: 12, color: 'var(--c-ink-mute)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}
                    >Remove</button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 500, paddingTop: 4 }}>
                  €{(item.price * item.quantity).toFixed(0)}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--c-ink-mute)',
                textDecoration: 'underline', textUnderlineOffset: 4,
              }}>
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* Summary column */}
          <div className="cart-summary">
            <div style={{
              border: '0.5px solid var(--c-line)', borderRadius: 20,
              padding: 28, display: 'flex', flexDirection: 'column', gap: 0,
              position: 'sticky', top: 'calc(var(--desk-nav-h) + var(--desk-bar-h) + 24px)',
            }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 20 }}>Order summary</div>

              {/* Totals */}
              <TotalRow label="Subtotal" value={`€${total.toFixed(2)}`} />
              <TotalRow label="Delivery" value={shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`} />
              {total < 100 && total > 0 && (
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--c-ink-mute)', marginTop: 4, marginBottom: 4 }}>
                  Add €{(100 - total).toFixed(0)} more for free delivery
                </div>
              )}
              <div style={{ height: '0.5px', background: 'var(--c-line)', margin: '14px 0' }} />
              <TotalRow label="Total · payable on delivery" value={`€${grandTotal.toFixed(2)}`} bold />

              {/* COD callout */}
              <div style={{
                marginTop: 24, padding: 18, borderRadius: 16,
                background: 'var(--c-cod)', color: '#fff',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Banknote size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 8.5, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 2 }}>Payment method</div>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>Cash on delivery only</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.75 }}>
                  Pay the courier <strong>€{grandTotal.toFixed(2)}</strong> in cash on arrival. Inspect every piece before paying — free returns on the spot.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, paddingTop: 10, borderTop: '0.5px solid rgba(255,255,255,0.15)' }}>
                  {['Try on at door', 'No card needed', 'Free returns'].map(t => (
                    <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, fontSize: 9.5, textAlign: 'center', opacity: 0.8, fontFamily: 'var(--f-mono)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      <Check size={12} strokeWidth={1.8} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '12px 0', borderTop: '0.5px solid var(--c-line)' }}>
                <Truck size={16} strokeWidth={1.5} color="var(--c-ink-mute)" />
                <span style={{ fontSize: 12, color: 'var(--c-ink-mute)' }}>Estimated arrival 2 — 4 working days</span>
              </div>

              {/* CTA */}
              <button onClick={() => router.push('/checkout')} style={{
                width: '100%', height: 56, borderRadius: 999, marginTop: 8,
                background: 'var(--c-ink)', color: '#fff',
                fontFamily: 'var(--f-body)', fontSize: 15, fontWeight: 500,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Place order · Pay €{grandTotal.toFixed(0)} on delivery
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 40, left: '50%',
        transform: `translateX(-50%) translateY(${toast ? 0 : 20}px)`,
        background: 'var(--c-ink)', color: '#fff',
        fontSize: 13, padding: '10px 18px', borderRadius: 999,
        zIndex: 50, opacity: toast ? 1 : 0, pointerEvents: 'none',
        transition: 'all 0.25s cubic-bezier(.2,.8,.3,1)', whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--f-body)',
      }}>
        <Check size={14} strokeWidth={2} />
        <span>{toast}</span>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .cart-grid { grid-template-columns: 1fr 380px !important; }
          .cart-item-row { grid-template-columns: 80px 1fr 140px 100px !important; }
        }
      `}</style>
    </div>
  )
}

function TotalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '6px 0', fontSize: bold ? 14.5 : 13, fontWeight: bold ? 600 : 400,
    }}>
      <span style={{ color: bold ? 'var(--c-ink)' : 'var(--c-ink-mute)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--f-mono)' }}>{value}</span>
    </div>
  )
}

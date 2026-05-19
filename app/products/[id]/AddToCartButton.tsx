'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Heart, ShoppingBag, Truck, Banknote, Check } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useWishlist } from '@/components/WishlistProvider'
import type { Product } from '@/lib/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [heartPop, setHeartPop] = useState(false)
  const { addItem } = useCart()
  const { isWished, toggleWish } = useWishlist()
  const router = useRouter()
  const wished = isWished(product.id)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  function handleAdd() {
    if (product.sizes.length > 0 && !selectedSize) {
      showToast('Please choose a size')
      return
    }
    addItem({
      product_id: product.id,
      name: product.name,
      image: product.images[0] ?? '',
      size: selectedSize ?? '',
      quantity: 1,
      price: product.price,
    })
    showToast(`Added · ${product.name}`)
  }

  function handleHeart() {
    toggleWish(product.id)
    setHeartPop(true)
    setTimeout(() => setHeartPop(false), 300)
  }

  const deliveryEstimate = '2 — 4 working days'

  return (
    <>
      {/* Back button */}
      <button onClick={() => router.back()} style={{
        position: 'fixed', top: 16, left: 14, zIndex: 10,
        width: 38, height: 38, borderRadius: 999,
        background: 'rgba(251,247,239,0.86)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--c-ink)', border: '0.5px solid var(--c-line)',
        cursor: 'pointer',
      }}>
        <ChevronLeft size={18} />
      </button>

      {/* Wishlist button */}
      <button
        onClick={handleHeart}
        className={heartPop ? 'sade-pop' : ''}
        style={{
          position: 'fixed', top: 16, right: 14, zIndex: 10,
          width: 38, height: 38, borderRadius: 999,
          background: 'rgba(251,247,239,0.86)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: wished ? 'var(--c-accent)' : 'var(--c-ink)',
          border: '0.5px solid var(--c-line)',
          cursor: 'pointer',
        }}>
        <Heart size={17} strokeWidth={1.7} fill={wished ? 'currentColor' : 'none'} />
      </button>

      {/* Body */}
      <div style={{ padding: '22px 22px 160px' }}>
        {/* Eyebrow */}
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 4 }}>
          {product.category}
        </div>

        {/* Title */}
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, fontWeight: 500, lineHeight: 1.05, marginBottom: 6 }}>
          {product.name}
        </div>

        {/* Price line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 15 }}>€{product.price}</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--c-ink-mute)' }} />
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)', letterSpacing: '0.04em' }}>INCL. VAT</span>
        </div>

        {/* COD badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: 'var(--c-cod)', color: 'var(--c-card)',
          fontFamily: 'var(--f-mono)', fontSize: 9,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: 24,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />
          Pay cash on delivery
        </div>

        {/* Size selector */}
        {product.sizes.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              fontSize: 12, color: 'var(--c-ink-mute)', marginBottom: 10,
            }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--f-mono)' }}>Size</span>
              <button style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--c-ink-mute)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--f-body)' }}>
                Size guide
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{
                  height: 44, minWidth: 44, padding: '0 14px',
                  borderRadius: 12,
                  border: '0.5px solid var(--c-line)',
                  background: selectedSize === s ? 'var(--c-ink)' : 'var(--c-card)',
                  color: selectedSize === s ? 'var(--c-card)' : 'var(--c-ink)',
                  fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.06em',
                  cursor: 'pointer',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div style={{
            padding: '18px 0', borderTop: '0.5px solid var(--c-line)',
            fontSize: 13, color: 'var(--c-ink-mute)', lineHeight: 1.55,
            marginBottom: 8,
          }}>
            {product.description}
          </div>
        )}

        {/* Delivery card */}
        <div style={{
          marginTop: 8, padding: 16,
          background: 'var(--c-card)', borderRadius: 'var(--r-card)',
          border: '0.5px solid var(--c-line)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 999,
              background: 'var(--c-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--c-cod)', flexShrink: 0,
            }}>
              <Truck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Delivery in {deliveryEstimate}</div>
              <div style={{ fontSize: 11, color: 'var(--c-ink-mute)' }}>Free over €100 · €4.90 below</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 999,
              background: 'var(--c-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--c-cod)', flexShrink: 0,
            }}>
              <Banknote size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Pay with cash on arrival</div>
              <div style={{ fontSize: 11, color: 'var(--c-ink-mute)' }}>Inspect first · no card needed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating add bar */}
      <div style={{
        position: 'fixed',
        left: 16, right: 16, bottom: 30,
        background: 'rgba(251,247,239,0.92)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        border: '0.5px solid var(--c-line)',
        borderRadius: 28,
        padding: '10px 10px 10px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 10px 30px rgba(44,37,32,0.10)',
        zIndex: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--c-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {selectedSize ? `Size ${selectedSize}` : 'Select size'}
          </div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}>€{product.price}</div>
        </div>
        <button
          onClick={handleAdd}
          style={{
            height: 44, padding: '0 22px', borderRadius: 999,
            background: 'var(--c-ink)', color: 'var(--c-card)',
            fontSize: 14, fontWeight: 500, letterSpacing: '0.03em',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--f-body)',
          }}
        >
          <ShoppingBag size={16} strokeWidth={1.6} />
          Add to bag
        </button>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed',
        bottom: 96, left: '50%',
        transform: `translateX(-50%) translateY(${toast ? 0 : 20}px)`,
        background: 'var(--c-ink)', color: 'var(--c-card)',
        fontSize: 13, padding: '10px 16px', borderRadius: 999,
        zIndex: 50, opacity: toast ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all 0.25s cubic-bezier(.2,.8,.3,1)',
        whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: 8,
        letterSpacing: '0.01em',
        fontFamily: 'var(--f-body)',
      }}>
        <Check size={14} strokeWidth={2} />
        <span>{toast}</span>
      </div>
    </>
  )
}

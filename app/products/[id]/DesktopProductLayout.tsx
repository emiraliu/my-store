'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Truck, Banknote, Check, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useWishlist } from '@/components/WishlistProvider'
import type { Product } from '@/lib/types'

const VIDEO_EXTS = ['mp4', 'mov', 'webm', 'ogg', 'avi']
function isVideo(url: string) {
  return VIDEO_EXTS.includes(url.split('.').pop()?.split('?')[0]?.toLowerCase() ?? '')
}

export default function DesktopProductLayout({ product, toneColor, firstWord }: {
  product: Product
  toneColor: string
  firstWord: string
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [heartPop, setHeartPop] = useState(false)
  const [zoom, setZoom] = useState(false)
  const { addItem } = useCart()
  const { isWished, toggleWish } = useWishlist()
  const wished = isWished(product.id)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  function handleAdd() {
    if (Object.keys(product.sizes).length > 0 && !selectedSize) {
      showToast('Please choose a size first')
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
    showToast(`Added to bag — ${product.name}`)
  }

  function handleHeart() {
    toggleWish(product.id)
    setHeartPop(true)
    setTimeout(() => setHeartPop(false), 300)
  }

  const images = product.images.length > 0 ? product.images : []
  const mainImg = images[activeIdx]

  return (
    <div style={{ minHeight: '100dvh' }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '0.5px solid var(--c-line)', padding: '14px 0' }}>
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.05em', color: 'var(--c-ink-mute)' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-ink-mute)')}
          >Shop</Link>
          <span>/</span>
          <Link href={`/?cat=${product.category.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s', textTransform: 'capitalize' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-ink-mute)')}
          >{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--c-ink)' }}>{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="page-wrap" style={{
        display: 'grid', gridTemplateColumns: '1fr 480px',
        gap: 64, padding: '48px 60px 80px', alignItems: 'start',
      }}>
        {/* LEFT — gallery */}
        <div style={{ position: 'sticky', top: 'calc(var(--desk-nav-h) + var(--desk-bar-h) + 24px)' }}>
          {/* Main image */}
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '3/4',
            borderRadius: 20, overflow: 'hidden',
            background: toneColor,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 14px)',
            cursor: 'zoom-in',
          }}
          onClick={() => setZoom(true)}
          >
            {mainImg ? (
              isVideo(mainImg) ? (
                <video src={mainImg} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Image src={mainImg} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="55vw" priority />
              )
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 20 }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.7)', padding: '3px 8px', borderRadius: 4 }}>PHOTO · {firstWord}</span>
              </div>
            )}
            {/* Zoom hint */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
              borderRadius: 999, padding: '6px 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--f-mono)', fontSize: 9.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink)',
            }}>
              <ZoomIn size={12} /> Zoom
            </div>
            {/* Prev/next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setActiveIdx(i => Math.max(0, i - 1)) }}
                  style={{
                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                    width: 40, height: 40, borderRadius: 999,
                    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--c-ink)', opacity: activeIdx === 0 ? 0.3 : 1,
                  }}
                  disabled={activeIdx === 0}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setActiveIdx(i => Math.min(images.length - 1, i + 1)) }}
                  style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    width: 40, height: 40, borderRadius: 999,
                    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--c-ink)', opacity: activeIdx === images.length - 1 ? 0.3 : 1,
                  }}
                  disabled={activeIdx === images.length - 1}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto' }} className="no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    width: 76, height: 96, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
                    border: `2px solid ${i === activeIdx ? 'var(--c-ink)' : 'transparent'}`,
                    background: toneColor, cursor: 'pointer', padding: 0, position: 'relative',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {isVideo(img) ? (
                    <video src={img} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="76px" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — product info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Category + name */}
          <div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 10 }}>
              {product.category}
            </div>
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 44, fontWeight: 500, lineHeight: 1.02, letterSpacing: '-0.01em', marginBottom: 14 }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 22, fontWeight: 500 }}>€{product.price}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--c-ink-mute)', textTransform: 'uppercase' }}>Incl. VAT</span>
            </div>
          </div>

          {/* COD badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999,
            background: 'var(--c-cod)', color: '#fff',
            fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
            alignSelf: 'flex-start',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />
            Pay cash on delivery
          </div>

          {/* Size selector */}
          {Object.keys(product.sizes).length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--c-ink-mute)' }}>Size</span>
                <button style={{ fontFamily: 'var(--f-body)', fontSize: 12, color: 'var(--c-ink-mute)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Size guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(product.sizes).map(([s, qty]) => {
                  const outOfStock = qty === 0
                  const active = selectedSize === s
                  return (
                    <button
                      key={s}
                      onClick={() => !outOfStock && setSelectedSize(s)}
                      disabled={outOfStock}
                      style={{
                        height: 48, minWidth: 52, padding: '0 16px',
                        borderRadius: 12,
                        border: outOfStock ? '0.5px solid rgba(0,0,0,0.12)' : `1.5px solid ${active ? 'var(--c-ink)' : 'var(--c-line)'}`,
                        background: active ? 'var(--c-ink)' : '#fff',
                        color: outOfStock ? 'rgba(0,0,0,0.25)' : active ? '#fff' : 'var(--c-ink)',
                        fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.06em',
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                        position: 'relative', overflow: 'hidden',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s}
                      {outOfStock && (
                        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                            <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add + Wishlist */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleAdd} style={{
              flex: 1, height: 56, borderRadius: 999,
              background: 'var(--c-ink)', color: '#fff',
              fontFamily: 'var(--f-body)', fontSize: 15, fontWeight: 500,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              Add to bag
            </button>
            <button
              onClick={handleHeart}
              className={heartPop ? 'sade-pop' : ''}
              style={{
                width: 56, height: 56, borderRadius: 999, flexShrink: 0,
                border: '1.5px solid var(--c-line)',
                background: wished ? '#fff0f0' : '#fff',
                color: wished ? '#e5222a' : 'var(--c-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={20} strokeWidth={1.7} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ borderTop: '0.5px solid var(--c-line)', paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 12 }}>About this piece</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--c-ink)', fontFamily: 'var(--f-body)' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Delivery info */}
          <div style={{ borderTop: '0.5px solid var(--c-line)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 4 }}>Delivery & Payment</div>
            {[
              { Icon: Truck, title: 'Delivery in 2 — 4 working days', sub: 'Free over €100 · €4.90 below' },
              { Icon: Banknote, title: 'Pay cash on arrival', sub: 'Inspect first · no card needed · return on the spot' },
            ].map(({ Icon, title, sub }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--c-tag-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--c-ink-mute)' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 40, left: '50%',
        transform: `translateX(-50%) translateY(${toast ? 0 : 20}px)`,
        background: 'var(--c-ink)', color: '#fff',
        fontSize: 13, padding: '12px 20px', borderRadius: 999,
        zIndex: 50, opacity: toast ? 1 : 0, pointerEvents: 'none',
        transition: 'all 0.25s cubic-bezier(.2,.8,.3,1)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--f-body)',
      }}>
        <Check size={14} strokeWidth={2} />
        <span>{toast}</span>
      </div>

      {/* Zoom modal */}
      {zoom && mainImg && (
        <div
          onClick={() => setZoom(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <div style={{ position: 'relative', width: '80vmin', height: '90vmin', maxWidth: 800 }}>
            <Image src={mainImg} alt={product.name} fill style={{ objectFit: 'contain' }} sizes="80vmin" />
          </div>
        </div>
      )}
    </div>
  )
}

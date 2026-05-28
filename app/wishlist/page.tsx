'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { useWishlist } from '@/components/WishlistProvider'
import { createClient } from '@/lib/supabase/client'
import { getToneColor } from '@/lib/tones'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const { wishlist, toggleWish } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (wishlist.length === 0) { setProducts([]); setLoading(false); return }
    const supabase = createClient()
    supabase.from('products').select('*').in('id', wishlist).then(({ data }) => {
      setProducts((data ?? []) as Product[])
      setLoading(false)
    })
  }, [wishlist])

  if (loading) {
    return (
      <div style={{ background: 'var(--c-bg)', minHeight: '100dvh' }}>
        <div className="page-wrap" style={{ padding: '60px 20px 0' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>Saved</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500 }}>Wishlist.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ borderBottom: '0.5px solid var(--c-line)' }}>
        <div className="page-wrap" style={{ padding: '40px 20px 24px' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>
            Saved · {wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'}
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500 }}>
            Wishlist.
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="page-wrap" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--c-tag-bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-ink-mute)', marginBottom: 20 }}>
            <Heart size={26} strokeWidth={1.3} />
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 38, fontWeight: 500, color: 'var(--c-ink)', marginBottom: 10 }}>Nothing saved.</div>
          <p style={{ fontSize: 14, color: 'var(--c-ink-mute)', marginBottom: 28 }}>Tap the heart on any piece to keep it here.</p>
          <Link href="/" className="btn-primary">Browse the collection <ArrowRight size={16} /></Link>
        </div>
      ) : (
        <>
          {/* Desktop grid */}
          <div className="desktop-only">
            <div className="page-wrap" style={{ padding: '48px 60px 80px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {products.map((p, i) => (
                  <div key={p.id} className="sade-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <div style={{
                      position: 'relative', aspectRatio: '3/4', borderRadius: 14,
                      overflow: 'hidden', cursor: 'pointer',
                      backgroundColor: getToneColor(p.category, p.id),
                      backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 14px)',
                    }}
                    onClick={() => router.push(`/products/${p.id}`)}
                    >
                      {p.images[0] && <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} sizes="25vw" />}
                      <button onClick={e => { e.stopPropagation(); toggleWish(p.id) }} style={{
                        position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 999,
                        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e5222a',
                      }} aria-label="Remove from wishlist">
                        <Heart size={16} fill="currentColor" strokeWidth={1.7} />
                      </button>
                    </div>
                    <div style={{ padding: '12px 2px 0' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }} onClick={() => router.push(`/products/${p.id}`)}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--c-ink-mute)', marginTop: 4 }}>€{p.price}</div>
                    </div>
                    <button onClick={() => router.push(`/products/${p.id}`)} style={{
                      marginTop: 10, width: '100%', height: 40, borderRadius: 999,
                      border: '0.5px solid var(--c-line)', background: 'transparent',
                      fontFamily: 'var(--f-body)', fontSize: 12.5, cursor: 'pointer', color: 'var(--c-ink)',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget.style.background = 'var(--c-ink)'); (e.currentTarget.style.color = '#fff') }}
                    onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = 'var(--c-ink)') }}
                    >View product</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile list */}
          <div className="mobile-only" style={{ paddingBottom: 120 }}>
            {products.map(p => (
              <div key={p.id} onClick={() => router.push(`/products/${p.id}`)} style={{
                display: 'grid', gridTemplateColumns: '88px 1fr auto',
                gap: 14, padding: '14px 20px',
                borderBottom: '0.5px solid var(--c-line)',
                alignItems: 'center', cursor: 'pointer',
              }}>
                <div style={{
                  width: 88, height: 110, borderRadius: 10, overflow: 'hidden',
                  backgroundColor: getToneColor(p.category, p.id),
                  backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 14px)',
                  position: 'relative', flexShrink: 0,
                }}>
                  {p.images[0] && <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="88px" />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)' }}>€{p.price}</div>
                  {p.description && (
                    <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', fontStyle: 'italic', fontFamily: 'var(--f-display)' }}>
                      {p.description.slice(0, 40)}{p.description.length > 40 ? '…' : ''}
                    </div>
                  )}
                </div>
                <button onClick={e => { e.stopPropagation(); toggleWish(p.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e5222a', padding: 4 }} aria-label="Remove from wishlist">
                  <Heart size={20} fill="currentColor" strokeWidth={1.7} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

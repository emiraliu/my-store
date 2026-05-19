'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heart } from 'lucide-react'
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
      <div style={{ background: 'var(--c-bg)', minHeight: '100dvh', paddingTop: 60 }}>
        <div style={{ padding: '0 22px' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 4 }}>
            SAVED
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 500 }}>Wishlist.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ padding: '60px 22px 10px' }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 4 }}>
          SAVED · {wishlist.length} {wishlist.length === 1 ? 'PIECE' : 'PIECES'}
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 500 }}>Wishlist.</div>
      </div>

      {/* Empty state */}
      {wishlist.length === 0 ? (
        <div style={{ padding: '40px 32px 0', textAlign: 'center', color: 'var(--c-ink-mute)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999,
            background: 'var(--c-card)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--c-ink-mute)', marginBottom: 12,
          }}>
            <Heart size={24} strokeWidth={1.4} />
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, fontWeight: 500, color: 'var(--c-ink)', margin: '0 0 8px' }}>
            Nothing saved.
          </div>
          <p style={{ fontSize: 13 }}>Tap the heart on any piece to keep it here.</p>
        </div>
      ) : (
        <div style={{ paddingBottom: 120 }}>
          {products.map(p => (
            <div key={p.id}
              onClick={() => router.push(`/products/${p.id}`)}
              style={{
                display: 'grid', gridTemplateColumns: '88px 1fr auto',
                gap: 14, padding: '14px 18px',
                borderBottom: '0.5px solid var(--c-line)',
                alignItems: 'center', cursor: 'pointer',
              }}
            >
              {/* Image */}
              <div style={{
                width: 88, height: 110, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                backgroundColor: getToneColor(p.category, p.id),
                backgroundImage: 'repeating-linear-gradient(135deg, rgba(44,37,32,0.025) 0 1px, transparent 1px 14px)',
                position: 'relative',
              }}>
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="88px" />
                )}
              </div>

              {/* Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)' }}>€{p.price}</div>
                {p.description && (
                  <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', fontStyle: 'italic', fontFamily: 'var(--f-display)' }}>
                    {p.description.slice(0, 40)}{p.description.length > 40 ? '…' : ''}
                  </div>
                )}
              </div>

              {/* Remove heart */}
              <button
                onClick={e => { e.stopPropagation(); toggleWish(p.id) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--c-accent)', padding: 4,
                }}
                aria-label="Remove from wishlist"
              >
                <Heart size={20} fill="currentColor" strokeWidth={1.7} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

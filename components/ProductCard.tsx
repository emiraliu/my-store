'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import { getTone, getToneColor } from '@/lib/tones'
import { useWishlist } from './WishlistProvider'

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
}

function isLowStock(stock: number) {
  return stock > 0 && stock <= 3
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { isWished, toggleWish } = useWishlist()
  const [popping, setPopping] = useState(false)
  const wished = isWished(product.id)
  const tone = getTone(product.category, product.id)
  const toneColor = getToneColor(product.category, product.id)
  const delay = Math.min(index * 30, 240)
  const firstWord = product.name.split(' ')[0]
  const newBadge = isNew(product.created_at)
  const lowBadge = isLowStock(product.stock)

  function handleHeart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWish(product.id)
    setPopping(true)
    setTimeout(() => setPopping(false), 300)
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="sade-fade-up"
      style={{
        display: 'flex', flexDirection: 'column',
        textDecoration: 'none', color: 'inherit',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '3/4',
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
        backgroundColor: toneColor,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(44,37,32,0.025) 0 1px, transparent 1px 14px)',
      }}>
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <span style={{
            position: 'absolute', left: 8, bottom: 8,
            fontFamily: 'var(--f-mono)', fontSize: 9,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'rgba(44,37,32,0.65)',
            background: 'rgba(251,247,239,0.7)',
            padding: '2px 5px', borderRadius: 3,
          }}>
            PHOTO · {firstWord}
          </span>
        )}

        {/* New badge */}
        {newBadge && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '3px 7px', borderRadius: 999,
            background: 'rgba(251,247,239,0.85)',
            color: 'var(--c-ink)',
          }}>New</span>
        )}
        {/* Low stock badge */}
        {!newBadge && lowBadge && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '3px 7px', borderRadius: 999,
            background: 'var(--c-accent)',
            color: 'var(--c-accent-ink)',
          }}>Low stock</span>
        )}

        {/* Heart */}
        <button
          onClick={handleHeart}
          className={popping ? 'sade-pop' : ''}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(251,247,239,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            color: wished ? 'var(--c-accent)' : 'var(--c-ink)',
            zIndex: 2,
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            strokeWidth={1.7}
            fill={wished ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Meta */}
      <div style={{ padding: '10px 2px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.005em', color: 'var(--c-ink)' }}>
          {product.name}
        </span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)', letterSpacing: '0.04em' }}>
          €{product.price}
        </span>
      </div>
    </Link>
  )
}

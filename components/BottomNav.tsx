'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { Home, Heart, ShoppingBag, User } from 'lucide-react'
import { useCart } from './CartProvider'
import { useWishlist } from './WishlistProvider'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()
  const { wishlist } = useWishlist()
  const tapCount = useRef(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (pathname.startsWith('/products/') || pathname.startsWith('/admin')) return null

  function handleYouTap(e: React.MouseEvent) {
    e.preventDefault()
    tapCount.current += 1

    if (tapTimer.current) clearTimeout(tapTimer.current)

    if (tapCount.current >= 5) {
      tapCount.current = 0
      router.push('/admin/login')
      return
    }

    tapTimer.current = setTimeout(() => {
      tapCount.current = 0
      router.push('/profile')
    }, 600)
  }

  const tabs = [
    { href: '/',         icon: Home,        label: 'Shop' },
    { href: '/wishlist', icon: Heart,       label: 'Saved' },
    { href: '/cart',     icon: ShoppingBag, label: 'Bag' },
  ]

  const youActive = pathname === '/profile'

  return (
    <nav style={{
      position: 'fixed',
      left: 12, right: 12, bottom: 22,
      height: 60,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      alignItems: 'center',
      background: 'rgba(251, 247, 239, 0.86)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '0.5px solid var(--c-line)',
      borderRadius: 22,
      boxShadow: '0 8px 30px rgba(44, 37, 32, 0.08)',
      zIndex: 30,
    }}>
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        const badge = label === 'Saved' ? wishlist.length : label === 'Bag' ? count : 0
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: active ? 'var(--c-ink)' : 'var(--c-ink-mute)',
            fontSize: 10,
            fontFamily: 'var(--f-body)',
            letterSpacing: '0.03em',
            padding: '6px 4px',
            height: '100%',
            justifyContent: 'center',
            textDecoration: 'none',
          }}>
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={1.5} />
              {badge > 0 && (
                <span style={{
                  position: 'absolute', top: -3, right: -8,
                  minWidth: 14, height: 14, padding: '0 4px',
                  borderRadius: 999,
                  background: label === 'Saved' ? 'var(--c-accent)' : 'var(--c-ink)',
                  color: label === 'Saved' ? 'var(--c-accent-ink)' : 'var(--c-bg)',
                  fontFamily: 'var(--f-mono)',
                  fontSize: 8.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{badge}</span>
              )}
            </div>
            <span>{label}</span>
            <span style={{
              width: 4, height: 4, borderRadius: 50,
              background: 'var(--c-accent)',
              marginTop: 2,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.18s',
            }} />
          </Link>
        )
      })}

      {/* You tab — 5 taps opens admin */}
      <button onClick={handleYouTap} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        color: youActive ? 'var(--c-ink)' : 'var(--c-ink-mute)',
        fontSize: 10,
        fontFamily: 'var(--f-body)',
        letterSpacing: '0.03em',
        padding: '6px 4px',
        height: '100%',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
      }}>
        <User size={20} strokeWidth={1.5} />
        <span>You</span>
        <span style={{
          width: 4, height: 4, borderRadius: 50,
          background: 'var(--c-accent)',
          marginTop: 2,
          opacity: youActive ? 1 : 0,
          transition: 'opacity 0.18s',
        }} />
      </button>
    </nav>
  )
}

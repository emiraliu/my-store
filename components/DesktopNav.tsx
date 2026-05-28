'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Heart, ShoppingBag, User, Search, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from './CartProvider'
import { useWishlist } from './WishlistProvider'

const SHOP_LINKS = [
  { label: 'All Pieces',  href: '/?cat=all' },
  { label: 'New In',      href: '/?cat=new' },
  { label: 'Dresses',     href: '/?cat=dresses' },
  { label: 'Tops',        href: '/?cat=tops' },
  { label: 'Scarves',     href: '/?cat=scarves' },
  { label: 'Outerwear',   href: '/?cat=outer' },
  { label: 'Sets',        href: '/?cat=sets' },
]

export default function DesktopNav() {
  const pathname = usePathname()
  const { count } = useCart()
  const { wishlist } = useWishlist()
  const [searchOpen, setSearchOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const shopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (pathname.startsWith('/admin')) return null

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  function openShop() {
    if (shopTimer.current) clearTimeout(shopTimer.current)
    setShopOpen(true)
  }
  function closeShop() {
    shopTimer.current = setTimeout(() => setShopOpen(false), 120)
  }

  return (
    <div className="desktop-only">
      {/* Announcement bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--desk-bar-h)',
        background: 'var(--c-ink)', color: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--f-mono)', fontSize: 10.5,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        zIndex: 50,
        gap: 20,
      }}>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
        Free delivery on orders over €100
        <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
        Pay cash on delivery · No card needed
        <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
      </div>

      {/* Main nav bar */}
      <nav style={{
        position: 'fixed', top: 'var(--desk-bar-h)', left: 0, right: 0,
        height: 'var(--desk-nav-h)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '0.5px solid var(--c-line)',
        zIndex: 49,
        display: 'flex', alignItems: 'center',
      }}>
        <div className="page-wrap" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', gap: 32,
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <Image
              src="/hidaya-logo.jpg"
              alt="Hidaya Wear"
              width={48}
              height={48}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Center nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {/* Shop dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={openShop}
              onMouseLeave={closeShop}
            >
              <Link href="/" style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 14px', borderRadius: 8,
                fontFamily: 'var(--f-body)', fontSize: 13, letterSpacing: '0.02em',
                color: 'var(--c-ink)', textDecoration: 'none',
                background: shopOpen ? 'var(--c-tag-bg)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                Shop
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </Link>
              {/* Dropdown */}
              {shopOpen && (
                <div
                  onMouseEnter={openShop}
                  onMouseLeave={closeShop}
                  style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    background: '#ffffff', border: '0.5px solid var(--c-line)',
                    borderRadius: 12, padding: '8px 0', minWidth: 180,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    zIndex: 100, marginTop: 8,
                    animation: 'desk-fade-in 0.15s ease both',
                  }}
                >
                  {SHOP_LINKS.map(l => (
                    <Link key={l.href} href={l.href} style={{
                      display: 'block', padding: '9px 20px',
                      fontFamily: 'var(--f-body)', fontSize: 13,
                      color: 'var(--c-ink)', textDecoration: 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-tag-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { label: 'New In',    href: '/?cat=new' },
              { label: 'Dresses',   href: '/?cat=dresses' },
              { label: 'Tops',      href: '/?cat=tops' },
              { label: 'Scarves',   href: '/?cat=scarves' },
              { label: 'Outerwear', href: '/?cat=outer' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '8px 14px', borderRadius: 8,
                fontFamily: 'var(--f-body)', fontSize: 13, letterSpacing: '0.02em',
                color: 'var(--c-ink)', textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-tag-bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {/* Search */}
            {searchOpen ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: '0.5px solid var(--c-line)', borderRadius: 999,
                padding: '0 14px', height: 38, background: 'var(--c-bg-soft)',
                animation: 'desk-fade-in 0.15s ease both',
              }}>
                <Search size={14} color="var(--c-ink-mute)" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search pieces…"
                  style={{
                    border: 'none', background: 'transparent', outline: 'none',
                    fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--c-ink)',
                    width: 160,
                  }}
                />
                <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-ink-mute)', display: 'flex', alignItems: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <NavIcon onClick={() => setSearchOpen(true)} label="Search">
                <Search size={18} strokeWidth={1.5} />
              </NavIcon>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" style={{ textDecoration: 'none' }}>
              <NavIconDiv label="Wishlist" badge={wishlist.length}>
                <Heart size={18} strokeWidth={1.5} />
              </NavIconDiv>
            </Link>

            {/* Bag */}
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <NavIconDiv label="Bag" badge={count}>
                <ShoppingBag size={18} strokeWidth={1.5} />
              </NavIconDiv>
            </Link>

            {/* Account */}
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <NavIconDiv label="Account">
                <User size={18} strokeWidth={1.5} />
              </NavIconDiv>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

function NavIcon({ children, onClick, label }: { children: React.ReactNode; onClick?: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 38, height: 38, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--c-ink)', transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-tag-bg)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  )
}

function NavIconDiv({ children, label, badge }: { children: React.ReactNode; label: string; badge?: number }) {
  return (
    <div
      aria-label={label}
      style={{
        width: 38, height: 38, borderRadius: 999, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', cursor: 'pointer',
        color: 'var(--c-ink)', transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-tag-bg)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
      {badge != null && badge > 0 && (
        <span style={{
          position: 'absolute', top: 3, right: 3,
          minWidth: 14, height: 14, padding: '0 3px', borderRadius: 999,
          background: 'var(--c-ink)', color: '#fff',
          fontFamily: 'var(--f-mono)', fontSize: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </div>
  )
}

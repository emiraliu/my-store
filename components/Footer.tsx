'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const NAV = [
  {
    title: 'Shop',
    links: [
      { label: 'All Pieces',  href: '/' },
      { label: 'New In',      href: '/?cat=new' },
      { label: 'Dresses',     href: '/?cat=dresses' },
      { label: 'Tops',        href: '/?cat=tops' },
      { label: 'Scarves',     href: '/?cat=scarves' },
      { label: 'Outerwear',   href: '/?cat=outer' },
      { label: 'Sets',        href: '/?cat=sets' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Sizing Guide',      href: '/' },
      { label: 'Shipping & Returns', href: '/' },
      { label: 'Cash on Delivery',  href: '/' },
      { label: 'Track Your Order',  href: '/profile' },
      { label: 'Contact Us',        href: '/' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story',     href: '/' },
      { label: 'Modest Wear',   href: '/' },
      { label: 'Sustainability', href: '/' },
      { label: 'Careers',       href: '/' },
    ],
  },
]

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Footer shows only on desktop (layout wraps it in desktop-only on product pages)
  if (pathname.startsWith('/admin') || pathname.startsWith('/products/')) return null

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <footer style={{ background: '#0a0a0a', color: '#ffffff', marginTop: 80 }}>
      {/* Newsletter band */}
      <div style={{
        borderBottom: '0.5px solid rgba(255,255,255,0.10)',
        padding: '60px 0',
      }}>
        <div className="page-wrap" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20,
        }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
            Stay in the loop
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 500, lineHeight: 1.1, maxWidth: 560 }}>
            New arrivals, exclusive drops<em style={{ fontStyle: 'italic' }}>.</em>
          </div>
          {subscribed ? (
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
              You&apos;re on the list. Thank you.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 0, maxWidth: 440, width: '100%', marginTop: 4 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  flex: 1, height: 50, padding: '0 20px',
                  border: '0.5px solid rgba(255,255,255,0.20)',
                  borderRight: 'none',
                  borderRadius: '999px 0 0 999px',
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  fontFamily: 'var(--f-body)', fontSize: 13, outline: 'none',
                }}
              />
              <button type="submit" style={{
                height: 50, padding: '0 24px',
                borderRadius: '0 999px 999px 0',
                background: '#ffffff', color: '#000000',
                fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 500,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="page-wrap" style={{ padding: '60px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 48,
        }}
        className="footer-grid"
        >
          {/* Brand col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Image src="/hidaya-logo.jpg" alt="Hidaya Wear" width={64} height={64} style={{ objectFit: 'contain', filter: 'invert(1)' }} />
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)', maxWidth: 260 }}>
              Modest wear made for the modern woman — timeless pieces delivered to your door with cash on delivery.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ Icon: IconInstagram, href: '#' }, { Icon: IconFacebook, href: '#' }].map(({ Icon, href }, i) => (
                <Link key={i} href={href} style={{
                  width: 38, height: 38, borderRadius: 999,
                  border: '0.5px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {NAV.map(col => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} style={{
                    fontFamily: 'var(--f-body)', fontSize: 13,
                    color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                    transition: 'color 0.14s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: '20px 0' }}>
        <div className="page-wrap" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
        }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px 20px', justifyContent: 'center',
            fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.30)',
          }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(t => (
              <Link key={t} href="#" style={{ color: 'inherit', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')}
              >{t}</Link>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} Hidaya Wear. All rights reserved.
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.4fr 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}

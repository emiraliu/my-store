'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin', exact: true },
  { id: 'products',  label: 'Products',  href: '/admin/products' },
  { id: 'orders',    label: 'Orders',    href: '/admin/orders' },
]

const tools = ['Discounts', 'Customers', 'Couriers', 'Settings']

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname === '/admin/login') return null

  const close = () => setOpen(false)

  return (
    <>
      <style>{`
        .adm-mob-bar { display: none; }
        .adm-overlay  { display: none; }
        .adm-close    { display: none !important; }

        @media (max-width: 767px) {
          .adm-mob-bar {
            display: flex;
            align-items: center;
            gap: 10px;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 56px;
            background: #f6f1e6;
            border-bottom: 0.5px solid rgba(44,37,32,0.10);
            padding: 0 16px;
            z-index: 40;
          }
          .adm-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(44,37,32,0.45);
            z-index: 48;
          }
          .adm-aside {
            position: fixed !important;
            top: 0 !important; left: 0 !important; bottom: 0 !important;
            height: 100dvh !important;
            width: 260px !important;
            z-index: 50 !important;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.2,0.8,0.3,1);
          }
          .adm-aside.open {
            transform: translateX(0);
            box-shadow: 12px 0 48px rgba(44,37,32,0.18);
          }
          .adm-close { display: flex !important; }
        }
      `}</style>

      {/* Mobile top bar */}
      <div className="adm-mob-bar">
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Open menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#2c2520', fontSize: 20, lineHeight: 1 }}
        >
          ☰
        </button>
        <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 500, lineHeight: 1 }}>
          My Store<em style={{ fontStyle: 'italic', color: '#b5704d' }}>.</em>
        </div>
      </div>

      {/* Overlay */}
      {open && <div className="adm-overlay" onClick={close} />}

      {/* Sidebar */}
      <aside
        className={`adm-aside${open ? ' open' : ''}`}
        style={{
          width: 232, flexShrink: 0,
          background: '#f6f1e6',
          borderRight: '0.5px solid rgba(44,37,32,0.10)',
          display: 'flex', flexDirection: 'column',
          padding: '16px 14px 14px',
          position: 'sticky', top: 0,
          height: '100dvh',
          fontFamily: F.body, color: '#2c2520',
          overflowY: 'auto',
        }}
      >
        {/* Mobile close row */}
        <div className="adm-close" style={{ justifyContent: 'flex-end', marginBottom: 4 }}>
          <button
            onClick={close}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b5e52', fontSize: 18, padding: 6, lineHeight: 1 }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '4px 10px 22px' }}>
          <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 500, lineHeight: 0.95, letterSpacing: '-0.01em' }}>
            My Store<em style={{ fontStyle: 'italic', color: '#b5704d' }}>.</em>
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', borderLeft: '0.5px solid rgba(44,37,32,0.18)', paddingLeft: 8 }}>
            Admin
          </div>
        </div>

        {/* Operate */}
        <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', padding: '0 10px 6px' }}>
          Operate
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4 }}>
          {navItems.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.id} href={item.href} onClick={close} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 10px', borderRadius: 8,
                fontSize: 13, textDecoration: 'none',
                background: active ? '#2c2520' : 'transparent',
                color: active ? '#fbf7ef' : '#6b5e52',
                transition: 'background 0.12s, color 0.12s',
              }}>
                <span style={{ fontSize: 15, lineHeight: 1, opacity: 0.6 }}>
                  {item.id === 'dashboard' ? '◈' : item.id === 'products' ? '⬡' : '◻'}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Manage */}
        <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', padding: '14px 10px 6px' }}>
          Manage
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tools.map(label => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, fontSize: 13, color: '#6b5e52', opacity: 0.5 }}>
              <span style={{ fontSize: 7 }}>●</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>

        {/* Back to store */}
        <div style={{ marginTop: 'auto', padding: '0 4px 8px' }}>
          <Link href="/" onClick={close} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 10px', borderRadius: 8,
            fontSize: 12, textDecoration: 'none',
            color: '#6b5e52',
            border: '0.5px solid rgba(44,37,32,0.10)',
          }}>
            <span style={{ fontSize: 13 }}>←</span>
            Back to store
          </Link>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 10px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '0.5px solid rgba(44,37,32,0.10)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: '#b5704d', color: '#fbf7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 14, fontWeight: 500, flexShrink: 0 }}>
            A
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Admin</span>
            <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.06em', color: '#6b5e52' }}>Owner</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  )
}

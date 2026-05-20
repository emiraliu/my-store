'use client'

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
  if (pathname === '/admin/login') return null

  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: '#f6f1e6',
      borderRight: '0.5px solid rgba(44,37,32,0.10)',
      display: 'flex', flexDirection: 'column',
      padding: '22px 14px 14px',
      position: 'sticky', top: 0,
      height: '100dvh',
      fontFamily: F.body, color: '#2c2520',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '4px 10px 22px' }}>
        <div style={{
          fontFamily: F.display,
          fontSize: 28, fontWeight: 500, lineHeight: 0.95, letterSpacing: '-0.01em',
        }}>
          My Store<em style={{ fontStyle: 'italic', color: '#b5704d' }}>.</em>
        </div>
        <div style={{
          fontFamily: F.mono, fontSize: 9,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: '#6b5e52',
          borderLeft: '0.5px solid rgba(44,37,32,0.18)',
          paddingLeft: 8,
        }}>
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
            <Link key={item.id} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8,
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
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 8,
            fontSize: 13, color: '#6b5e52', opacity: 0.5,
          }}>
            <span style={{ fontSize: 7, lineHeight: 1 }}>●</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        marginTop: 'auto',
        padding: '12px 10px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderTop: '0.5px solid rgba(44,37,32,0.10)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 999,
          background: '#b5704d', color: '#fbf7ef',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F.display, fontSize: 14, fontWeight: 500, flexShrink: 0,
        }}>
          A
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Admin</span>
          <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.06em', color: '#6b5e52' }}>
            Owner
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <LogoutButton />
        </div>
      </div>
    </aside>
  )
}

'use client'

import { useState } from 'react'
import type { Order } from '@/lib/types'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

const STATUS_LABEL: Record<string, string> = {
  pending_confirmation: 'Pending',
  confirmed:            'Confirmed',
  processing:           'Processing',
  shipped:              'Shipped',
  delivered:            'Delivered',
  cancelled:            'Cancelled',
}

export default function OrderDetailButton({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const p = order.profiles

  const fullName = [p?.full_name, p?.surname].filter(Boolean).join(' ') || '—'
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const time = new Date(order.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '5px 12px', borderRadius: 999,
          background: 'transparent',
          border: '0.5px solid rgba(44,37,32,0.18)',
          fontFamily: F.body, fontSize: 12, color: '#2c2520',
          cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        View
      </button>

      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(44,37,32,0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div style={{
            background: '#fbf7ef',
            borderRadius: 20,
            width: '100%', maxWidth: 520,
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(44,37,32,0.22)',
            border: '0.5px solid rgba(44,37,32,0.10)',
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '0.5px solid rgba(44,37,32,0.10)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              background: '#f6f1e6',
            }}>
              <div>
                <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', marginBottom: 4 }}>
                  Order
                </div>
                <div style={{ fontFamily: F.display, fontSize: 26, fontWeight: 500, lineHeight: 1.1 }}>
                  #{order.id.slice(0, 8).toUpperCase()}
                </div>
                <div style={{ fontFamily: F.mono, fontSize: 10, color: '#6b5e52', marginTop: 4 }}>
                  {date} · {time}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 999,
                  fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#6b5e52',
                  background: 'rgba(44,37,32,0.06)',
                }}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: 'rgba(44,37,32,0.08)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#2c2520', fontSize: 16, lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Customer section */}
              <section>
                <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', marginBottom: 10 }}>
                  Customer
                </div>
                <div style={{
                  background: '#f6f1e6', borderRadius: 12,
                  border: '0.5px solid rgba(44,37,32,0.10)',
                  overflow: 'hidden',
                }}>
                  {[
                    ['Full name',  fullName],
                    ['Username',   p?.username ?? '—'],
                    ['Phone',      order.phone || p?.phone || '—'],
                    ['Gender',     p?.gender ?? '—'],
                    ['Age',        p?.age != null ? String(p.age) : '—'],
                  ].map(([label, value], i, arr) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px',
                      borderBottom: i < arr.length - 1 ? '0.5px solid rgba(44,37,32,0.08)' : 'none',
                    }}>
                      <span style={{ fontFamily: F.mono, fontSize: 10, color: '#6b5e52', letterSpacing: '0.04em' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Delivery address */}
              <section>
                <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', marginBottom: 10 }}>
                  Delivery address
                </div>
                <div style={{
                  background: '#f6f1e6', borderRadius: 12,
                  border: '0.5px solid rgba(44,37,32,0.10)',
                  padding: '12px 14px',
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  {order.address || p?.address || '—'}
                </div>
              </section>

              {/* Items */}
              <section>
                <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b5e52', marginBottom: 10 }}>
                  Items
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(order.items as any[]).map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: '#f6f1e6', borderRadius: 12,
                      border: '0.5px solid rgba(44,37,32,0.10)',
                      padding: '10px 14px',
                    }}>
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 44, height: 44, borderRadius: 8,
                            objectFit: 'cover', flexShrink: 0,
                            background: '#e6dac4',
                          }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </div>
                        <div style={{ fontFamily: F.mono, fontSize: 10, color: '#6b5e52', marginTop: 2 }}>
                          {[item.size && `Size ${item.size}`, `×${item.quantity}`].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                      <div style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Total */}
              <section>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#2c2520', borderRadius: 12,
                  padding: '14px 16px',
                }}>
                  <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(251,247,239,0.6)' }}>
                    Total · Cash on delivery
                  </span>
                  <span style={{ fontFamily: F.mono, fontSize: 16, fontWeight: 500, color: '#fbf7ef' }}>
                    €{order.total.toFixed(2)}
                  </span>
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

const STATUS_MAP: Record<string, { label: string; tone: string }> = {
  pending_confirmation: { label: 'Pending',   tone: 'warn' },
  confirmed:            { label: 'Confirmed', tone: 'good' },
  processing:           { label: 'Processing',tone: 'warn' },
  shipped:              { label: 'Shipped',   tone: 'neutral' },
  delivered:            { label: 'Delivered', tone: 'good' },
  cancelled:            { label: 'Cancelled', tone: 'bad' },
}

function pillStyle(tone: string): React.CSSProperties {
  if (tone === 'good')    return { color: '#4d6b4d', background: 'rgba(77,107,77,0.10)' }
  if (tone === 'warn')    return { color: '#b58a4d', background: 'rgba(181,138,77,0.12)' }
  if (tone === 'bad')     return { color: '#9b4d4d', background: 'rgba(155,77,77,0.12)' }
  return { color: '#6e6e6e', background: 'rgba(0,0,0,0.05)' }
}

export default async function AdminDashboard() {
  const supabase = await createAdminClient()

  const [
    { count: productCount },
    { count: orderCount },
    { count: pendingCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending_confirmation'),
    supabase.from('orders').select('*, profiles(full_name, phone)').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Active products', value: productCount ?? 0 },
    { label: 'Total orders',    value: orderCount ?? 0 },
    { label: 'Pending confirm', value: pendingCount ?? 0 },
    { label: 'Recent orders',   value: recentOrders?.length ?? 0 },
  ]

  return (
    <div style={{ fontFamily: F.body, color: '#000000' }}>
      <style>{`
        .adm-topbar { padding: 12px 20px; }
        .adm-page-pad { padding: 20px 20px 60px; }
        .adm-stats { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
        .adm-stat-card { flex: 1 1 140px; min-width: calc(50% - 8px); }
        @media (min-width: 768px) {
          .adm-topbar { padding: 14px 28px; }
          .adm-page-pad { padding: 28px 28px 60px; }
          .adm-stat-card { min-width: 0; }
        }
      `}</style>
      {/* Topbar */}
      <div className="adm-topbar" style={{
        display: 'flex', alignItems: 'center',
        borderBottom: '0.5px solid rgba(0,0,0,0.10)',
        gap: 14, flexShrink: 0, background: '#f5f5f5',
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6e6e6e' }}>
          Admin <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <strong style={{ color: '#000000', fontWeight: 500 }}>Dashboard</strong>
        </div>
        <Link href="/admin/orders" style={{
          marginLeft: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', borderRadius: 999,
          background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.10)',
          color: '#000000', fontSize: 12.5, textDecoration: 'none',
          fontFamily: F.body,
        }}>
          All orders →
        </Link>
      </div>

      <div className="adm-page-pad">
        <h1 style={{
          fontFamily: F.display,
          fontSize: 38, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em',
          margin: '0 0 6px',
        }}>
          Dashboard<em style={{ fontStyle: 'italic', color: '#000000' }}>.</em>
        </h1>
        <p style={{ fontFamily: F.display, fontStyle: 'italic', fontSize: 14, color: '#6e6e6e', margin: '0 0 24px' }}>
          Cash on delivery — collect when the courier hands it off.
        </p>

        {/* Stat cards */}
        <div className="adm-stats">
          {stats.map(card => (
            <div key={card.label} className="adm-stat-card" style={{
              padding: '18px 20px 16px',
              background: '#ffffff',
              border: '0.5px solid rgba(0,0,0,0.10)',
              borderRadius: 14,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e6e6e' }}>
                {card.label}
              </div>
              <div style={{ fontFamily: F.display, fontSize: 32, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.01em' }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders panel */}
        <div style={{ background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.10)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '18px 20px 12px' }}>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6e6e6e' }}>
                RECENT ORDERS
              </div>
              <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 500, marginTop: 4 }}>
                Awaiting attention
              </div>
            </div>
            <Link href="/admin/orders" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '7px 12px', borderRadius: 999,
              background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.10)',
              color: '#000000', fontSize: 12.5, textDecoration: 'none',
              fontFamily: F.body,
            }}>
              All orders →
            </Link>
          </div>

          {!recentOrders || recentOrders.length === 0 ? (
            <p style={{ padding: '16px 20px', color: '#6e6e6e', fontSize: 13 }}>No orders yet.</p>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
            <table style={{ width: '100%', minWidth: 520, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Order', 'Customer', 'Total', 'Status', 'Placed'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left',
                      fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#6e6e6e', fontWeight: 500,
                      padding: '12px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.10)',
                      background: '#f5f5f5',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => {
                  const s = STATUS_MAP[order.status] ?? { label: order.status, tone: 'neutral' }
                  const shortId = order.id.slice(0, 8).toUpperCase()
                  const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <tr key={order.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 11.5 }}>
                        #{shortId}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{order.profiles?.full_name ?? '—'}</div>
                        <div style={{ fontFamily: F.mono, fontSize: 10, color: '#6e6e6e', marginTop: 2 }}>{order.phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 11.5, fontWeight: 500 }}>
                        €{order.total.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '3px 9px', borderRadius: 999,
                          fontFamily: F.mono, fontSize: 9.5,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          whiteSpace: 'nowrap', ...pillStyle(s.tone),
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 10, color: '#6e6e6e' }}>
                        {date}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import OrderStatusSelect from './OrderStatusSelect'
import OrderDetailButton from './OrderDetailButton'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

const STATUS_MAP: Record<string, { label: string; tone: string }> = {
  pending_confirmation: { label: 'Pending',    tone: 'warn' },
  confirmed:            { label: 'Confirmed',  tone: 'good' },
  processing:           { label: 'Processing', tone: 'warn' },
  shipped:              { label: 'Shipped',    tone: 'neutral' },
  delivered:            { label: 'Delivered',  tone: 'good' },
  cancelled:            { label: 'Cancelled',  tone: 'bad' },
}

function pillStyle(tone: string): React.CSSProperties {
  if (tone === 'good')    return { color: '#4d6b4d', background: 'rgba(77,107,77,0.10)' }
  if (tone === 'warn')    return { color: '#b58a4d', background: 'rgba(181,138,77,0.12)' }
  if (tone === 'bad')     return { color: '#9b4d4d', background: 'rgba(155,77,77,0.12)' }
  if (tone === 'cod')     return { color: '#ffffff', background: '#000000' }
  return { color: '#6e6e6e', background: 'rgba(0,0,0,0.05)' }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter = 'all' } = await searchParams
  const supabase = await createAdminClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, surname, username, phone, gender, age, address)')
    .order('created_at', { ascending: false })

  const all = orders ?? []

  const counts = {
    all:       all.length,
    pending:   all.filter(o => o.status === 'pending_confirmation').length,
    confirmed: all.filter(o => o.status === 'confirmed').length,
    processing:all.filter(o => o.status === 'processing').length,
    shipped:   all.filter(o => o.status === 'shipped').length,
    delivered: all.filter(o => o.status === 'delivered').length,
    cancelled: all.filter(o => o.status === 'cancelled').length,
  }

  const filtered = filter === 'pending'   ? all.filter(o => o.status === 'pending_confirmation')
                 : filter === 'confirmed'  ? all.filter(o => o.status === 'confirmed')
                 : filter === 'processing' ? all.filter(o => o.status === 'processing')
                 : filter === 'shipped'    ? all.filter(o => o.status === 'shipped')
                 : filter === 'delivered'  ? all.filter(o => o.status === 'delivered')
                 : filter === 'cancelled'  ? all.filter(o => o.status === 'cancelled')
                 : all

  const tabs: [string, string][] = [
    ['all',       `All · ${counts.all}`],
    ['pending',   `Pending · ${counts.pending}`],
    ['confirmed', `Confirmed · ${counts.confirmed}`],
    ['processing',`Processing · ${counts.processing}`],
    ['shipped',   `Shipped · ${counts.shipped}`],
    ['delivered', `Delivered · ${counts.delivered}`],
    ['cancelled', `Cancelled · ${counts.cancelled}`],
  ]

  return (
    <div style={{ fontFamily: F.body, color: '#000000' }}>
      <style>{`
        .adm-topbar { padding: 12px 16px; }
        .adm-page-pad { padding: 20px 16px 60px; }
        @media (min-width: 768px) {
          .adm-topbar { padding: 14px 28px; }
          .adm-page-pad { padding: 28px 28px 60px; }
        }
      `}</style>
      {/* Topbar */}
      <div className="adm-topbar" style={{
        display: 'flex', alignItems: 'center',
        borderBottom: '0.5px solid rgba(0,0,0,0.10)',
        gap: 10, background: '#f5f5f5',
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6e6e6e' }}>
          Admin <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <strong style={{ color: '#000000', fontWeight: 500 }}>Orders</strong>
        </div>
      </div>

      <div className="adm-page-pad">
        <h1 style={{
          fontFamily: F.display,
          fontSize: 38, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em',
          margin: '0 0 6px',
        }}>
          Orders<em style={{ fontStyle: 'italic', color: '#000000' }}>.</em>
        </h1>
        <p style={{ fontFamily: F.display, fontStyle: 'italic', fontSize: 14, color: '#6e6e6e', margin: '0 0 24px' }}>
          All orders are paid in cash on delivery — collect after the customer accepts.
        </p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {tabs.map(([id, label]) => (
            <Link key={id} href={`/admin/orders?filter=${id}`} style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '6px 11px', borderRadius: 999,
              fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap',
              background: filter === id ? '#000000' : 'transparent',
              color: filter === id ? '#ffffff' : '#000000',
              border: filter === id ? '0.5px solid transparent' : '0.5px solid rgba(0,0,0,0.10)',
              fontFamily: F.body,
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.10)', borderRadius: 14, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <p style={{ padding: '24px 20px', color: '#6e6e6e', fontSize: 13 }}>No orders found.</p>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
            <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Update', 'Placed', ''].map((h, i) => (
                    <th key={i} style={{
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
                {filtered.map((order: any) => {
                  const s = STATUS_MAP[order.status] ?? { label: order.status, tone: 'neutral' }
                  const shortId = order.id.slice(0, 8).toUpperCase()
                  const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  const itemSummary = (order.items as any[])
                    .slice(0, 2)
                    .map((it: any) => `${it.name}${it.size ? ` (${it.size})` : ''} ×${it.quantity}`)
                    .join(', ')
                  const moreItems = order.items.length > 2 ? ` +${order.items.length - 2}` : ''

                  return (
                    <tr key={order.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 11.5 }}>
                        #{shortId}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{order.profiles?.full_name ?? '—'}</div>
                        <div style={{ fontFamily: F.mono, fontSize: 10, color: '#6e6e6e', marginTop: 2 }}>
                          {order.phone}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', maxWidth: 200 }}>
                        <div style={{ fontSize: 12, color: '#6e6e6e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {itemSummary}{moreItems}
                        </div>
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
                          color: '#ffffff', background: '#000000',
                          whiteSpace: 'nowrap',
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />
                          COD
                        </span>
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
                      <td style={{ padding: '14px 16px' }}>
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 10, color: '#6e6e6e' }}>
                        {date}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <OrderDetailButton order={order} />
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

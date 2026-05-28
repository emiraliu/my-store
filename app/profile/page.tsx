import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/lib/types'
import LogoutButton from '@/components/LogoutButton'

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  pending_confirmation: { label: 'Awaiting confirmation', dot: '#f59e0b' },
  confirmed:  { label: 'Confirmed',  dot: '#3b82f6' },
  processing: { label: 'Processing', dot: '#8b5cf6' },
  shipped:    { label: 'Shipped',    dot: '#f97316' },
  delivered:  { label: 'Delivered',  dot: '#22c55e' },
  cancelled:  { label: 'Cancelled',  dot: '#ef4444' },
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ ordered?: string }>
}) {
  const { ordered } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/verify')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, surname, username, phone, address')
    .eq('id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const orderList = (orders ?? []) as Order[]
  const displayName = profile?.full_name && profile?.surname
    ? `${profile.full_name} ${profile.surname}`
    : profile?.full_name ?? 'You'

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh' }}>
      {/* Page header */}
      <div style={{ borderBottom: '0.5px solid var(--c-line)' }}>
        <div className="page-wrap" style={{ padding: '40px 20px 24px' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 6 }}>
            Your account
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500 }}>
                {displayName}<em style={{ fontStyle: 'italic' }}>.</em>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                {profile?.username && <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)' }}>@{profile.username}</span>}
                {profile?.phone && <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)' }}>{profile.phone}</span>}
                {user.email && <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)' }}>{user.email}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{ fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--c-ink-mute)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                Continue shopping
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrap" style={{ padding: '40px 20px 100px' }}>
        {/* Order placed banner */}
        {ordered && (
          <div style={{
            background: '#f0fdf4', border: '0.5px solid #86efac',
            borderRadius: 14, padding: '16px 20px', marginBottom: 32,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: '#22c55e', marginTop: 4, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 500, marginBottom: 2, fontSize: 14 }}>Order placed!</div>
              <div style={{ color: 'var(--c-ink-mute)', fontSize: 13 }}>Reply <strong>YES</strong> to the SMS sent to your phone to confirm.</div>
            </div>
          </div>
        )}

        {/* Two-column on desktop: orders + profile info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="profile-grid">
          {/* Orders */}
          <div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 20 }}>
              Your orders · {orderList.length}
            </div>

            {orderList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--c-ink-mute)' }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 500, color: 'var(--c-ink)', marginBottom: 8 }}>No orders yet.</div>
                <p style={{ fontSize: 13, marginBottom: 20 }}>Your orders will appear here.</p>
                <Link href="/" className="btn-outline" style={{ display: 'inline-flex' }}>Browse the collection</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {orderList.map(order => {
                  const status = STATUS_CONFIG[order.status] ?? { label: order.status, dot: '#6e6e6e' }
                  const shortId = order.id.slice(0, 8).toUpperCase()
                  const date = new Date(order.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
                  return (
                    <div key={order.id} style={{
                      border: '0.5px solid var(--c-line)', borderRadius: 16,
                      overflow: 'hidden',
                    }}>
                      {/* Order header */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 20px',
                        background: 'var(--c-bg-soft)',
                        borderBottom: '0.5px solid var(--c-line)',
                        flexWrap: 'wrap', gap: 8,
                      }}>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.06em' }}>#{shortId}</div>
                            <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', marginTop: 1, fontFamily: 'var(--f-mono)' }}>{date}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 7, height: 7, borderRadius: 999, background: status.dot, display: 'inline-block' }} />
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', color: 'var(--c-ink-mute)' }}>{status.label}</span>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 500 }}>€{order.total.toFixed(2)}</div>
                      </div>

                      {/* Items */}
                      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 13 }}>
                            <span style={{ color: 'var(--c-ink-mute)' }}>{item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity}</span>
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>€{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {order.status === 'pending_confirmation' && (
                        <div style={{ padding: '0 20px 14px', fontSize: 12, color: 'var(--c-ink-mute)', fontStyle: 'italic' }}>
                          Reply YES to the SMS sent to {order.phone} to confirm.
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Profile info sidebar */}
          <div className="profile-sidebar">
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 20 }}>
              Account details
            </div>
            <div style={{ border: '0.5px solid var(--c-line)', borderRadius: 16, overflow: 'hidden' }}>
              {[
                { label: 'Name', value: displayName },
                { label: 'Username', value: profile?.username ? `@${profile.username}` : '—' },
                { label: 'Phone', value: profile?.phone ?? '—' },
                { label: 'Email', value: user.email ?? '—' },
                { label: 'Delivery address', value: profile?.address ?? '—' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '14px 20px', gap: 16,
                  borderBottom: i < arr.length - 1 ? '0.5px solid var(--c-line)' : 'none',
                }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--c-ink)', textAlign: 'right', wordBreak: 'break-word' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .profile-grid { grid-template-columns: 1fr 320px !important; }
          .profile-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  )
}

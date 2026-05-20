import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/lib/types'

const STATUS_LABELS: Record<string, { label: string }> = {
  pending_confirmation: { label: 'Awaiting confirmation' },
  confirmed:  { label: 'Confirmed' },
  processing: { label: 'Processing' },
  shipped:    { label: 'Shipped' },
  delivered:  { label: 'Delivered' },
  cancelled:  { label: 'Cancelled' },
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ ordered?: string }>
}) {
  const { ordered } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/register')

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

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh', padding: '60px 22px 120px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 4 }}>
          YOUR ACCOUNT
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 500 }}>
          {profile?.full_name && profile?.surname
            ? `${profile.full_name} ${profile.surname}`
            : profile?.full_name ?? 'You.'}
        </div>
        {profile?.username && (
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--c-ink-mute)', marginTop: 2 }}>
            @{profile.username}
          </div>
        )}
        {profile?.phone && (
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--c-ink-mute)', marginTop: 4 }}>
            {profile.phone}
          </div>
        )}
      </div>

      {/* Order placed banner */}
      {ordered && (
        <div style={{
          background: 'var(--c-card)', border: '0.5px solid var(--c-line)',
          borderRadius: 'var(--r-card)', padding: '14px 16px', marginBottom: 24,
          fontSize: 13,
        }}>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>Order placed!</div>
          <div style={{ color: 'var(--c-ink-mute)' }}>Reply <strong>YES</strong> to the SMS sent to your phone to confirm.</div>
        </div>
      )}

      {/* Orders */}
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 14 }}>
        YOUR ORDERS · {orderList.length}
      </div>

      {orderList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--c-ink-mute)', fontSize: 13 }}>
          <p>No orders yet.</p>
          <Link href="/" style={{
            display: 'inline-block', marginTop: 14, padding: '10px 18px', borderRadius: 999,
            border: '0.5px solid var(--c-line)', color: 'var(--c-ink)',
            fontSize: 13, textDecoration: 'none', fontFamily: 'var(--f-body)',
          }}>Browse the catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orderList.map(order => {
            const status = STATUS_LABELS[order.status] ?? { label: order.status }
            const shortId = order.id.slice(0, 8).toUpperCase()
            const date = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            return (
              <div key={order.id} style={{
                background: 'var(--c-card)', border: '0.5px solid var(--c-line)',
                borderRadius: 'var(--r-card)', padding: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.04em' }}>#{shortId}</div>
                    <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', marginTop: 2, fontFamily: 'var(--f-mono)' }}>{date}</div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '4px 8px', borderRadius: 999,
                    background: 'var(--c-tag-bg)', color: 'var(--c-ink-mute)',
                  }}>
                    {status.label}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--c-ink-mute)' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity}</span>
                      <span style={{ fontFamily: 'var(--f-mono)' }}>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '0.5px solid var(--c-line)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500 }}>
                  <span>Total</span>
                  <span style={{ fontFamily: 'var(--f-mono)' }}>€{order.total.toFixed(2)}</span>
                </div>

                {order.status === 'pending_confirmation' && (
                  <div style={{ fontSize: 11, color: 'var(--c-ink-mute)', marginTop: 10, fontStyle: 'italic' }}>
                    Reply YES to the SMS sent to {order.phone} to confirm.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

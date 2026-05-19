import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/lib/types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_confirmation: { label: 'Awaiting confirmation', color: 'bg-amber-50 text-amber-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-700' },
  processing: { label: 'Processing', color: 'bg-purple-50 text-purple-700' },
  shipped: { label: 'Shipped', color: 'bg-indigo-50 text-indigo-700' },
  delivered: { label: 'Delivered', color: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700' },
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
    .select('full_name, phone, address')
    .eq('id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const orderList = (orders ?? []) as Order[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{profile?.full_name ?? 'My Account'}</h1>
          <p className="text-zinc-400 text-sm mt-1">{profile?.phone}</p>
        </div>
      </div>

      {ordered && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-green-800 text-sm">
          <p className="font-medium">Order placed!</p>
          <p>Check your phone — reply <strong>YES</strong> to the SMS to confirm your order.</p>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">My orders</h2>

      {orderList.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orderList.map(order => {
            const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-zinc-100 text-zinc-600' }
            const shortId = order.id.slice(0, 8).toUpperCase()
            const date = new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })
            return (
              <div key={order.id} className="border border-zinc-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order #{shortId}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{date}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-zinc-600">
                      <span>{item.name} {item.size && `(${item.size})`} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-100 mt-3 pt-3 flex justify-between font-semibold text-sm">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>

                {order.status === 'pending_confirmation' && (
                  <p className="text-xs text-amber-600 mt-3">
                    Reply <strong>YES</strong> to the SMS sent to {order.phone} to confirm this order.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

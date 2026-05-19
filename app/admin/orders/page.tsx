import { createAdminClient } from '@/lib/supabase/server'
import OrderStatusSelect from './OrderStatusSelect'

const STATUS_COLORS: Record<string, string> = {
  pending_confirmation: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default async function AdminOrdersPage() {
  const supabase = await createAdminClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, phone)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Orders</h1>

      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        {!orders || orders.length === 0 ? (
          <p className="p-6 text-zinc-400 text-sm">No orders yet.</p>
        ) : (
          <div className="divide-y divide-zinc-50">
            {orders.map((order: any) => {
              const date = new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })
              const shortId = order.id.slice(0, 8).toUpperCase()

              return (
                <div key={order.id} className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold font-mono text-sm">#{shortId}</p>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">{date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Cash on delivery</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">Customer</p>
                      <p className="font-medium">{order.profiles?.full_name ?? '—'}</p>
                      <p className="text-zinc-500">{order.phone}</p>
                      <p className="text-zinc-500 text-xs mt-1">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">Items</p>
                      {order.items.map((item: any, i: number) => (
                        <p key={i} className="text-zinc-700">
                          {item.name} {item.size && `(${item.size})`} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-zinc-500 mb-1">Update status</p>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

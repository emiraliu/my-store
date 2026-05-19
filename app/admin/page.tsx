import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: productCount }, { count: orderCount }, { data: recentOrders }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, profiles(full_name, phone)').order('created_at', { ascending: false }).limit(5),
  ])

  const STATUS_COLORS: Record<string, string> = {
    pending_confirmation: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white rounded-xl p-6 border border-zinc-100">
          <p className="text-sm text-zinc-500 mb-1">Active products</p>
          <p className="text-3xl font-bold">{productCount ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-zinc-100">
          <p className="text-sm text-zinc-500 mb-1">Total orders</p>
          <p className="text-3xl font-bold">{orderCount ?? 0}</p>
        </div>
      </div>

      <h2 className="font-semibold mb-4">Recent orders</h2>
      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        {!recentOrders || recentOrders.length === 0 ? (
          <p className="p-6 text-zinc-400 text-sm">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 text-zinc-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Order</th>
                <th className="text-left px-6 py-3 font-medium">Customer</th>
                <th className="text-left px-6 py-3 font-medium">Total</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {recentOrders.map((order: any) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4">{order.profiles?.full_name ?? '—'}</td>
                  <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

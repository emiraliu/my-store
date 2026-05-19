import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/types'
import DeleteProductButton from './DeleteProductButton'

export default async function AdminProductsPage() {
  const supabase = await createAdminClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  const products = (data ?? []) as Product[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} />
          Add product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        {products.length === 0 ? (
          <p className="p-6 text-zinc-400 text-sm">No products yet. Add your first one!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 text-zinc-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Product</th>
                <th className="text-left px-6 py-3 font-medium">Category</th>
                <th className="text-left px-6 py-3 font-medium">Price</th>
                <th className="text-left px-6 py-3 font-medium">Stock</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-zinc-500 capitalize">{product.category}</td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.active ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                      {product.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-zinc-500 hover:text-black text-xs underline">
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
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

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-xl font-medium mb-2">Your cart is empty</p>
        <p className="text-zinc-400 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={`${item.product_id}-${item.size}`} className="flex gap-4 p-4 border border-zinc-100 rounded-xl">
            <div className="w-20 h-24 relative flex-shrink-0 bg-zinc-100 rounded-lg overflow-hidden">
              {item.image && (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              {item.size && <p className="text-sm text-zinc-400 mt-0.5">Size: {item.size}</p>}
              <p className="font-semibold mt-1">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.product_id, item.size)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex items-center gap-2 border border-zinc-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)}
                  className="px-3 py-1.5 hover:bg-zinc-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                  className="px-3 py-1.5 hover:bg-zinc-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-100 pt-6">
        <div className="flex justify-between text-lg font-semibold mb-6">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <p className="text-sm text-zinc-400 mb-4">Cash on delivery — you pay when your order arrives.</p>
        <Link
          href="/checkout"
          className="block w-full bg-black text-white text-center py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  )
}

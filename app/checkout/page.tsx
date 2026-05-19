'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single()
      if (profile) {
        if (profile.full_name) setFullName(profile.full_name)
        if (profile.phone) setPhone(profile.phone)
        if (profile.address) setAddress(profile.address)
      }
    }
    loadProfile()
  }, [])

  if (items.length === 0) {
    router.replace('/cart')
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/register')
        return
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items,
          total,
          status: 'pending_confirmation',
          phone,
          address,
        })
        .select()
        .single()

      if (orderError) {
        setError('Failed to place order. Please try again.')
        return
      }

      await supabase.from('profiles').update({ full_name: fullName, phone, address }).eq('id', user.id)

      await fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, phone, total }),
      })

      clearCart()
      router.push(`/profile?ordered=1`)
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-semibold text-lg">Delivery details</h2>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Delivery address</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={3}
              placeholder="Street, city, postal code..."
              className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="bg-zinc-50 rounded-xl p-4 text-sm text-zinc-600">
            <p className="font-medium text-zinc-800 mb-1">Cash on delivery</p>
            <p>After placing your order, you&apos;ll receive an SMS. Reply <strong>YES</strong> to confirm. You pay when the order arrives.</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Order summary</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={`${item.product_id}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-zinc-600">
                  {item.name} {item.size && `(${item.size})`} × {item.quantity}
                </span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-zinc-100 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

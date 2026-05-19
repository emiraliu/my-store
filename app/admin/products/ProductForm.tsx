'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

const CATEGORIES = ['clothing', 'shoes', 'accessories']

interface ProductFormProps {
  product?: Product
}

export default function ProductForm({ product }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [category, setCategory] = useState(product?.category ?? 'clothing')
  const [stock, setStock] = useState(product?.stock?.toString() ?? '0')
  const [imagesRaw, setImagesRaw] = useState(product?.images?.join('\n') ?? '')
  const [sizesRaw, setSizesRaw] = useState(product?.sizes?.join(', ') ?? '')
  const [active, setActive] = useState(product?.active ?? true)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const images = imagesRaw.split('\n').map(s => s.trim()).filter(Boolean)
    const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean)
    const payload = {
      name,
      description: description || null,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      images,
      sizes,
      active,
    }

    startTransition(async () => {
      const supabase = createClient()
      let err

      if (product) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id)
        err = error
      } else {
        const { error } = await supabase.from('products').insert(payload)
        err = error
      }

      if (err) {
        setError(err.message)
        return
      }
      router.push('/admin/products')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Product name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Stock</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors bg-white"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Image URLs (one per line)</label>
        <textarea
          value={imagesRaw}
          onChange={e => setImagesRaw(e.target.value)}
          rows={3}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors resize-none font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Sizes (comma separated)</label>
        <input
          type="text"
          value={sizesRaw}
          onChange={e => setSizesRaw(e.target.value)}
          placeholder="XS, S, M, L, XL or 38, 39, 40, 41"
          className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="active"
          checked={active}
          onChange={e => setActive(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="active" className="text-sm font-medium text-zinc-700">Active (visible to customers)</label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : product ? 'Save changes' : 'Add product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-zinc-200 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Play } from 'lucide-react'
import type { Product } from '@/lib/types'

const CATEGORIES = ['dresses', 'tops', 'scarves', 'outerwear', 'sets']
const VIDEO_EXTS = ['mp4', 'mov', 'webm', 'ogg', 'avi']

function isVideo(url: string) {
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase() ?? ''
  return VIDEO_EXTS.includes(ext)
}

export default function ProductForm({ product }: { product?: Product }) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [category, setCategory] = useState(product?.category ?? 'dresses')
  const [stock, setStock] = useState(product?.stock?.toString() ?? '0')
  const [media, setMedia] = useState<string[]>(product?.images ?? [])
  const [sizesRaw, setSizesRaw] = useState(product?.sizes?.join(', ') ?? '')
  const [active, setActive] = useState(product?.active ?? true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setError('')

    const results = await Promise.all(files.map(async file => {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Upload failed')
      }
      const { url } = await res.json()
      return url as string
    }))

    setMedia(prev => [...prev, ...results])
    setUploading(false)
    e.target.value = ''
  }

  function removeMedia(url: string) {
    setMedia(prev => prev.filter(u => u !== url))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean)
    const payload = {
      name,
      description: description || null,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      images: media,
      sizes,
      active,
    }

    startTransition(async () => {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Something went wrong')
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
          <label className="block text-sm font-medium text-zinc-700 mb-1">Price (€)</label>
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

      {/* Media upload */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Photos & Videos</label>

        {media.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {media.map(url => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100 group">
                {isVideo(url) ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <Play size={24} className="text-white" fill="white" />
                    <span className="absolute bottom-1 left-1 text-[9px] text-white bg-black/50 px-1 rounded">VIDEO</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(url)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border border-dashed border-zinc-300 rounded-lg px-4 py-3 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors w-full justify-center disabled:opacity-50"
        >
          <Upload size={15} />
          {uploading ? 'Uploading…' : 'Upload photos or videos'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Sizes (comma separated)</label>
        <input
          type="text"
          value={sizesRaw}
          onChange={e => setSizesRaw(e.target.value)}
          placeholder="XS, S, M, L, XL"
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
          disabled={isPending || uploading}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : product ? 'Save changes' : 'Add product'}
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

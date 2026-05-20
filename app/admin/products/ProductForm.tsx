'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/types'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

const CATEGORIES = ['dresses', 'tops', 'scarves', 'outerwear', 'sets']
const VIDEO_EXTS = ['mp4', 'mov', 'webm', 'ogg', 'avi']

function isVideo(url: string) {
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase() ?? ''
  return VIDEO_EXTS.includes(ext)
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  height: 42, borderRadius: 10,
  border: '0.5px solid rgba(44,37,32,0.18)',
  background: '#fbf7ef',
  padding: '0 14px',
  fontSize: 13.5, fontFamily: F.body,
  color: '#2c2520', outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: F.mono, fontSize: 9.5,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: '#6b5e52', marginBottom: 6,
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
    try {
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
    } catch (err: any) {
      setError(err.message ?? 'Upload failed')
    }
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>Product name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          style={{
            ...inputStyle, height: 'auto', padding: '10px 14px',
            resize: 'vertical', lineHeight: 1.5,
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Price (€)</label>
          <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Stock</label>
          <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} required style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Photos & Videos</label>
        {media.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
            {media.map(url => (
              <div key={url} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: '#e6dac4' }}>
                {isVideo(url) ? (
                  <div style={{ width: '100%', height: '100%', background: '#2c2520', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#fbf7ef', fontSize: 20 }}>▶</span>
                    <span style={{ fontFamily: F.mono, fontSize: 9, color: 'rgba(251,247,239,0.6)', letterSpacing: '0.06em' }}>VIDEO</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(url)}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 20, height: 20, borderRadius: 999,
                    background: 'rgba(44,37,32,0.7)', color: '#fbf7ef',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%', padding: '12px',
            border: '0.5px dashed rgba(44,37,32,0.25)',
            borderRadius: 10, background: 'transparent',
            fontFamily: F.body, fontSize: 13, color: '#6b5e52',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          ↑ {uploading ? 'Uploading…' : 'Upload photos or videos'}
        </button>
      </div>

      <div>
        <label style={labelStyle}>Sizes (comma separated)</label>
        <input
          type="text"
          value={sizesRaw}
          onChange={e => setSizesRaw(e.target.value)}
          placeholder="XS, S, M, L, XL"
          style={inputStyle}
        />
      </div>

      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => setActive(v => !v)}
          style={{
            width: 16, height: 16, borderRadius: 4,
            border: '0.5px solid rgba(44,37,32,0.18)',
            background: active ? '#2c2520' : '#fbf7ef',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          {active && (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#fbf7ef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span style={{ fontFamily: F.body, fontSize: 13, color: '#2c2520' }}>
          Visible to customers
        </span>
      </label>

      {error && (
        <div style={{
          background: 'rgba(155,77,77,0.08)', border: '0.5px solid #9b4d4d',
          borderRadius: 8, padding: '10px 14px',
          fontSize: 13, color: '#9b4d4d',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button
          type="submit"
          disabled={isPending || uploading}
          style={{
            padding: '10px 22px', borderRadius: 999,
            background: '#2c2520', color: '#fbf7ef',
            border: 'none', fontSize: 13, fontWeight: 500,
            fontFamily: F.body, cursor: isPending || uploading ? 'not-allowed' : 'pointer',
            opacity: isPending || uploading ? 0.6 : 1,
          }}
        >
          {isPending ? 'Saving…' : product ? 'Save changes' : 'Add product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '10px 22px', borderRadius: 999,
            background: 'transparent', color: '#2c2520',
            border: '0.5px solid rgba(44,37,32,0.18)',
            fontSize: 13, fontFamily: F.body, cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

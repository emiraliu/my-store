'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import FiltersSheet, { type Filters } from './FiltersSheet'

const CATEGORIES = [
  { id: 'all',     label: 'All' },
  { id: 'new',     label: 'New In' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'tops',    label: 'Tops' },
  { id: 'scarves', label: 'Scarves' },
  { id: 'outer',   label: 'Outerwear' },
  { id: 'sets',    label: 'Sets' },
]


export default function HomeScreen({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('all')
  const [filters, setFilters] = useState<Filters>({})
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (category === 'new') {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
      list = list.filter(p => new Date(p.created_at).getTime() > cutoff)
    } else if (category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === category)
    }
    if (filters.size?.length) {
      list = list.filter(p => Object.keys(p.sizes).some(s => filters.size!.includes(s)))
    }
    const price = filters.price?.[0]
    if (price === 'Under €60')      list = list.filter(p => p.price < 60)
    else if (price === '€60 — €120') list = list.filter(p => p.price >= 60 && p.price <= 120)
    else if (price === '€120 — €200')list = list.filter(p => p.price > 120 && p.price <= 200)
    else if (price === '€200+')      list = list.filter(p => p.price > 200)
    const sort = filters.sort?.[0]
    if (sort === 'Price · low to high')  list.sort((a, b) => a.price - b.price)
    else if (sort === 'Price · high to low') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return list
  }, [products, category, filters])

  const filterCount = Object.values(filters).reduce((n, v) => n + (v?.length ?? 0), 0)

  function handleFilterChange(groupId: string, value: string, single: boolean) {
    setFilters(f => {
      const cur = (f[groupId as keyof Filters] || []) as string[]
      if (single) return { ...f, [groupId]: cur[0] === value ? [] : [value] }
      return { ...f, [groupId]: cur.includes(value) ? cur.filter(x => x !== value) : [...cur, value] }
    })
  }

  return (
    <>
      {/* Brand hero */}
      <div style={{ padding: '60px 20px 0' }}>
        {/* Logo row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Image
            src="/hidaya-logo.jpg"
            alt="Store logo"
            width={96}
            height={96}
            style={{ objectFit: 'contain' }}
            priority
          />
          <button
            onClick={() => setFiltersOpen(true)}
            style={{
              width: 40, height: 40, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: '0.5px solid var(--c-line)',
              color: 'var(--c-ink)', cursor: 'pointer',
            }}
            aria-label="Filters"
          >
            <SlidersHorizontal size={17} strokeWidth={1.6} />
            {filterCount > 0 && (
              <span style={{
                position: 'absolute',
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
                background: 'var(--c-accent)', color: 'var(--c-accent-ink)',
                fontFamily: 'var(--f-mono)', fontSize: 9,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transform: 'translate(10px,-10px)',
              }}>{filterCount}</span>
            )}
          </button>
        </div>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 8,
        }}>
          New collection · Modest wear
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'var(--f-display)', fontStyle: 'italic',
          fontSize: 20, lineHeight: 1.35, color: 'var(--c-ink)',
          marginBottom: 18, maxWidth: 320,
        }}>
          Dress like the woman you{"'"}re becoming.
        </div>

        {/* Marquee strip */}
        <div style={{
          margin: '0 -20px 6px',
          padding: '10px 0',
          borderTop: '0.5px solid var(--c-line)',
          borderBottom: '0.5px solid var(--c-line)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          <div className="marquee-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{
                fontFamily: 'var(--f-mono)', fontSize: 11,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: 12,
              }}>
                Pay on delivery
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block', flexShrink: 0 }} />
                Cash on arrival
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block', flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </div>


      {/* Category strip */}
      <div className="no-scrollbar" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 18px 14px',
        overflowX: 'auto',
      }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '7px 12px', borderRadius: 999,
            background: category === c.id ? 'var(--c-ink)' : 'var(--c-tag-bg)',
            color: category === c.id ? 'var(--c-card)' : 'var(--c-ink)',
            border: '0.5px solid transparent',
            fontSize: 12, fontFamily: 'var(--f-body)',
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid / empty state */}
      {filtered.length === 0 ? (
        <div style={{ padding: '80px 32px 0', textAlign: 'center', color: 'var(--c-ink-mute)' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>No matches</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, fontWeight: 500, color: 'var(--c-ink)', margin: '12px 0 6px' }}>Nothing here yet.</div>
          <p style={{ fontSize: 13 }}>Try fewer filters or a different category.</p>
          <button onClick={() => { setCategory('all'); setFilters({}) }} style={{
            marginTop: 14, padding: '10px 18px', borderRadius: 999,
            border: '0.5px solid var(--c-line)', color: 'var(--c-ink)',
            fontSize: 13, background: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--f-body)',
          }}>Clear all filters</button>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 14, padding: '0 18px 120px',
        }}>
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      <FiltersSheet
        open={filtersOpen}
        filters={filters}
        onChange={handleFilterChange}
        onClose={() => setFiltersOpen(false)}
        onClear={() => setFilters({})}
      />
    </>
  )
}

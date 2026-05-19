'use client'

import { useState, useMemo } from 'react'
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

const MARQUEE_TOKENS = Array.from({ length: 8 })

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
      list = list.filter(p => p.sizes.some(s => filters.size!.includes(s)))
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
      <div style={{ padding: '72px 24px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--f-display)', fontWeight: 500, fontSize: 72, lineHeight: 0.9, marginBottom: 20 }}>
          MyStore<span style={{ fontStyle: 'italic', color: 'var(--c-accent)' }}>.</span>
        </div>
        <div style={{
          fontFamily: 'var(--f-display)', fontStyle: 'italic',
          fontSize: 20, lineHeight: 1.4, color: 'var(--c-ink-mute)',
          maxWidth: 300, margin: '0 auto 28px',
        }}>
          Dress like the woman you&apos;re becoming.
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 999,
          background: 'var(--c-tag-bg)', border: '0.5px solid var(--c-line)',
          fontFamily: 'var(--f-mono)', fontSize: 10,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--c-cod)', marginBottom: 28,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />
          Cash on delivery · No card needed
        </div>
      </div>

        {/* COD marquee */}
        <div className="no-scrollbar" style={{
          overflow: 'hidden',
          margin: '0 -20px 14px',
          padding: '10px 0',
          borderTop: '0.5px solid var(--c-line)',
          borderBottom: '0.5px solid var(--c-line)',
          color: 'var(--c-cod)',
        }}>
          <div className="marquee-track">
            {MARQUEE_TOKENS.map((_, i) => (
              <span key={i} style={{
                fontFamily: 'var(--f-mono)', fontSize: 11,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                flexShrink: 0,
              }}>
                Cash on delivery
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
                Pay when you receive
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
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
        {/* Filter chip */}
        <button onClick={() => setFiltersOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', borderRadius: 999,
          background: 'transparent',
          border: '0.5px solid var(--c-line)',
          color: 'var(--c-ink)', fontSize: 12,
          fontFamily: 'var(--f-body)',
          cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          <SlidersHorizontal size={14} strokeWidth={1.6} />
          Filters
          {filterCount > 0 && (
            <span style={{
              minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
              background: 'var(--c-accent)', color: 'var(--c-accent-ink)',
              fontFamily: 'var(--f-mono)', fontSize: 9,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{filterCount}</span>
          )}
        </button>

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

'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { SlidersHorizontal, ArrowRight } from 'lucide-react'
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
    if (price === 'Under €60')       list = list.filter(p => p.price < 60)
    else if (price === '€60 — €120') list = list.filter(p => p.price >= 60 && p.price <= 120)
    else if (price === '€120 — €200')list = list.filter(p => p.price > 120 && p.price <= 200)
    else if (price === '€200+')      list = list.filter(p => p.price > 200)
    const sort = filters.sort?.[0]
    if (sort === 'Price · low to high')     list.sort((a, b) => a.price - b.price)
    else if (sort === 'Price · high to low') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return list
  }, [products, category, filters])

  const filterCount = Object.values(filters).reduce((n, v) => n + (v?.length ?? 0), 0)
  const newProducts = products.filter(p => Date.now() - new Date(p.created_at).getTime() < 30 * 24 * 60 * 60 * 1000)

  function handleFilterChange(groupId: string, value: string, single: boolean) {
    setFilters(f => {
      const cur = (f[groupId as keyof Filters] || []) as string[]
      if (single) return { ...f, [groupId]: cur[0] === value ? [] : [value] }
      return { ...f, [groupId]: cur.includes(value) ? cur.filter(x => x !== value) : [...cur, value] }
    })
  }

  return (
    <>
      {/* ── MOBILE HERO ────────────────────────────────── */}
      <div className="mobile-only" style={{ padding: '60px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Image src="/hidaya-logo.jpg" alt="Hidaya Wear" width={80} height={80} style={{ objectFit: 'contain' }} priority />
          <button
            onClick={() => setFiltersOpen(true)}
            style={{
              width: 40, height: 40, borderRadius: 999, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: '0.5px solid var(--c-line)',
              color: 'var(--c-ink)', cursor: 'pointer',
            }}
            aria-label="Filters"
          >
            <SlidersHorizontal size={17} strokeWidth={1.6} />
            {filterCount > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
                background: 'var(--c-accent)', color: 'var(--c-accent-ink)',
                fontFamily: 'var(--f-mono)', fontSize: 9,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{filterCount}</span>
            )}
          </button>
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 8 }}>
          New collection · Modest wear
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.35, color: 'var(--c-ink)', marginBottom: 18, maxWidth: 320 }}>
          Dress like the woman you{"'"}re becoming.
        </div>
        {/* Marquee */}
        <div style={{ margin: '0 -20px 0', padding: '10px 0', borderTop: '0.5px solid var(--c-line)', borderBottom: '0.5px solid var(--c-line)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div className="marquee-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                Pay on delivery
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
                Cash on arrival
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP HERO ───────────────────────────────── */}
      <div className="desktop-only">
        {/* Full-width editorial hero */}
        <div style={{
          position: 'relative', width: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
          minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden',
        }}>
          {/* Subtle texture overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 40px)',
            pointerEvents: 'none',
          }} />

          <div className="page-wrap" style={{
            position: 'relative', zIndex: 2,
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 80, alignItems: 'center',
            width: '100%', padding: '80px 60px',
          }}>
            {/* Left — copy */}
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                New Collection — 2025
              </div>
              <h1 style={{
                fontFamily: 'var(--f-display)', fontWeight: 500,
                fontSize: 'clamp(52px, 7vw, 100px)', lineHeight: 0.96,
                letterSpacing: '-0.02em', color: '#ffffff',
                marginBottom: 32,
              }}>
                Dress like<br />
                <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>the woman</em><br />
                you{"'"}re<br />becoming.
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)', maxWidth: 360, marginBottom: 40 }}>
                Modest wear crafted for the modern woman — timeless silhouettes, premium fabrics, delivered to your door.
              </p>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <button onClick={() => setCategory('all')} className="btn-primary" style={{ background: '#fff', color: '#000', height: 52, padding: '0 32px', fontSize: 14 }}>
                  Shop the collection <ArrowRight size={16} />
                </button>
                <button onClick={() => setCategory('new')} style={{
                  height: 52, padding: '0 28px', borderRadius: 999,
                  background: 'transparent', color: 'rgba(255,255,255,0.7)',
                  border: '0.5px solid rgba(255,255,255,0.25)',
                  fontFamily: 'var(--f-body)', fontSize: 14, cursor: 'pointer',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
                >
                  New Arrivals
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 28, marginTop: 48 }}>
                {[
                  { label: 'Cash on delivery', sub: 'No card needed' },
                  { label: 'Free returns', sub: 'Inspect at the door' },
                  { label: '2–4 day delivery', sub: 'North Macedonia' },
                ].map(b => (
                  <div key={b.label}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — featured product showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {products.slice(0, 6).map((p, i) => (
                <a key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    aspectRatio: '2/3',
                    borderRadius: 12, overflow: 'hidden',
                    background: '#222',
                    position: 'relative',
                    transform: i % 2 === 1 ? 'translateY(16px)' : 'none',
                  }}>
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }} sizes="180px" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'flex-end', padding: 10 }}>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.name}</span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Announcement marquee */}
        <div style={{ borderBottom: '0.5px solid var(--c-line)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '12px 0' }}>
          <div className="marquee-track" style={{ gap: 48 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                Free delivery over €100
                <span style={{ width: 3, height: 3, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
                Cash on delivery
                <span style={{ width: 3, height: 3, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
                New arrivals weekly
                <span style={{ width: 3, height: 3, borderRadius: 999, background: 'currentColor', display: 'inline-block' }} />
              </span>
            ))}
          </div>
        </div>

        {/* New arrivals teaser row */}
        {newProducts.length > 0 && (
          <section style={{ padding: '72px 0 0' }}>
            <div className="page-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
                <div>
                  <div className="section-eyebrow">Just dropped</div>
                  <div className="section-title">New Arrivals</div>
                </div>
                <button onClick={() => setCategory('new')} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--c-ink)',
                  background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4,
                }}>
                  View all new in <ArrowRight size={14} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {newProducts.slice(0, 4).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category feature tiles */}
        <section style={{ padding: '80px 0 0' }}>
          <div className="page-wrap">
            <div style={{ marginBottom: 36 }}>
              <div className="section-eyebrow">Shop by category</div>
              <div className="section-title">What are you looking for?</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { id: 'dresses', label: 'Dresses', desc: 'Floor-length to midi' },
                { id: 'tops', label: 'Tops', desc: 'Modest blouses & tunics' },
                { id: 'scarves', label: 'Scarves', desc: 'Hijabs & wraps' },
                { id: 'outer', label: 'Outerwear', desc: 'Abayas & coats' },
                { id: 'sets', label: 'Sets', desc: 'Co-ordinated pieces' },
                { id: 'new', label: 'New In', desc: 'Latest additions' },
              ].map((cat, idx) => {
                const catProducts = cat.id === 'new'
                  ? products.filter(p => Date.now() - new Date(p.created_at).getTime() < 30 * 24 * 60 * 60 * 1000)
                  : products.filter(p => p.category.toLowerCase() === cat.id)
                const thumb = catProducts[0]?.images[0]
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      position: 'relative', height: idx < 3 ? 260 : 200,
                      borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                      border: 'none', padding: 0,
                      background: '#f0ede8',
                    }}
                  >
                    {thumb && <Image src={thumb} alt={cat.label} fill style={{ objectFit: 'cover' }} sizes="400px" />}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                    }} />
                    <div style={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left' }}>
                      <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, color: '#fff', lineHeight: 1.1 }}>{cat.label}</div>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.65)', marginTop: 4, textTransform: 'uppercase' }}>{cat.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Desktop filter bar */}
        <div style={{
          position: 'sticky', top: 'calc(var(--desk-nav-h) + var(--desk-bar-h))',
          zIndex: 20, background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid var(--c-line)',
          marginTop: 72,
        }}>
          <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 60px', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto' }} className="no-scrollbar">
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', flexShrink: 0, marginRight: 4 }}>
                Filter
              </span>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)} style={{
                  padding: '6px 16px', borderRadius: 999,
                  background: category === c.id ? 'var(--c-ink)' : 'transparent',
                  color: category === c.id ? '#fff' : 'var(--c-ink)',
                  border: `0.5px solid ${category === c.id ? 'var(--c-ink)' : 'var(--c-line)'}`,
                  fontFamily: 'var(--f-body)', fontSize: 12.5,
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.15s',
                }}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button onClick={() => setFiltersOpen(true)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 999,
                border: '0.5px solid var(--c-line)',
                background: filterCount > 0 ? 'var(--c-ink)' : 'transparent',
                color: filterCount > 0 ? '#fff' : 'var(--c-ink)',
                fontFamily: 'var(--f-body)', fontSize: 12.5, cursor: 'pointer',
              }}>
                <SlidersHorizontal size={13} strokeWidth={1.6} />
                {filterCount > 0 ? `Filters (${filterCount})` : 'More filters'}
              </button>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--c-ink-mute)', letterSpacing: '0.04em' }}>
                {filtered.length} pieces
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE category strip ───────────────────────── */}
      <div className="mobile-only no-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px 14px', overflowX: 'auto' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '7px 14px', borderRadius: 999,
            background: category === c.id ? 'var(--c-ink)' : 'var(--c-tag-bg)',
            color: category === c.id ? '#fff' : 'var(--c-ink)',
            border: '0.5px solid transparent',
            fontSize: 12, fontFamily: 'var(--f-body)',
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID (shared) ────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ padding: '80px 32px', textAlign: 'center', color: 'var(--c-ink-mute)' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>No matches</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontWeight: 500, color: 'var(--c-ink)', margin: '12px 0 8px' }}>Nothing here yet.</div>
          <p style={{ fontSize: 13, marginBottom: 20 }}>Try fewer filters or a different category.</p>
          <button onClick={() => { setCategory('all'); setFilters({}) }} style={{
            padding: '10px 24px', borderRadius: 999,
            border: '0.5px solid var(--c-line)', color: 'var(--c-ink)',
            fontSize: 13, background: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--f-body)',
          }}>Clear all filters</button>
        </div>
      ) : (
        <>
          {/* Desktop: section heading */}
          {isDesktop && (
            <div className="page-wrap desktop-only" style={{ paddingTop: 56, paddingBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div className="section-eyebrow">{category === 'all' ? 'Full collection' : CATEGORIES.find(c => c.id === category)?.label}</div>
                  <div className="section-title">{filtered.length} Pieces</div>
                </div>
              </div>
            </div>
          )}
          <div className="page-wrap" style={{ paddingTop: isDesktop ? 0 : 0, paddingBottom: isDesktop ? 80 : 120 }}>
            <div className="product-grid" style={isDesktop ? {} : { padding: '0 0px' }}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </>
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

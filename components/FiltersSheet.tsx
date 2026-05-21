'use client'

import { X, Check } from 'lucide-react'

const FILTER_GROUPS = [
  { id: 'size',  label: 'Size',     options: ['XS','S','M','L','XL'],                    single: false },
  { id: 'price', label: 'Price',    options: ['Under €60','€60 — €120','€120 — €200','€200+'], single: true },
  { id: 'sort',  label: 'Sort by',  options: ['New arrivals','Price · low to high','Price · high to low'], single: true },
]

export type Filters = {
  size?: string[]
  price?: string[]
  sort?: string[]
}

interface Props {
  open: boolean
  filters: Filters
  onChange: (groupId: string, value: string, single: boolean) => void
  onClose: () => void
  onClear: () => void
}

export default function FiltersSheet({ open, filters, onChange, onClose, onClear }: Props) {
  return (
    <>
      <div className={`sheet-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`bottom-sheet ${open ? 'open' : ''}`}>
        {/* Grabber */}
        <div style={{ width: 38, height: 4, borderRadius: 4, background: 'rgba(0,0,0,0.22)', margin: '8px auto 0', flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px 0' }}>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 500 }}>Filters</div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--c-ink)',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="no-scrollbar" style={{ overflowY: 'auto', padding: '8px 22px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FILTER_GROUPS.map(g => (
            <div key={g.id}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-ink-mute)', marginBottom: 10 }}>
                {g.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {g.options.map(o => {
                  const active = (filters[g.id as keyof Filters] || []).includes(o)
                  return (
                    <button key={o} onClick={() => onChange(g.id, o, g.single)} style={{
                      padding: '7px 12px', borderRadius: 999,
                      fontSize: 12, letterSpacing: '0.01em',
                      fontFamily: 'var(--f-body)',
                      background: active ? 'var(--c-ink)' : 'transparent',
                      color: active ? 'var(--c-card)' : 'var(--c-ink)',
                      border: '0.5px solid var(--c-line)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      {active && <Check size={11} strokeWidth={2.5} />}
                      {o}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 18px 28px', display: 'flex', gap: 10,
          borderTop: '0.5px solid var(--c-line)',
          background: 'var(--c-bg-soft)',
          flexShrink: 0,
        }}>
          <button onClick={onClear} style={{
            flexShrink: 0, padding: '0 22px', height: 50, borderRadius: 999,
            border: '0.5px solid var(--c-line)', color: 'var(--c-ink)',
            fontSize: 13, background: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--f-body)',
          }}>Clear</button>
          <button onClick={onClose} style={{
            flex: 1, height: 50, borderRadius: 999,
            background: 'var(--c-ink)', color: 'var(--c-card)',
            fontSize: 14, fontWeight: 500, letterSpacing: '0.03em',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--f-body)',
          }}>View results</button>
        </div>
      </div>
    </>
  )
}

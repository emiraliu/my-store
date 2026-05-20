import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import DeleteProductButton from './DeleteProductButton'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter = 'all' } = await searchParams
  const supabase = await createAdminClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  const all = (data ?? []) as Product[]

  const counts = {
    all:    all.length,
    active: all.filter(p => p.active).length,
    hidden: all.filter(p => !p.active).length,
  }

  const filtered = filter === 'active' ? all.filter(p => p.active)
                 : filter === 'hidden' ? all.filter(p => !p.active)
                 : all

  const tabs: [string, string][] = [
    ['all',    `All · ${counts.all}`],
    ['active', `Active · ${counts.active}`],
    ['hidden', `Hidden · ${counts.hidden}`],
  ]

  return (
    <div style={{ fontFamily: F.body, color: '#2c2520' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '14px 28px',
        borderBottom: '0.5px solid rgba(44,37,32,0.10)',
        gap: 14,
        background: '#efe9df',
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b5e52' }}>
          Admin <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <strong style={{ color: '#2c2520', fontWeight: 500 }}>Products</strong>
        </div>
        <Link href="/admin/products/new" style={{
          marginLeft: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 999,
          background: '#2c2520', color: '#fbf7ef',
          fontSize: 12.5, textDecoration: 'none',
          fontFamily: F.body, fontWeight: 500,
        }}>
          + Add product
        </Link>
      </div>

      <div style={{ padding: '28px 28px 60px' }}>
        <h1 style={{
          fontFamily: F.display,
          fontSize: 38, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em',
          margin: '0 0 6px',
        }}>
          Products<em style={{ fontStyle: 'italic', color: '#b5704d' }}>.</em>
        </h1>
        <p style={{ fontFamily: F.display, fontStyle: 'italic', fontSize: 14, color: '#6b5e52', margin: '0 0 24px' }}>
          {counts.all} pieces in the catalog · {counts.hidden} hidden
        </p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {tabs.map(([id, label]) => (
            <Link key={id} href={`/admin/products?filter=${id}`} style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '6px 11px', borderRadius: 999,
              fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap',
              background: filter === id ? '#2c2520' : 'transparent',
              color: filter === id ? '#fbf7ef' : '#2c2520',
              border: filter === id ? '0.5px solid transparent' : '0.5px solid rgba(44,37,32,0.10)',
              fontFamily: F.body,
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fbf7ef', border: '0.5px solid rgba(44,37,32,0.10)', borderRadius: 14, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <p style={{ padding: '24px 20px', color: '#6b5e52', fontSize: 13 }}>No products found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Added', ''].map((h, i) => (
                    <th key={i} style={{
                      textAlign: 'left',
                      fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#6b5e52', fontWeight: 500,
                      padding: '12px 16px', borderBottom: '0.5px solid rgba(44,37,32,0.10)',
                      background: '#f6f1e6',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  const date = new Date(product.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                  return (
                    <tr key={product.id} style={{ borderBottom: '0.5px solid rgba(44,37,32,0.10)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{product.name}</div>
                        <div style={{ fontFamily: F.mono, fontSize: 10, color: '#6b5e52', marginTop: 2 }}>
                          {product.id.slice(0, 8).toUpperCase()}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b5e52', textTransform: 'capitalize' }}>
                        {product.category}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 11.5 }}>
                        €{product.price.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '3px 9px', borderRadius: 999,
                          fontFamily: F.mono, fontSize: 9.5,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          ...(product.stock === 0
                            ? { color: '#9b4d4d', background: 'rgba(155,77,77,0.12)' }
                            : product.stock < 5
                            ? { color: '#b58a4d', background: 'rgba(181,138,77,0.12)' }
                            : { color: '#6b5e52', background: 'rgba(44,37,32,0.05)' }),
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />
                          {product.stock} {product.stock === 0 ? 'OUT' : product.stock < 5 ? 'LOW' : 'IN STOCK'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '3px 9px', borderRadius: 999,
                          fontFamily: F.mono, fontSize: 9.5,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          ...(product.active
                            ? { color: '#4d6b4d', background: 'rgba(77,107,77,0.10)' }
                            : { color: '#9b4d4d', background: 'rgba(155,77,77,0.12)' }),
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />
                          {product.active ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: F.mono, fontSize: 10, color: '#6b5e52' }}>
                        {date}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                          <Link href={`/admin/products/${product.id}/edit`} style={{
                            color: '#6b5e52', fontSize: 12, textDecoration: 'none',
                            fontFamily: F.mono, letterSpacing: '0.04em',
                          }}>
                            Edit
                          </Link>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

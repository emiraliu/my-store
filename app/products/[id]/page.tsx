import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import { getToneColor } from '@/lib/tones'
import AddToCartButton from './AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).eq('active', true).single()
  if (!data) notFound()
  const product = data as Product
  const toneColor = getToneColor(product.category, product.id)
  const firstWord = product.name.split(' ')[0]

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100dvh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '0 0 24px 24px' }}>
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
            priority
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            backgroundColor: toneColor,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(44,37,32,0.025) 0 1px, transparent 1px 14px)',
          }}>
            <span style={{
              position: 'absolute', left: 12, bottom: 12,
              fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(44,37,32,0.65)',
              background: 'rgba(251,247,239,0.7)',
              padding: '2px 5px', borderRadius: 3,
            }}>
              PHOTO · {firstWord}
            </span>
          </div>
        )}

        {/* Pagination dots */}
        <div style={{
          position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 5,
        }}>
          {[0,1,2,3].map(i => (
            <span key={i} style={{
              width: i === 0 ? 18 : 5, height: 5, borderRadius: 999,
              background: i === 0 ? 'var(--c-ink)' : 'rgba(44,37,32,0.3)',
            }} />
          ))}
        </div>
      </div>

      {/* AddToCartButton handles: back btn, heart btn, body content, floating bar */}
      <AddToCartButton product={product} />
    </div>
  )
}

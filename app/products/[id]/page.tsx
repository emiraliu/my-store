import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import { getToneColor } from '@/lib/tones'
import AddToCartButton from './AddToCartButton'
import ImageGallery from './ImageGallery'

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
      <ImageGallery
        images={product.images}
        alt={product.name}
        toneColor={toneColor}
        firstWord={firstWord}
      />
      {/* AddToCartButton handles: back btn, heart btn, body content, floating bar */}
      <AddToCartButton product={product} />
    </div>
  )
}

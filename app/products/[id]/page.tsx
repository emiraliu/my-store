import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import { getToneColor } from '@/lib/tones'
import AddToCartButton from './AddToCartButton'
import ImageGallery from './ImageGallery'
import DesktopProductLayout from './DesktopProductLayout'
import Footer from '@/components/Footer'

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
      {/* Mobile layout */}
      <div className="mobile-only">
        <ImageGallery images={product.images} alt={product.name} toneColor={toneColor} firstWord={firstWord} />
        <AddToCartButton product={product} />
      </div>

      {/* Desktop layout */}
      <div className="desktop-only">
        <DesktopProductLayout product={product} toneColor={toneColor} firstWord={firstWord} />
      </div>

      {/* Footer on desktop only (not inside product page on mobile) */}
      <div className="desktop-only">
        <Footer />
      </div>
    </div>
  )
}

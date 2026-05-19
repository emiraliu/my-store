import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import AddToCartButton from './AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.from('products').select('*').eq('id', id).eq('active', true).single()
  if (!data) notFound()
  const product = data as Product

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          {product.images.length > 0 ? (
            product.images.map((img, i) => (
              <div key={i} className="aspect-[4/5] relative overflow-hidden rounded-xl bg-zinc-100">
                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="50vw" />
              </div>
            ))
          ) : (
            <div className="aspect-[4/5] bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:sticky md:top-24 self-start">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-2xl font-semibold mb-6">${product.price.toFixed(2)}</p>

          {product.description && (
            <p className="text-zinc-600 leading-relaxed mb-8">{product.description}</p>
          )}

          {product.stock === 0 ? (
            <div className="w-full py-4 text-center bg-zinc-100 text-zinc-500 rounded-xl font-medium">
              Out of Stock
            </div>
          ) : (
            <AddToCartButton product={product} />
          )}

          <p className="text-sm text-zinc-400 mt-4 text-center">
            Pay on delivery — no upfront payment required.
          </p>
        </div>
      </div>
    </div>
  )
}

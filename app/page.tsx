import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

const CATEGORIES = ['All', 'Clothing', 'Shoes', 'Accessories']

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.ilike('category', category)
  }

  const { data: products } = await query
  const items = (products ?? []) as Product[]

  return (
    <>
      {/* Hero */}
      <section className="bg-zinc-950 text-white py-24 px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 mb-4">New Collection</p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Wear Your Story
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          Premium clothing, shoes, and accessories. Delivered to your door — pay on delivery.
        </p>
        <Link
          href="/?category=clothing"
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-100 transition-colors"
        >
          Shop Now
        </Link>
      </section>

      {/* Category filter */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => {
            const value = cat.toLowerCase()
            const active = (!category && cat === 'All') || category === value
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/' : `/?category=${value}`}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {items.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-lg">No products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

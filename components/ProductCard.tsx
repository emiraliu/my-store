import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? '/placeholder.jpg'

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 rounded-xl mb-3">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Sold Out</span>
          </div>
        )}
      </div>
      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{product.category}</p>
      <h3 className="font-medium text-zinc-900 group-hover:text-black transition-colors leading-snug">
        {product.name}
      </h3>
      <p className="text-zinc-700 font-semibold mt-1">${product.price.toFixed(2)}</p>
    </Link>
  )
}

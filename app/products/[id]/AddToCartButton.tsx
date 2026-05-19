'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import type { Product } from '@/lib/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  function handleAdd() {
    if (product.sizes.length > 0 && !selectedSize) return
    addItem({
      product_id: product.id,
      name: product.name,
      image: product.images[0] ?? '',
      size: selectedSize,
      quantity: 1,
      price: product.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Size</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'border-zinc-200 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={product.sizes.length > 0 && !selectedSize}
        className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {added ? 'Added to cart!' : product.sizes.length > 0 && !selectedSize ? 'Select a size' : 'Add to cart'}
      </button>
    </div>
  )
}

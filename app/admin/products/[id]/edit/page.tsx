import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import ProductForm from '../../ProductForm'
import type { Product } from '@/lib/types'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Edit product</h1>
      <ProductForm product={data as Product} />
    </div>
  )
}

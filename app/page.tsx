import { createClient } from '@/lib/supabase/server'
import HomeScreen from '@/components/HomeScreen'
import type { Product } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  const products = (data ?? []) as Product[]

  return <HomeScreen products={products} />
}

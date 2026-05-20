'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
}

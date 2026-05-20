'use server'

import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/server'

export async function updateOrderStatus(orderId: string, status: string) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin-session')?.value !== 'admin-authed') {
    throw new Error('Unauthorized')
  }
  const supabase = await createAdminClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw new Error(error.message)
}

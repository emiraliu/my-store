import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (req.cookies.get('admin-session')?.value !== 'admin-authed') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('orders').update(body).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

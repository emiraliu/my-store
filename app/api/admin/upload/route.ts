import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin-session')?.value !== 'admin-authed') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = await createAdminClient()
  const { error } = await supabase.storage
    .from('product-media')
    .upload(filename, file, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(filename)
  return NextResponse.json({ url: publicUrl })
}

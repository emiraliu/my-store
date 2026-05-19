import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes: cookie-based auth only, never touch Supabase
  if (pathname.startsWith('/admin')) {
    if (!pathname.startsWith('/admin/login')) {
      const session = request.cookies.get('admin-session')?.value
      if (session !== 'admin-authed') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
    return NextResponse.next()
  }

  // User-facing protected routes: refresh Supabase session
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && (pathname.startsWith('/profile') || pathname.startsWith('/checkout'))) {
    return NextResponse.redirect(new URL('/register', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*', '/admin', '/admin/:path*'],
}

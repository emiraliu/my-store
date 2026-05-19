'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, User, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from './CartProvider'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface NavbarProps {
  user: SupabaseUser | null
  profile: { full_name: string | null; is_admin: boolean } | null
}

export default function Navbar({ user, profile }: NavbarProps) {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          MY STORE
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href="/" className="hover:text-black transition-colors">Shop</Link>
          <Link href="/?category=clothing" className="hover:text-black transition-colors">Clothing</Link>
          <Link href="/?category=shoes" className="hover:text-black transition-colors">Shoes</Link>
          <Link href="/?category=accessories" className="hover:text-black transition-colors">Accessories</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-1">
            <ShoppingBag size={22} className="text-zinc-700 hover:text-black transition-colors" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/profile" className="p-1 text-zinc-700 hover:text-black transition-colors">
                <User size={22} />
              </Link>
              {profile?.is_admin && (
                <Link href="/admin" className="p-1 text-zinc-700 hover:text-black transition-colors">
                  <LayoutDashboard size={22} />
                </Link>
              )}
              <button
                onClick={signOut}
                className="p-1 text-zinc-700 hover:text-black transition-colors"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link
              href="/register"
              className="hidden md:block text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              Sign in
            </Link>
          )}

          <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/?category=clothing" onClick={() => setMenuOpen(false)}>Clothing</Link>
          <Link href="/?category=shoes" onClick={() => setMenuOpen(false)}>Shoes</Link>
          <Link href="/?category=accessories" onClick={() => setMenuOpen(false)}>Accessories</Link>
          {user ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>My Orders</Link>
              {profile?.is_admin && <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={() => { setMenuOpen(false); signOut() }} className="text-left text-red-600">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/register" onClick={() => setMenuOpen(false)} className="text-black font-semibold">
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function AdminSidebar() {
  const pathname = usePathname()
  if (pathname === '/admin/login') return null

  return (
    <aside className="w-56 bg-zinc-950 text-white flex-shrink-0 flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Admin</p>
        <p className="font-bold">MY STORE</p>
      </div>
      <nav className="p-4 space-y-1 flex-1">
        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
          <Package size={16} />
          Products
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
          <ShoppingCart size={16} />
          Orders
        </Link>
      </nav>
      <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Store
        </Link>
        <LogoutButton />
      </div>
    </aside>
  )
}

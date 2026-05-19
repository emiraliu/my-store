import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import CartProvider from '@/components/CartProvider'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'My Store',
  description: 'Fashion & Clothing',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, is_admin')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 antialiased">
        <CartProvider>
          <Navbar user={user} profile={profile} />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-400">
            © {new Date().getFullYear()} My Store. All rights reserved.
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import CartProvider from '@/components/CartProvider'
import WishlistProvider from '@/components/WishlistProvider'
import BottomNav from '@/components/BottomNav'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'sade.',
  description: 'Modest essentials, slowly made — from our atelier to your door.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="min-h-dvh">
        <CartProvider>
          <WishlistProvider>
            <main className="pb-28">{children}</main>
            <BottomNav />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}

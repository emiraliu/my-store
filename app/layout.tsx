import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import CartProvider from '@/components/CartProvider'
import WishlistProvider from '@/components/WishlistProvider'
import BottomNav from '@/components/BottomNav'
import DesktopNav from '@/components/DesktopNav'
import Footer from '@/components/Footer'

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
  title: 'Hidaya Wear — Modest Fashion',
  description: 'Premium modest wear, made to last — delivered to your door with cash on delivery.',
  keywords: ['modest wear', 'hijab fashion', 'islamic clothing', 'abaya', 'modest dresses'],
  openGraph: {
    title: 'Hidaya Wear',
    description: 'Premium modest wear, delivered to your door.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <CartProvider>
          <WishlistProvider>
            {/* Desktop nav — hidden on mobile via CSS */}
            <DesktopNav />

            <main style={{ paddingBottom: 0 }}>
              {children}
            </main>

            <Footer />

            {/* Mobile bottom nav */}
            <BottomNav />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}

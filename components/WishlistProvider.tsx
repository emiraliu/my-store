'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface WishlistContextType {
  wishlist: string[]
  toggleWish: (id: string) => void
  isWished: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('sade-wishlist')
    if (stored) setWishlist(JSON.parse(stored))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('sade-wishlist', JSON.stringify(wishlist))
  }, [wishlist, mounted])

  const toggleWish = useCallback((id: string) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])
  }, [])

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist])

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWish, isWished }}>
      {children}
    </WishlistContext.Provider>
  )
}

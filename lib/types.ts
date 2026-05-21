export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  images: string[]
  sizes: Record<string, number>
  stock: number
  active: boolean
  created_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  image: string
  size: string
  quantity: number
  price: number
}

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  phone: string
  address: string
  created_at: string
  profiles?: { full_name: string | null; phone: string | null }
}

export interface Profile {
  id: string
  phone: string | null
  full_name: string | null
  address: string | null
  is_admin: boolean
  created_at: string
}

export interface CartItem {
  product_id: string
  name: string
  image: string
  size: string
  color?: string
  quantity: number
  price: number
}

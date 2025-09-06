// Auth Types
export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
  token_type: string
  email_verified?: boolean
  error_type?: string
  redirect?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

// Product Types
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  short_description?: string
  price: number
  sale_price?: number
  sku?: string
  stock_quantity: number
  category_id: number
  images?: string[]
  featured_image?: string
  weight?: string
  dimensions?: string
  is_active: boolean
  manage_stock?: boolean
  created_at: string
  updated_at: string
  category?: Category
}

// Category Types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parent_id?: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  children?: Category[]
  products?: Product[]
}

// Cart Types
export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
  updated_at: string
  product: Product
}

export interface Cart {
  cart_items: CartItem[]
  total: number
  count: number
}

// Order Types
export interface Order {
  id: number
  user_id: number
  status: string
  total: number
  shipping_address: any
  billing_address: any
  payment_method: string
  payment_status: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product: Product
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}


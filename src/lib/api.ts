const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit',
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: `HTTP ${response.status}` }
      }
      throw new Error(errorData.message || `API Error: ${response.status}`)
    }

    try {
      const text = await response.text()
      // Clean up malformed JSON with backticks
      const cleanText = text.replace(/^`+|`+$/g, '')
      return JSON.parse(cleanText)
    } catch (error) {
      console.error('JSON parsing error:', error)
      throw new Error('Invalid JSON response from server')
    }
  }

  // Auth
  async register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    return this.request<any>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: { email: string; password: string }) {
    return this.request<any>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async logout() {
    return this.request<any>('/logout', { method: 'POST' })
  }

  async getUser() {
    return this.request<any>('/user')
  }

  async verifyEmail(id: string, hash: string, signature: string, expires: string) {
    return this.request<any>(`/email/verify/${id}/${hash}?signature=${signature}&expires=${expires}`)
  }

  async resendVerification() {
    return this.request<any>('/email/resend', { method: 'POST' })
  }

  // Products
  async getProducts(params?: {
    search?: string
    category?: string
    color?: string
    size?: string
    min_price?: number
    max_price?: number
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    per_page?: number
    page?: number
  }) {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const query = searchParams.toString()
    const response = await this.request<any>(`/products${query ? `?${query}` : ''}`)
    return response // Return the full paginated response
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`)
  }

  // Categories
  async getCategories() {
    return this.request<any>('/categories')
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`)
  }

  async getCategoryBySlug(slug: string) {
    return this.request<any>(`/categories/slug/${slug}`)
  }

  async getProductByHandle(handle: string) {
    try {
      const response = await this.request<any>(`/products/handle/${handle}`)
      return response
    } catch (error) {
      console.error(`Failed to fetch product by handle '${handle}':`, error)
      throw error
    }
  }

  // Cart
  async getCart() {
    return this.request<any>('/cart')
  }

  async addToCart(data: { product_id: number; quantity: number }) {
    return this.request<any>('/cart', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCartItem(id: number, data: { quantity: number }) {
    return this.request<any>(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async removeFromCart(id: number) {
    return this.request<any>(`/cart/${id}`, { method: 'DELETE' })
  }

  async clearCart() {
    return this.request<any>('/cart', { method: 'DELETE' })
  }

  // Orders
  async getOrders() {
    return this.request<any>('/orders')
  }

  async createOrder(data: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Auth helpers
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}
'use client'

import { apiClient } from '@/lib/api'
import { Cart, CartItem } from '@/lib/types'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addToCart: (productId: number, quantity: number) => Promise<void>
  updateCartItem: (id: number, quantity: number) => Promise<void>
  removeFromCart: (id: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.getCart()
      setCart(response)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [isAuthenticated, refreshCart])

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true)
      await apiClient.addToCart({ product_id: productId, quantity })
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (id: number, quantity: number) => {
    try {
      setLoading(true)
      await apiClient.updateCartItem(id, { quantity })
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (id: number) => {
    try {
      setLoading(true)
      await apiClient.removeFromCart(id)
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      await apiClient.clearCart()
      setCart({ cart_items: [], total: 0, count: 0 })
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
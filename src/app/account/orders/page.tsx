'use client'

import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/utils/price'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Order {
  id: number
  total: number
  status: string
  created_at: string
  shipping_address: any
  order_items: Array<{
    id: number
    quantity: number
    price: number
    product: {
      id: number
      name: string
      featured_image: string
      images: string[]
    }
  }>
}

const OrdersPage = () => {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    fetchOrders()
  }, [isAuthenticated, router])

  const fetchOrders = async () => {
    try {
      const response = await apiClient.getOrders()
      setOrders(response || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="container py-16 lg:pb-28 lg:pt-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 lg:pb-28 lg:pt-20">
      <div className="mb-16">
        <h1 className="text-3xl font-semibold">My Orders</h1>
        <div className="flex items-center mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/account" className="hover:text-neutral-800 dark:hover:text-neutral-200">
            Account
          </Link>
          <span className="mx-2">→</span>
          <span>Orders</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-neutral-500 mb-6">You haven&apos;t placed any orders yet. Start shopping to see your orders here.</p>
          <Link 
            href="/collections/all" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                  <p className="text-sm text-neutral-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{formatCurrency(order.total)}</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' 
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
                      : order.status === 'processing'
                      ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {order.order_items.map((item) => {
                  const imageUrl = item.product.featured_image || item.product.images?.[0] || '/images/placeholder-small.png'
                  return (
                    <div key={item.id} className="flex items-center space-x-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">
                        <Image
                          src={imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(parseFloat(String(item.price || '0')) * item.quantity)}</div>
                        <div className="text-sm text-neutral-500">{formatCurrency(item.price)} each</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {order.shipping_address && (
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postcode}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
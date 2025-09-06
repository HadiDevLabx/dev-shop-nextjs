'use client'

import { Link } from '@/components/Link'
import Prices from '@/components/Prices'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/utils/price'
import { Button } from '@/shared/Button/Button'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

// Safe date formatter to avoid hydration mismatches
const formatOrderDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    // Use a consistent format that works across server/client
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

const Order = ({ order }: { order: any }) => {
  const router = useRouter()
  
  const handleViewOrder = () => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Navigate to the order page after a brief delay to see the scroll
    setTimeout(() => {
      router.push('/orders/' + order.id)
    }, 300)
  }

  return (
    <div className="z-0 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:bg-neutral-500/5">
        <div>
          <Link href={'/orders/' + order.id} className="text-lg font-semibold">
            #{order.order_number}
          </Link>
          <p className="mt-1.5 text-sm text-neutral-500 sm:mt-2 dark:text-neutral-400">
            <span className={clsx(
              'px-2 py-1 text-xs font-medium rounded-full',
              order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            )}>
              {order.status}
            </span>
            <span className="ml-2 text-xs text-neutral-400">
              {formatOrderDate(order.created_at)}
            </span>
          </p>
        </div>
        <div className="mt-3 flex gap-x-1.5 sm:mt-0">
          <Button color="light" size="smaller" onClick={handleViewOrder}>
            View order
          </Button>
        </div>
      </div>
      <div className="divide-y-neutral-200 divide-y border-t border-neutral-200 p-2 sm:p-8 dark:divide-neutral-700 dark:border-neutral-700">
        {order?.order_items?.map((item: any) => {
          console.log('Order item data:', item) // Debug log
          
          // Enhanced image logic to match the working individual order page
          const imageUrl = item.product?.featured_image || 
                          item.product?.images?.[0] || 
                          item.product_snapshot?.image ||
                          item.image || // Direct image field
                          item.product?.image || // Alternative product image field
                          null
          
          // Log image URL for debugging
          console.log('Image URL for item:', item.id, imageUrl)
          
          return (
          <div key={item.id} className="flex py-4 first:pt-0 last:pb-0 sm:py-7">
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:w-20">
              {imageUrl ? (
                <Image
                  fill
                  sizes="(min-width: 640px) 5rem, 4rem"
                  src={imageUrl}
                  alt={item.product?.name || item.product_snapshot?.name || item.name || 'Product'}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    console.log('Image load error for:', imageUrl)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-neutral-400">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between">
                  <div>
                    <h3 className="line-clamp-1 text-base font-medium">
                      {item.product_snapshot?.name || item.product?.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      SKU: {item.product_snapshot?.sku || 'N/A'}
                    </p>
                  </div>
                  <Prices className="mt-0.5 ml-2" price={item.price || 0} />
                </div>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <p className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <span className="hidden sm:inline-block">Qty</span>
                  <span className="inline-block sm:hidden">x</span>
                  <span className="ml-2">{item.quantity}</span>
                </p>
                <div className="flex">
                  <span className="text-sm font-medium">
                    Total: {formatCurrency(parseFloat(String(item.price || '0')) * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>
      <div className="bg-neutral-50 px-4 py-3 sm:px-8 dark:bg-neutral-500/5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Order Total:
          </span>
          <span className="text-lg font-semibold">
            {formatCurrency(parseFloat(String(order.total || '0')))} {order.currency || 'USD'}
          </span>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getOrders()
        
        // Enhance orders with product details for images if missing
        const enhancedOrders = await Promise.all(
          response.map(async (order: any) => {
            if (order?.order_items?.length > 0) {
              const enhancedOrderItems = await Promise.all(
                order.order_items.map(async (item: any) => {
                  // If the item doesn't have product image data, try to fetch it
                  if (!item.product?.featured_image && !item.product?.images && !item.product_snapshot?.image && item.product_id) {
                    try {
                      console.log('Fetching product details for product_id:', item.product_id)
                      const productDetails = await apiClient.getProduct(item.product_id)
                      return {
                        ...item,
                        product: {
                          ...item.product,
                          ...productDetails,
                          featured_image: productDetails?.featured_image || productDetails?.images?.[0],
                          images: productDetails?.images || []
                        }
                      }
                    } catch (productErr) {
                      console.warn('Failed to fetch product details for:', item.product_id, productErr)
                      return item
                    }
                  }
                  return item
                })
              )
              
              return {
                ...order,
                order_items: enhancedOrderItems
              }
            }
            return order
          })
        )
        
        setOrders(enhancedOrders)
      } catch (err: any) {
        console.error('Error fetching orders:', err)
        setError(err.message || 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="text-lg text-red-600 mb-4">Error: {error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-10 sm:gap-y-12">
      {/* HEADING */}
      <div>
        <h1 className="text-2xl font-semibold">Order history</h1>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          Check the status of recent orders, manage returns, and discover similar products.
        </p>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            You haven't placed any orders yet.
          </p>
          <Button href="/collections/all" className="mt-4">
            Start Shopping
          </Button>
        </div>
      ) : (
        orders.map((order: any) => (
          <Order key={order.id} order={order} />
        ))
      )}
    </div>
  )
}

export default Page

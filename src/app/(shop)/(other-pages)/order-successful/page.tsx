'use client'

import { Divider } from '@/components/Divider'
import Heading from '@/components/Heading/Heading'
import Prices from '@/components/Prices'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { CalendarIcon, TruckIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'

function OrderSuccessfulContent() {
  const { isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get('order') || searchParams.get('order_id')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=order-successful')
      return
    }

    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided')
        setLoading(false)
        return
      }

      try {
        const response = await apiClient.getOrder(orderId)
        if (response.success && response.data) {
          setOrder(response.data)
        } else {
          setError('Order not found')
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [isAuthenticated, orderId, router])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <main className="container">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-3xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading order details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="container">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-3xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            {error || 'We couldn&apos;t find the order you&apos;re looking for.'}
          </p>
          <div className="space-x-4">
            <ButtonPrimary href="/account/orders">
              View All Orders
            </ButtonPrimary>
            <ButtonSecondary href="/collections/all">
              Continue Shopping
            </ButtonSecondary>
          </div>
        </div>
      </main>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-primary-600 bg-primary-50 border-primary-200'
      case 'processing':
      case 'shipped':
        return 'text-secondary-600 bg-secondary-50 border-secondary-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200'
    }
  }

  return (
    <main className="container">
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-primary-600" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary-600 mb-2">
            Order Confirmed
          </p>
          <Heading className="mb-4">Payment Successful!</Heading>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Thank you for your order! We&apos;re currently processing it and will send you confirmation details shortly.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order #{order.id}</h3>
              <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <HugeiconsIcon icon={CalendarIcon} size={16} className="mr-2" />
                <span>Placed on {formatDate(order.created_at)}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Tracking Information */}
          {order.tracking_number && (
            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <div className="flex items-center">
                <HugeiconsIcon icon={TruckIcon} size={20} className="text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">Tracking Number</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {order.tracking_number}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-6">
            <h4 className="font-medium">Order Items</h4>
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {order.order_items?.map((item: any, index: number) => (
                <li key={item.id || index} className="flex py-6 first:pt-0 last:pb-0">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      fill
                      src={item.product?.featured_image || item.product?.images?.[0] || '/images/placeholder-small.png'}
                      alt={item.product?.name || 'Product'}
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-sm font-medium">
                          {item.product?.name || 'Product Name'}
                        </h5>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                          Qty: {item.quantity}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {item.variant.color && `Color: ${item.variant.color}`}
                            {item.variant.size && ` • Size: ${item.variant.size}`}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <Prices price={item.price} className="text-sm" />
                        {item.quantity > 1 && (
                          <p className="text-xs text-neutral-500 mt-1">
                            ${item.price} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Divider className="my-6" />

          {/* Order Totals */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
              <span>${(order.total - (order.shipping_cost || 0) - (order.tax || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Shipping</span>
              <span>{order.shipping_cost ? `$${order.shipping_cost.toFixed(2)}` : 'Free'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Tax</span>
              <span>${(order.tax || 0).toFixed(2)}</span>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 mb-8">
            <h4 className="font-medium mb-4">Shipping Address</h4>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <p className="font-medium text-neutral-900 dark:text-neutral-200">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
              </p>
              <p>{order.shipping_address.address_1}</p>
              {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postcode}
              </p>
              <p>{order.shipping_address.country}</p>
              {order.shipping_address.phone && <p>{order.shipping_address.phone}</p>}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonPrimary href={`/account/orders/${order.id}`} className="sm:w-auto">
            View Order Details
          </ButtonPrimary>
          <ButtonSecondary href="/collections/all" className="sm:w-auto">
            Continue Shopping
          </ButtonSecondary>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>
            Need help with your order?{' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-500 underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function OrderSuccessfulPage() {
  return (
    <Suspense fallback={
      <main className="container">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-3xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <OrderSuccessfulContent />
    </Suspense>
  )
}

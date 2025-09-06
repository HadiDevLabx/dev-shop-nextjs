'use client'

import { Button } from '@/shared/Button/Button'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

const OrderSuccessContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    // Get order data from URL params or localStorage
    const orderId = searchParams.get('orderId')
    const orderNumber = searchParams.get('orderNumber')
    
    if (orderId) {
      setOrderData({
        id: orderId,
        order_number: orderNumber || `ORD-${orderId}`,
      })
    } else {
      // Redirect to orders if no order data
      router.push('/orders')
    }
  }, [searchParams, router])

  if (!orderData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-16 lg:pb-28 lg:pt-20">
      <div className="max-w-md mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          Order Placed Successfully!
        </h1>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        
        <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-8">
          Order Number: <span className="font-medium">{orderData.order_number}</span>
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            href={`/orders/${orderData.id}`}
            className="w-full"
          >
            View Order Details
          </Button>
          
          <Button 
            href="/orders"
            color="light"
            className="w-full"
          >
            View All Orders
          </Button>
          
          <Button 
            href="/home"
            color="light"
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">Loading order details...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}

export default OrderSuccessPage

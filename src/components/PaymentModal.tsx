'use client'

import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import StripeCheckoutForm from './StripeCheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: any
  onPaymentSuccess: (paymentResult: any) => void
}

const PaymentModal = ({ isOpen, onClose, orderData, onPaymentSuccess }: PaymentModalProps) => {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Order Summary</h3>
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>Total Amount:</span>
            <span className="font-medium">${orderData?.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        {/* Stripe Elements */}
        <Elements stripe={stripePromise}>
          <StripeCheckoutForm
            orderData={orderData}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  )
}

export default PaymentModal

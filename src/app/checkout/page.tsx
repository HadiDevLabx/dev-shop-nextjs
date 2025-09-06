'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/utils/price'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Field, FieldGroup, Fieldset, Label } from '@/shared/fieldset'
import { Input } from '@/shared/input'
import { Select } from '@/shared/select'
import { Textarea } from '@/shared/textarea'
import PaymentModal from '@/components/PaymentModal'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const { isAuthenticated, user } = useAuth()
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping Address
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_email: user?.email || '',
    shipping_phone: '',
    shipping_address_1: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postcode: '',
    shipping_country: 'US',
    
    // Billing Address
    billing_same_as_shipping: true,
    billing_first_name: '',
    billing_last_name: '',
    billing_email: '',
    billing_phone: '',
    billing_address_1: '',
    billing_address_2: '',
    billing_city: '',
    billing_state: '',
    billing_postcode: '',
    billing_country: 'US',
    
    // Payment & Other
    payment_method: 'stripe',
    notes: '',
  })

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store checkout intent in localStorage to redirect back after login
      localStorage.setItem('checkout_redirect', 'true')
      router.push('/login?redirect=checkout')
      return
    }
    
    // Check if cart has items
    if (!cart || cart.cart_items.length === 0) {
      toast.error('Your cart is empty')
      router.push('/cart')
      return
    }
  }, [isAuthenticated, user, cart, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!cart) {
        toast.error('Cart is empty')
        setLoading(false)
        return
      }

      // Create order data
      const preparedOrderData = {
        shipping_address: {
          first_name: formData.shipping_first_name,
          last_name: formData.shipping_last_name,
          email: formData.shipping_email,
          phone: formData.shipping_phone,
          address_1: formData.shipping_address_1,
          address_2: formData.shipping_address_2,
          city: formData.shipping_city,
          state: formData.shipping_state,
          postcode: formData.shipping_postcode,
          country: formData.shipping_country,
        },
        billing_address: formData.billing_same_as_shipping ? {
          first_name: formData.shipping_first_name,
          last_name: formData.shipping_last_name,
          email: formData.shipping_email,
          phone: formData.shipping_phone,
          address_1: formData.shipping_address_1,
          address_2: formData.shipping_address_2,
          city: formData.shipping_city,
          state: formData.shipping_state,
          postcode: formData.shipping_postcode,
          country: formData.shipping_country,
        } : {
          first_name: formData.billing_first_name,
          last_name: formData.billing_last_name,
          email: formData.billing_email,
          phone: formData.billing_phone,
          address_1: formData.billing_address_1,
          address_2: formData.billing_address_2,
          city: formData.billing_city,
          state: formData.billing_state,
          postcode: formData.billing_postcode,
          country: formData.billing_country,
        },
        payment_method: 'stripe',
        notes: formData.notes,
        total: cart.total,
        items: cart.cart_items?.map(item => ({
          product_id: item.product_id,
          name: item.product?.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product?.featured_image || item.product?.images?.[0]
        })) || []
      }

      // Set order data and show payment modal
      setOrderData(preparedOrderData)
      setShowPaymentModal(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to prepare order')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentResult: any) => {
    console.log('Payment success called with:', paymentResult) // Debug log
    
    if (redirecting) {
      console.log('Already redirecting, ignoring duplicate call')
      return
    }
    
    setRedirecting(true)
    
    try {
      // Show success message
      toast.success('Order placed successfully! Redirecting...')
      
      // Get the order ID from the payment result
      const orderId = paymentResult?.order?.id || paymentResult?.order?.order_number
      
      console.log('Order ID:', orderId) // Debug log
      
      // Close the payment modal first
      setShowPaymentModal(false)
      
      // Clear cart in background (don't wait for it)
      clearCart().catch(err => console.warn('Failed to clear cart:', err))
      
      // Small delay to ensure modal closes
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Immediate redirect
      if (orderId) {
        console.log('Redirecting to order page...') // Debug log
        window.location.href = `/orders/${orderId}`
      } else {
        console.log('No order ID, redirecting to orders list') // Debug log
        window.location.href = '/orders'
      }
    } catch (error) {
      console.error('Error in payment success handler:', error)
      toast.error('Payment successful but there was an issue. Please check your orders.')
      window.location.href = '/orders'
    }
  }

  if (!isAuthenticated || !cart || cart.cart_items.length === 0) {
    return null
  }

  return (
    <div className="container py-16 lg:pb-28 lg:pt-20">
      <div className="mb-16">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <div className="flex items-center mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/cart" className="hover:text-neutral-800 dark:hover:text-neutral-200">
            Cart
          </Link>
          <span className="mx-2">→</span>
          <span>Checkout</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left Column - Forms */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Address */}
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-6">Shipping Address</h3>
              
              <Fieldset>
                <FieldGroup>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <Label htmlFor="shipping_first_name">First Name</Label>
                      <Input
                        id="shipping_first_name"
                        name="shipping_first_name"
                        type="text"
                        value={formData.shipping_first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </Field>
                    
                    <Field>
                      <Label htmlFor="shipping_last_name">Last Name</Label>
                      <Input
                        id="shipping_last_name"
                        name="shipping_last_name"
                        type="text"
                        value={formData.shipping_last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </Field>
                  </div>

                  <Field>
                    <Label htmlFor="shipping_email">Email</Label>
                    <Input
                      id="shipping_email"
                      name="shipping_email"
                      type="email"
                      value={formData.shipping_email}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="shipping_phone">Phone</Label>
                    <Input
                      id="shipping_phone"
                      name="shipping_phone"
                      type="tel"
                      value={formData.shipping_phone}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="shipping_address_1">Address</Label>
                    <Input
                      id="shipping_address_1"
                      name="shipping_address_1"
                      type="text"
                      value={formData.shipping_address_1}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="shipping_address_2">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="shipping_address_2"
                      name="shipping_address_2"
                      type="text"
                      value={formData.shipping_address_2}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field>
                      <Label htmlFor="shipping_city">City</Label>
                      <Input
                        id="shipping_city"
                        name="shipping_city"
                        type="text"
                        value={formData.shipping_city}
                        onChange={handleInputChange}
                        required
                      />
                    </Field>

                    <Field>
                      <Label htmlFor="shipping_state">State</Label>
                      <Select
                        id="shipping_state"
                        name="shipping_state"
                        value={formData.shipping_state}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </Select>
                    </Field>

                    <Field>
                      <Label htmlFor="shipping_postcode">ZIP Code</Label>
                      <Input
                        id="shipping_postcode"
                        name="shipping_postcode"
                        type="text"
                        value={formData.shipping_postcode}
                        onChange={handleInputChange}
                        required
                      />
                    </Field>
                  </div>

                  <Field>
                    <Label htmlFor="shipping_country">Country</Label>
                    <Select
                      id="shipping_country"
                      name="shipping_country"
                      value={formData.shipping_country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                    </Select>
                  </Field>
                </FieldGroup>
              </Fieldset>
            </div>

            {/* Billing Address */}
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Billing Address</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="billing_same_as_shipping"
                    checked={formData.billing_same_as_shipping}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm">Same as shipping</span>
                </label>
              </div>

              {!formData.billing_same_as_shipping && (
                <Fieldset>
                  <FieldGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <Label htmlFor="billing_first_name">First Name</Label>
                        <Input
                          id="billing_first_name"
                          name="billing_first_name"
                          type="text"
                          value={formData.billing_first_name}
                          onChange={handleInputChange}
                          required={!formData.billing_same_as_shipping}
                        />
                      </Field>
                      
                      <Field>
                        <Label htmlFor="billing_last_name">Last Name</Label>
                        <Input
                          id="billing_last_name"
                          name="billing_last_name"
                          type="text"
                          value={formData.billing_last_name}
                          onChange={handleInputChange}
                          required={!formData.billing_same_as_shipping}
                        />
                      </Field>
                    </div>

                    <Field>
                      <Label htmlFor="billing_email">Email</Label>
                      <Input
                        id="billing_email"
                        name="billing_email"
                        type="email"
                        value={formData.billing_email}
                        onChange={handleInputChange}
                        required={!formData.billing_same_as_shipping}
                      />
                    </Field>

                    <Field>
                      <Label htmlFor="billing_phone">Phone</Label>
                      <Input
                        id="billing_phone"
                        name="billing_phone"
                        type="tel"
                        value={formData.billing_phone}
                        onChange={handleInputChange}
                        required={!formData.billing_same_as_shipping}
                      />
                    </Field>

                    <Field>
                      <Label htmlFor="billing_address_1">Address</Label>
                      <Input
                        id="billing_address_1"
                        name="billing_address_1"
                        type="text"
                        value={formData.billing_address_1}
                        onChange={handleInputChange}
                        required={!formData.billing_same_as_shipping}
                      />
                    </Field>

                    <Field>
                      <Label htmlFor="billing_address_2">Apartment, suite, etc. (optional)</Label>
                      <Input
                        id="billing_address_2"
                        name="billing_address_2"
                        type="text"
                        value={formData.billing_address_2}
                        onChange={handleInputChange}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field>
                        <Label htmlFor="billing_city">City</Label>
                        <Input
                          id="billing_city"
                          name="billing_city"
                          type="text"
                          value={formData.billing_city}
                          onChange={handleInputChange}
                          required={!formData.billing_same_as_shipping}
                        />
                      </Field>

                      <Field>
                        <Label htmlFor="billing_state">State</Label>
                        <Select
                          id="billing_state"
                          name="billing_state"
                          value={formData.billing_state}
                          onChange={handleInputChange}
                          required={!formData.billing_same_as_shipping}
                        >
                          <option value="">Select State</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                        </Select>
                      </Field>

                      <Field>
                        <Label htmlFor="billing_postcode">ZIP Code</Label>
                        <Input
                          id="billing_postcode"
                          name="billing_postcode"
                          type="text"
                          value={formData.billing_postcode}
                          onChange={handleInputChange}
                          required={!formData.billing_same_as_shipping}
                        />
                      </Field>
                    </div>

                    <Field>
                      <Label htmlFor="billing_country">Country</Label>
                      <Select
                        id="billing_country"
                        name="billing_country"
                        value={formData.billing_country}
                        onChange={handleInputChange}
                        required={!formData.billing_same_as_shipping}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                      </Select>
                    </Field>
                  </FieldGroup>
                </Fieldset>
              )}
            </div>

            {/* Order Notes */}
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-6">Order Notes (Optional)</h3>
              <Field>
                <Label htmlFor="notes">Special instructions for your order</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any special delivery instructions..."
                />
              </Field>
            </div>

            {/* Submit Button */}
            <ButtonPrimary
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Complete Order'}
            </ButtonPrimary>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
            
            <div className="space-y-4">
              {cart.cart_items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">
                    <Image
                      src={item.product.featured_image || item.product.images?.[0] || '/images/placeholder-small.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(parseFloat(String(item.price || '0')) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

                        <div className="border-t pt-4 mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-neutral-500">Secure payment via Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && !redirecting && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderData={orderData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      
      {/* Redirecting Modal */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing your order...</p>
            <p className="text-sm text-neutral-500 mt-2">Please wait while we redirect you</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage
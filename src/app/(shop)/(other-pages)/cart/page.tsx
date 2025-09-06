'use client'

import { useCart } from '@/contexts/CartContext'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import { formatCurrency } from '@/utils/price'
import { TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart } = useCart()

  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    return (
      <div className="container py-16 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>
          <div className="py-16">
            <p className="text-neutral-500 mb-8">Your cart is empty</p>
            <Link href="/collections/all">
              <ButtonPrimary>Continue Shopping</ButtonPrimary>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 lg:py-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>
        
        <div className="space-y-6">
          {cart.cart_items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.product.featured_image || '/images/placeholder-small.png'}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="font-semibold">{formatCurrency(item.price)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartItem(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 border-t border-neutral-200 pt-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold">Total: {formatCurrency(cart.total)}</span>
          </div>
          
          <div className="flex gap-4">
            <Link href="/collections/all" className="flex-1">
              <ButtonSecondary className="w-full">Continue Shopping</ButtonSecondary>
            </Link>
            <Link href="/checkout" className="flex-1">
              <ButtonPrimary className="w-full">Checkout</ButtonPrimary>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
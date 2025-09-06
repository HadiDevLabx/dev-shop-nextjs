'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/lib/types'
import { formatCurrency } from '@/utils/price'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { Link } from './Link'
import Prices from './Prices'
import { Aside } from './aside/aside'

interface Props {
  className?: string
}

const AsideSidebarCart = ({ className = '' }: Props) => {
  const { isAuthenticated } = useAuth()
  const { cart, loading } = useCart()

  return (
    <Aside openFrom="right" type="cart" heading="Shopping Cart">
      <div className={clsx('flex h-full flex-col', className)}>
        {/* CONTENT */}

        <div className="hidden-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-6">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                Please log in to view your cart
              </p>
              <Link href="/login" className="text-primary-600 underline">
                Sign in
              </Link>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : !cart || cart.cart_items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                Your cart is empty
              </p>
              <Link href="/" className="text-primary-600 underline">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-neutral-900/10 dark:divide-neutral-100/10">
                {cart.cart_items.map((item) => (
                  <CartProduct key={item.id} item={item} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* FOOTER  */}
        <section
          aria-labelledby="summary-heading"
          className="mt-auto grid shrink-0 gap-4 border-t border-neutral-900/10 py-6 dark:border-neutral-100/10"
        >
          <h2 id="summary-heading" className="sr-only">
            Order summary
          </h2>
          <div>
            {isAuthenticated && cart && cart.cart_items.length > 0 && (
              <>
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-neutral-100">
                  <p className="font-medium">Subtotal</p>
                  <p className="font-medium">{formatCurrency(cart.total)}</p>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <ButtonSecondary href={'/cart'}>View cart</ButtonSecondary>
                  <ButtonPrimary href={'/checkout'}>Check out</ButtonPrimary>
                </div>
              </>
            )}
            <div className="mt-6 flex justify-center text-center text-sm text-neutral-500 dark:text-neutral-400">
              <p className="text-xs">
                or{' '}
                <Link href={'/collections/all'} className="text-xs font-medium uppercase">
                  Continue Shopping<span aria-hidden="true"> →</span>
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </Aside>
  )
}

const CartProduct = ({ item }: { item: CartItem }) => {
  const { updateCartItem, removeFromCart } = useCart()
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      setUpdating(true)
      await updateCartItem(item.id, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleRemove = async () => {
    try {
      setRemoving(true)
      await removeFromCart(item.id)
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setRemoving(false)
    }
  }

  const imageUrl = item.product.featured_image || item.product.images?.[0] || '/images/placeholder-small.png'

  return (
    <div className="flex py-5 last:pb-0">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <Image fill src={imageUrl} alt={item.product.name} className="object-contain" sizes="200px" />
        <Link className="absolute inset-0" href={`/products/${item.product.id}`} />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-medium">
                <Link href={`/products/${item.product.id}`}>{item.product.name}</Link>
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                SKU: {item.product.sku || 'N/A'}
              </p>
            </div>
            <Prices price={item.price} className="mt-0.5" />
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="inline-grid w-full max-w-16 grid-cols-1">
            <select
              name={`quantity-${item.id}`}
              aria-label={`Quantity, ${item.product.name}`}
              className="col-start-1 row-start-1 appearance-none rounded-md py-0.5 ps-3 pe-8 text-xs/6 outline-1 -outline-offset-1 outline-neutral-900/10 focus:outline-1 dark:outline-white/15"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              disabled={updating}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 me-2 size-4 self-center justify-self-end text-neutral-500 dark:text-neutral-400"
            />
          </div>

          <div className="flex">
            <button 
              type="button" 
              className="font-medium text-primary-600 dark:text-primary-500 disabled:opacity-50"
              onClick={handleRemove}
              disabled={removing}
            >
              {removing ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AsideSidebarCart

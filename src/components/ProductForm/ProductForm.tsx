'use client'

import { NotifyAddToCart } from '@/components/AddToCardButton'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { TProductDetail } from '@/data/data'
import Form from 'next/form'
import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const ProductForm = ({
  children,
  className,
  product,
}: {
  children?: React.ReactNode
  className?: string
  product: TProductDetail
}) => {
  const featuredImage = product?.featuredImage
  const title = product?.title
  const price = product?.price
  const { addToCart, loading } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const notifyAddTocart = (quantity: number, size: string, color: string) => {
    toast.custom(
      (t) => (
        <NotifyAddToCart
          show={t.visible}
          productId={parseInt(product?.id?.replace('gid://', '') || '0')}
          imageUrl={featuredImage?.src || ''}
          quantity={quantity}
          size={size}
          color={color}
          title={title || ''}
          price={price || 0}
        />
      ),
      { position: 'top-right', id: 'nc-product-notify', duration: 4000 }
    )
  }

  const onFormSubmit = async (formData: FormData) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      router.push('/login')
      return
    }

    const quantity = formData.get('quantity') ? Number(formData.get('quantity')) : 1
    const size = formData.get('size') ? String(formData.get('size')) : ''
    const color = formData.get('color') ? String(formData.get('color')) : ''

    try {
      const productId = parseInt(product?.id?.replace('gid://', '') || '0')
      await addToCart(productId, quantity)
      notifyAddTocart(quantity, size, color)
      toast.success('Added to cart successfully!')
    } catch (error) {
      toast.error('Failed to add to cart')
      console.error('Add to cart error:', error)
    }
  }

  return (
    <Form action={onFormSubmit} className={className}>
      {children}
    </Form>
  )
}

export default ProductForm

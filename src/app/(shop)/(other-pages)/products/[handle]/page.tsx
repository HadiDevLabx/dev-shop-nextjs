import { getProductDetailByHandle, getProductReviews, getProducts } from '@/data/data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductPageContent from './ProductPageContent'
import ProductReviews from '../ProductReviews'
import ProductStatus from '../ProductStatus'

// Generate static params to prevent build errors with undefined handles
export async function generateStaticParams() {
  // Return empty array to prevent static generation
  // This will make all product pages dynamic
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  
  // Check if handle exists and is valid
  if (!handle || typeof handle !== 'string' || handle.trim() === '') {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
  
  const product = await getProductDetailByHandle(handle)
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
  return {
    title: product.title,
    description: product.description || 'Product details',
  }
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  console.log('Loading product page for handle:', handle)
  
  // Check if handle exists and is valid
  if (!handle || typeof handle !== 'string' || handle.trim() === '') {
    console.log('Invalid handle provided, returning 404')
    return notFound()
  }
  
  try {
    const product = await getProductDetailByHandle(handle)
    console.log('Product loaded:', product ? 'Success' : 'Not found')
    
    if (!product || !product.id) {
      console.log('Product not found, returning 404')
      return notFound()
    }

    const [relatedProducts, reviews] = await Promise.all([
      getProducts().then(products => products.slice(0, 6)).catch(() => []),
      getProductReviews(handle).catch(() => [])
    ])
    console.log('Related products count:', relatedProducts.length)
    console.log('Reviews count:', reviews.length)

    return <ProductPageContent product={product} relatedProducts={relatedProducts} reviews={reviews} />
  } catch (error) {
    console.error('Error loading product page:', error)
    return notFound()
  }
}

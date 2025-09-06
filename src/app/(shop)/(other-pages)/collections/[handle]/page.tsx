'use client'

import HeaderFilterSection from '@/components/HeaderFilterSection'
import ProductCard from '@/components/ProductCard'
import { getCollectionByHandle, getProducts } from '@/data/data'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { FilterProvider } from '@/contexts/FilterContext'
import { useEffect, useState, use } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props {
  params: Promise<{ handle: string }>
}

function CollectionContent({ params }: Props) {
  const { handle } = use(params)
  const searchParams = useSearchParams()
  const [collection, setCollection] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Always try to fetch collection data first
        let collectionData = null
        if (handle !== 'all') {
          collectionData = await getCollectionByHandle(handle)
          setCollection(collectionData)
        } else {
          // Set default collection for 'all'
          setCollection({
            title: 'All Products',
            description: 'Browse our entire collection'
          })
        }

        // Build filter parameters from URL search params
        const filterParams = {
          category: handle !== 'all' ? handle : undefined,
          search: searchParams.get('search') || undefined,
          min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
          max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
          colors: searchParams.get('colors') || undefined,
          sizes: searchParams.get('sizes') || undefined,
          sort_by: searchParams.get('sort_by') || 'newest',
          per_page: 20,
        }
        
        const productsData = await getProducts(filterParams)
        setProducts(productsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts([])
        // Don't show error for missing collection, just show empty products
        if (handle !== 'all') {
          setCollection({
            title: handle.charAt(0).toUpperCase() + handle.slice(1),
            description: `Browse our ${handle} collection`
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [handle, searchParams])

  if (loading) {
    return (
      <div className="container py-16 lg:py-28">
        <div className="flex justify-center items-center py-16">
          <div className="text-neutral-500">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 lg:py-28">
      <div className={handle === 'all' ? 'space-y-8 lg:space-y-12' : 'space-y-16 lg:space-y-28'}>


        {/* Filter Section */}
        <HeaderFilterSection heading={handle === 'all' ? 'Find your favorite products.' : undefined} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products && products.length > 0 ? (
            products.map((item: any, index: number) => (
              <ProductCard data={item} key={item.id || index} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-neutral-500 dark:text-neutral-400">No products found matching your criteria.</p>
              <p className="text-sm text-neutral-400 mt-2">Try adjusting your filters or browse all products.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {products.length > 0 && (
          <div className="flex mt-16 justify-center items-center">
            <ButtonPrimary>Show me more</ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CollectionPage({ params }: Props) {
  return (
    <FilterProvider>
      <CollectionContent params={params} />
    </FilterProvider>
  )
}
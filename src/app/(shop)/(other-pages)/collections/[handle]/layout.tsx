import { Divider } from '@/components/Divider'
import SectionSliderLargeProduct from '@/components/SectionSliderLargeProduct'
import { getCollectionByHandle, getProducts } from '@/data/data'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params

  const collection = await getCollectionByHandle(handle)
  const title = collection?.title || handle.charAt(0).toUpperCase() + handle.slice(1)
  const description = collection?.description || `Browse our ${handle} collection`
  return {
    title,
    description,
  }
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)

  // Always get collection data, even if API fails
  const { title, description, count } = collection || {
    title: handle.charAt(0).toUpperCase() + handle.slice(1),
    description: handle === 'all' ? '' : `Browse our ${handle} collection`,
    count: 0
  }
  
  const products = await getProducts()

  return (
    <div className="container flex flex-col gap-y-20 py-20 sm:gap-y-20 lg:gap-y-28 lg:py-28">
      <div>
        {/* HEADING */}
        {handle !== 'all' && (
          <div className="max-w-3xl text-left">
            <h1 className="mt-2 block text-4xl font-semibold tracking-tight sm:text-[2.5rem]">{title}</h1>
            <p
              className="mt-6 block text-base text-neutral-500 dark:text-neutral-400"
              dangerouslySetInnerHTML={{ __html: description || '' }}
            />
          </div>
        )}

        {/* content */}
        <div className="mt-8 lg:mt-12">{children}</div>
      </div>

      <Divider />
      <SectionSliderLargeProduct products={products.slice(0, 4)} />
 

    </div>
  )
}

export default Layout

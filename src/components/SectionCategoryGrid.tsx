'use client'

import { useEffect, useState } from 'react'
import Heading from '@/components/Heading/Heading'
import CategoryCard from '@/components/CategoryCard'
import { getCategories } from '@/data/data'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export interface SectionCategoryGridProps {
  className?: string
  heading?: string
}

const categoryIcons = {
  shirts: <ShoppingBagIcon className="h-8 w-8" />,
  jeans: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  jackets: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const SectionCategoryGrid = ({ 
  className = '', 
  heading = 'Find your favorite products' 
}: SectionCategoryGridProps) => {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const getIconForCategory = (slug: string) => {
    return categoryIcons[slug as keyof typeof categoryIcons] || (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <Heading
          className="mb-12 text-neutral-900 lg:mb-14 dark:text-neutral-50"
          fontClass="text-3xl md:text-4xl 2xl:text-5xl font-semibold"
          isCenter
        >
          {heading}
        </Heading>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-neutral-200 p-6 dark:bg-neutral-700">
              <div className="flex flex-col items-center">
                <div className="mb-4 h-16 w-16 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
                <div className="mb-2 h-6 w-24 rounded bg-neutral-300 dark:bg-neutral-600"></div>
                <div className="mb-3 h-4 w-32 rounded bg-neutral-300 dark:bg-neutral-600"></div>
                <div className="h-3 w-20 rounded bg-neutral-300 dark:bg-neutral-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Heading
        className="mb-12 text-neutral-900 lg:mb-14 dark:text-neutral-50"
        fontClass="text-3xl md:text-4xl 2xl:text-5xl font-semibold"
        isCenter
      >
        {heading}
      </Heading>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            icon={getIconForCategory(category.slug)}
          />
        ))}
      </div>
    </div>
  )
}

export default SectionCategoryGrid
'use client'

import Link from 'next/link'
import { FC } from 'react'

export interface CategoryCardProps {
  category: {
    id: number
    name: string
    slug: string
    description?: string
    product_count?: number
  }
  icon: React.ReactNode
}

const CategoryCard: FC<CategoryCardProps> = ({ category, icon }) => {
  return (
    <Link href={`/collections/${category.slug}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-neutral-800">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400">
            {icon}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {category.name}
          </h3>
          <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
            {category.description || `Explore our ${category.name.toLowerCase()} collection`}
          </p>
          <div className="text-xs font-medium text-primary-600 dark:text-primary-400">
            {category.product_count || 0} Products
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
import Link from 'next/link'
import { ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function NotFound() {
  return (
    <main className="container mt-5 lg:mt-11">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8">
          <HugeiconsIcon 
            icon={ShoppingBag03Icon} 
            size={80} 
            className="text-neutral-400 dark:text-neutral-600 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Product Not Found
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
            We couldn't find the product you're looking for. It may have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/collections/all"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Browse All Products
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-base font-medium rounded-full text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

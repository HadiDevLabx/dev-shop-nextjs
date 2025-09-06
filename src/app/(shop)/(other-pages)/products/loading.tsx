export default function Loading() {
  return (
    <main className="container mt-5 lg:mt-11">
      <div className="lg:flex">
        {/* Left side - Image skeleton */}
        <div className="w-full lg:w-[55%]">
          <div className="relative">
            <div className="animate-pulse bg-neutral-200 dark:bg-neutral-700 aspect-square rounded-lg"></div>
          </div>
        </div>

        {/* Right side - Content skeleton */}
        <div className="w-full pt-10 lg:w-[45%] lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
          <div className="sticky top-8 flex flex-col gap-y-10">
            {/* Breadcrumb skeleton */}
            <div className="animate-pulse">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mb-4"></div>
            </div>

            {/* Title skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>

            {/* Price and rating skeleton */}
            <div className="animate-pulse flex items-center gap-4">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
            </div>

            {/* Options skeleton */}
            <div className="animate-pulse space-y-6">
              <div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mb-3"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12 mb-3"></div>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <div key={size} className="w-12 h-10 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add to cart button skeleton */}
            <div className="animate-pulse flex gap-3">
              <div className="w-16 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
              <div className="flex-1 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Details section skeleton */}
      <div className="mt-12 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </main>
  )
}

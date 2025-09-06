import HeaderFilterSection from '@/components/HeaderFilterSection'
import ProductCard from '@/components/ProductCard'
import { TProductItem } from '@/data/data'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { FC, Suspense } from 'react'

//
export interface SectionGridFeatureItemsProps {
  data: TProductItem[]
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({ data }) => {
  return (
    <div className="nc-SectionGridFeatureItems relative">
      <Suspense fallback={
        <div className="mb-12">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-64 mb-8"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-32"></div>
        </div>
      }>
        <HeaderFilterSection heading="Find your favorite products." />
      </Suspense>
      <div className={`grid gap-3 sm:gap-4 lg:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
        {data.map((item) => (
          <ProductCard data={item} key={item.id} />
        ))}
      </div>
      <div className="mt-12 sm:mt-14 lg:mt-16 flex items-center justify-center px-4">
        <ButtonPrimary href="/collections/all" className="w-full sm:w-auto">
          Show me more
          <ArrowRightIcon className="ms-2 h-4 w-4 sm:h-5 sm:w-5" />
        </ButtonPrimary>
      </div>
    </div>
  )
}

export default SectionGridFeatureItems

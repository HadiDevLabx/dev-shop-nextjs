import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import { Divider } from '@/components/Divider'
import Heading from '@/components/Heading/Heading'

import SectionGridFeatureItems from '@/components/SectionGridFeatureItems'
import SectionCategoryGrid from '@/components/SectionCategoryGrid'
import SectionHero3 from '@/components/SectionHero/SectionHero3'
import SectionHowItWork from '@/components/SectionHowItWork/SectionHowItWork'
import TestimonialsSection from '@/components/TestimonialsSection'
import SectionSliderLargeProduct from '@/components/SectionSliderLargeProduct'
import SectionCollectionSlider from '@/components/SectionCollectionSlider' 
 

import { getProducts, getGroupCollections } from '@/data/data'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Metadata } from 'next'
import { Suspense } from 'react'
import {
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
  ShoppingBagIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import AnimatedHomeWrapper from './AnimatedHomeWrapper'

export const metadata: Metadata = {
  title: 'Premium Clothing Store - Fashion Collection',
  description:
    'Premium clothing and fashion for style-conscious individuals. Quality garments with fast shipping, easy returns, and exceptional service.',
  keywords: ['Clothing', 'Fashion', 'Style', 'Apparel', 'Garments', 'Shopping', 'E-commerce'],
}

async function PageHome2Content() {
  const products = await getProducts({ per_page: 12, sort_by: 'created_at', sort_order: 'desc' })
  const groupCollections = await getGroupCollections()
  const carouselProducts1 = products.slice(0, 5)
  const carouselProducts2 = products.slice(3, 10)
  const carouselProducts3 = products.slice(2, 6)
  

  return (
    <AnimatedHomeWrapper>
      <div className="nc-PageHome2 relative">
        <div className="container px-4 sm:px-6 lg:px-8" data-animate="hero">
          <SectionHero3 />
        </div>

        <div className="relative container px-4 sm:px-6 lg:px-8 my-16 sm:my-20 lg:my-24 flex flex-col gap-y-16 sm:gap-y-20 lg:gap-y-24 xl:my-36 xl:gap-y-36">

          <div data-animate="how-it-works">
            <SectionHowItWork />
          </div>
          
        </div>

        <div className="relative container px-4 sm:px-6 lg:px-8 my-16 sm:my-20 lg:my-24 flex flex-col gap-y-16 sm:gap-y-20 lg:gap-y-24 xl:my-36 xl:gap-y-36">
          <div data-animate="featured-items">
            <SectionGridFeatureItems data={products} />
          </div>
          <div data-animate="product-slider">
            <SectionSliderLargeProduct products={carouselProducts3} />
          </div>
          <div data-animate="divider">
            <Divider />
          </div>

          <div data-animate="testimonials">
            <TestimonialsSection products={products} />
          </div>
          
          
        </div>
         
      </div>
    </AnimatedHomeWrapper>
  )
}

async function PageHome2() {
  return (
    <Suspense fallback={
      <div className="nc-PageHome2 relative">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse bg-gray-200 rounded-2xl h-96 mb-16"></div>
        </div>
        <div className="relative container px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    }>
      <PageHome2Content />
    </Suspense>
  )
}

export default PageHome2

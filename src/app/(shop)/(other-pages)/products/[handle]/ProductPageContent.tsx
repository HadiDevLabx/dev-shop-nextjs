'use client'

import AccordionInfo from '@/components/AccordionInfo'
import { Divider } from '@/components/Divider'
import LikeButton from '@/components/LikeButton'
import NcInputNumber from '@/components/NcInputNumber'
import Prices from '@/components/Prices'
import ProductColorOptions from '@/components/ProductForm/ProductColorOptions'
import ProductForm from '@/components/ProductForm/ProductForm'
import ProductSizeOptions from '@/components/ProductForm/ProductSizeOptions'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import Breadcrumb from '@/shared/Breadcrumb'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { StarIcon } from '@heroicons/react/24/solid'
import { ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createContext, useContext, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import GalleryImages from '../GalleryImages'
import Policy from '../Policy'
import ProductReviews from '../ProductReviews'
import ProductStatus from '../ProductStatus'
import AnimatedProductPage from './AnimatedProductPage'

// Create context for size selection animation
interface SizeSelectionContextType {
  animateCounter: () => void
}

const SizeSelectionContext = createContext<SizeSelectionContextType | null>(null)

// Enhanced ProductSizeOptions with animation trigger
const AnimatedProductSizeOptions = ({ options, defaultSize }: any) => {
  const context = useContext(SizeSelectionContext)
  
  const handleSizeChange = (newSize: string) => {
    // Trigger counter animation when size changes
    if (context?.animateCounter) {
      context.animateCounter()
    }
  }

  return (
    <ProductSizeOptions 
      options={options} 
      defaultSize={defaultSize}
      onSizeChange={handleSizeChange}
    />
  )
}

// Enhanced NcInputNumber with animation capabilities
const AnimatedNcInputNumber = ({ name, defaultValue }: any) => {
  const counterRef = useRef<HTMLDivElement>(null)
  const context = useContext(SizeSelectionContext)

  useEffect(() => {
    if (context && counterRef.current && typeof window !== 'undefined') {
      // Register this component's animation function with the context
      context.animateCounter = () => {
        if (counterRef.current) {
          // Create exciting animation sequence
          const tl = gsap.timeline()
          
          // Pulse and glow effect
          tl.to(counterRef.current, {
            scale: 1.15,
            duration: 0.2,
            ease: "back.out(1.7)"
          })
          .to(counterRef.current, {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)",
            duration: 0.3,
            ease: "power2.out"
          }, "-=0.1")
          .to(counterRef.current, {
            scale: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.3)"
          })
          .to(counterRef.current, {
            boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
            duration: 0.3,
            ease: "power2.out"
          }, "-=0.2")

          // Add a subtle bounce to the buttons inside
          const buttons = counterRef.current.querySelectorAll('button')
          const numberSpan = counterRef.current.querySelector('span')
          
          if (buttons.length > 0) {
            gsap.to(buttons, {
              scale: 1.2,
              duration: 0.15,
              stagger: 0.05,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
              delay: 0.1
            })
          }

          if (numberSpan) {
            gsap.to(numberSpan, {
              scale: 1.2,
              color: "#3b82f6",
              fontWeight: "bold",
              duration: 0.3,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
              delay: 0.1
            })
          }
        }
      }
    }
  }, [context])

  return (
    <div ref={counterRef} className="transition-all duration-300 rounded-full">
      <NcInputNumber name={name} defaultValue={defaultValue} />
    </div>
  )
}

interface ProductPageContentProps {
  product: any
  relatedProducts: any[]
  reviews: any[]
}

const ProductPageContent: React.FC<ProductPageContentProps> = ({ product, relatedProducts, reviews }) => {
  const { title, status, featuredImage, rating, reviewNumber, options, price, selectedOptions, images, breadcrumbs } = product
  const sizeSelected = selectedOptions?.find((option: any) => option.name === 'Size')?.value || ''
  const colorSelected = selectedOptions?.find((option: any) => option.name === 'Color')?.value || ''
  
  // Animation context state
  const animationContextRef = useRef<{ animateCounter: () => void }>({
    animateCounter: () => {}
  })

  const renderRightSide = () => {
    return (
      <SizeSelectionContext.Provider value={animationContextRef.current}>
        <div className="w-full pt-10 lg:w-[45%] lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
          <div className="sticky top-8 flex flex-col gap-y-10">
            {/* ---------- 1 HEADING ----------  */}
            <div>
              <div data-animate="breadcrumb">
                <Breadcrumb breadcrumbs={breadcrumbs} currentPage={product.title} />
              </div>
              <div data-animate="title">
                <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">{title}</h1>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-6">
                <div data-animate="price">
                  <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold" price={price || 0} />
                </div>
                <div className="hidden h-7 border-l border-neutral-300 sm:block dark:border-neutral-700"></div>
                <div data-animate="rating" className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a href="#reviews" className="flex items-center text-sm font-medium">
                    <StarIcon className="size-5 pb-px text-yellow-400" />
                    <div className="ms-1.5 flex">
                      <span>{Number(rating).toFixed(1)}</span>
                      <span className="mx-2 block">·</span>
                      <span className="text-neutral-600 underline dark:text-neutral-400">{reviewNumber} reviews</span>
                    </div>
                  </a>
                  <span>·</span>
                  <ProductStatus status={status} />
                </div>
              </div>
            </div>

            <div data-animate="product-form">
              <ProductForm product={product}>
                <fieldset className="flex flex-col gap-y-10">
                  {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
                  <div className="flex flex-col gap-y-8">
                    <ProductColorOptions options={options} defaultColor={colorSelected} />
                    <AnimatedProductSizeOptions options={options} defaultSize={sizeSelected} />
                  </div>

                  {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
                  <div className="flex gap-x-3.5">
                    <div className="flex items-center justify-center rounded-full bg-neutral-100/70 px-2 py-3 sm:p-3.5 dark:bg-neutral-800/70">
                      <AnimatedNcInputNumber name="quantity" defaultValue={1} />
                    </div>

                    <ButtonPrimary className="flex-1" type="submit">
                      <HugeiconsIcon
                        icon={ShoppingBag03Icon}
                        size={20}
                        color="currentColor"
                        className="hidden sm:block"
                        strokeWidth={1.5}
                      />
                      <span className="text-base/6 font-normal sm:ml-2.5">Add to cart</span>
                    </ButtonPrimary>
                  </div>
                </fieldset>
              </ProductForm>
            </div>

            {/*  */}
            <Divider />
            {/*  */}

            {/* ---------- 5 ----------  */}
            <div data-animate="accordion">
              <AccordionInfo />
            </div>

            {/* ---------- 6 ----------  */}
            <div data-animate="policy" className="hidden xl:block">
              <Policy />
            </div>
          </div>
        </div>
      </SizeSelectionContext.Provider>
    )
  }

  const renderDetailSection = () => {
    return (
      <div data-animate="details" className="">
        <h2 className="text-2xl font-semibold">Product Details</h2>
        <div className="prose prose-sm mt-7 sm:prose sm:max-w-4xl dark:prose-invert">
          <p>
            The patented eighteen-inch hardwood Arrowhead deck --- finely mortised in, makes this the strongest and most
            rigid canoe ever built. You cannot buy a canoe that will afford greater satisfaction.
          </p>
          <p>
            The St. Louis Meramec Canoe Company was founded by Alfred Wickett in 1922. Wickett had previously worked for
            the Old Town Canoe Co from 1900 to 1914. Manufacturing of the classic wooden canoes in Valley Park, Missouri
            ceased in 1978.
          </p>
          <ul>
            <li>Regular fit, mid-weight t-shirt</li>
            <li>Natural color, 100% premium combed organic cotton</li>
            <li>Quality cotton grown without the use of herbicides or pesticides - GOTS certified</li>
            <li>Soft touch water based printed in the USA</li>
          </ul>
        </div>
      </div>
    )
  }

  const renderLeftSide = () => {
    const galleryImages = [featuredImage, ...(images || [])].map((item) => item?.src).filter(Boolean) as string[]

    return (
      <div className="w-full lg:w-[55%]">
        <div data-animate="gallery" className="relative">
          <GalleryImages images={galleryImages} gridType="grid5" />
          <LikeButton className="absolute top-3 left-3" />
        </div>
      </div>
    )
  }

  return (
    <AnimatedProductPage>
      <main className="container mt-5 lg:mt-11">
        <div className="lg:flex">
          {renderLeftSide()}
          {renderRightSide()}
        </div>

        {/* DETAIL AND REVIEW */}
        <div className="mt-12 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16">
          <div className="block xl:hidden">
            <div data-animate="policy">
              <Policy />
            </div>
          </div>
          {renderDetailSection()}
          <Divider />
          <div data-animate="reviews">
            <ProductReviews reviewNumber={reviewNumber || 0} rating={rating || 1} reviews={reviews} />
          </div>
          <Divider />
          {/* OTHER SECTION */}
          <div data-animate="related">
            <SectionSliderProductCard
              data={relatedProducts}
              heading="Customers also purchased"
              subHeading=""
              headingFontClassName="text-3xl font-semibold"
              headingClassName="mb-12 text-neutral-900 dark:text-neutral-50"
            />
          </div>
        </div>
      </main>
    </AnimatedProductPage>
  )
}

export default ProductPageContent

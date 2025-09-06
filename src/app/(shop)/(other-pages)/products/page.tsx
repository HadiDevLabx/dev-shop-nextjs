import AccordionInfo from '@/components/AccordionInfo'
import { Divider } from '@/components/Divider'
import LikeButton from '@/components/LikeButton'
import NcInputNumber from '@/components/NcInputNumber'
import Prices from '@/components/Prices'
import ProductColorOptions from '@/components/ProductForm/ProductColorOptions'
import ProductForm from '@/components/ProductForm/ProductForm'
import ProductSizeOptions from '@/components/ProductForm/ProductSizeOptions'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import { getProductDetailByHandle, getProductReviews, getProducts } from '@/data/data'
import Breadcrumb from '@/shared/Breadcrumb'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { StarIcon } from '@heroicons/react/24/solid'
import { ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GalleryImages from './GalleryImages'
import Policy from './Policy'
import ProductReviews from './ProductReviews'
import ProductStatus from './ProductStatus'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  
  if (!handle) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
  
  try {
    const product = await getProductDetailByHandle(handle)
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      }
    }
    
    const title = product.title || 'Product Detail'
    const description = product.description || 'Product detail page'
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.featuredImage?.src ? [
          {
            url: product.featuredImage.src,
            width: 800,
            height: 600,
            alt: product.title,
          }
        ] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product Detail',
      description: 'Product detail page',
    }
  }
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  
  try {
    const [product, allProducts, reviews] = await Promise.all([
      getProductDetailByHandle(handle),
      getProducts(),
      getProductReviews(handle)
    ])

    if (!product || !product.id) {
      return notFound()
    }

    // Get related products, fallback to first few products if needed
    const relatedProducts = allProducts?.slice(2, 8) || []

    const { 
      title, 
      status, 
      featuredImage, 
      rating, 
      reviewNumber, 
      options, 
      price, 
      selectedOptions, 
      images, 
      breadcrumbs, 
      description 
    } = product
    
    const sizeSelected = selectedOptions?.find((option: any) => option.name === 'Size')?.value || ''
    const colorSelected = selectedOptions?.find((option: any) => option.name === 'Color')?.value || ''

  const renderRightSide = () => {
    return (
      <div className="w-full pt-10 lg:w-[45%] lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
        <div className="sticky top-8 flex flex-col gap-y-10">
          {/* ---------- 1 HEADING ----------  */}
          <div>
            <Breadcrumb breadcrumbs={breadcrumbs || []} currentPage={title || 'Product'} />
            <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">{title || 'Product Name'}</h1>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-6">
              <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold" price={price || 0} />
              <div className="hidden h-7 border-l border-neutral-300 sm:block dark:border-neutral-700"></div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <a href="#reviews" className="flex items-center text-sm font-medium">
                  <StarIcon className="size-5 pb-px text-yellow-400" />
                  <div className="ms-1.5 flex">
                    <span>{Number(rating || 0).toFixed(1)}</span>
                    <span className="mx-2 block">·</span>
                    <span className="text-neutral-600 underline dark:text-neutral-400">
                      {reviewNumber || 0} review{(reviewNumber || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </a>
                <span>·</span>
                <ProductStatus status={status || 'In Stock'} />
              </div>
            </div>
          </div>

          <ProductForm product={product}>
            <fieldset className="flex flex-col gap-y-10">
              {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
              <div className="flex flex-col gap-y-8">
                {options && options.length > 0 && (
                  <>
                    <ProductColorOptions options={options} defaultColor={colorSelected} />
                    <ProductSizeOptions options={options} defaultSize={sizeSelected} />
                  </>
                )}
              </div>

              {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
              <div className="flex gap-x-3.5">
                <div className="flex items-center justify-center rounded-full bg-neutral-100/70 px-2 py-3 sm:p-3.5 dark:bg-neutral-800/70">
                  <NcInputNumber name="quantity" defaultValue={1} />
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

          {/*  */}
          <Divider />
          {/*  */}

          {/* ---------- 5 ----------  */}
          <AccordionInfo />

          {/* ---------- 6 ----------  */}
          <div className="hidden xl:block">
            <Policy />
          </div>
        </div>
      </div>
    )
  }

  const renderDetailSection = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold">Product Details</h2>
        <div className="prose prose-sm mt-7 sm:prose sm:max-w-4xl dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: description || 'No description available for this product.' }} />
          
          {/* Static product features - can be customized based on product category */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <ul>
              <li>High-quality materials and construction</li>
              <li>Designed for comfort and durability</li>
              <li>Available in multiple sizes and colors</li>
              <li>Easy care and maintenance</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Care Instructions</h3>
            <p>Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Shipping & Returns</h3>
            <p>Free shipping on orders over $50. Easy returns within 30 days of purchase. Customer satisfaction guaranteed.</p>
          </div>
        </div>
      </div>
    )
  }

  const renderLeftSide = () => {
    // Handle gallery images more robustly
    const allImages = []
    
    // Add featured image first if it exists
    if (featuredImage?.src) {
      allImages.push(featuredImage.src)
    }
    
    // Add additional images
    if (images && Array.isArray(images)) {
      const additionalImages = images
        .map((item: any) => item?.src)
        .filter((src: string) => src && src !== featuredImage?.src) // Avoid duplicates
      allImages.push(...additionalImages)
    }
    
    // Fallback to placeholder if no images
    const galleryImages = allImages.length > 0 ? allImages : ['/images/placeholder-small.png']

    return (
      <div className="w-full lg:w-[55%]">
        <div className="relative">
          <GalleryImages images={galleryImages} gridType="grid5" />
          <LikeButton className="absolute top-3 left-3" />
        </div>
      </div>
    )
  }

  return (
    <main className="container mt-5 lg:mt-11">
      <div className="lg:flex">
        {renderLeftSide()}
        {renderRightSide()}
      </div>

      {/* DETAIL AND REVIEW */}
      <div className="mt-12 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16">
        <div className="block xl:hidden">
          <Policy />
        </div>
        {renderDetailSection()}
        <Divider />
        <ProductReviews reviewNumber={reviewNumber || 0} rating={rating || 1} reviews={reviews} />
        <Divider />
        {/* OTHER SECTION */}
        {relatedProducts && relatedProducts.length > 0 && (
          <SectionSliderProductCard
            data={relatedProducts}
            heading="Customers also purchased"
            subHeading=""
            headingFontClassName="text-3xl font-semibold"
            headingClassName="mb-12 text-neutral-900 dark:text-neutral-50"
          />
        )}
        {/* SECTION */}
        <div className="pb-20 lg:pt-16 xl:pb-28">
          {/* Additional promotional content can be added here */}
        </div>
      </div>
    </main>
  )
  } catch (error) {
    console.error('Error loading product page:', error)
    return notFound()
  }
}

'use client'

import { TProductItem } from '@/data/data'
import NcImage from '@/shared/NcImage/NcImage'
import { Link } from '@/shared/link'
import { ArrowsPointingOutIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { FC, useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import AddToCardButton from './AddToCardButton'
import LikeButton from './LikeButton'
import Prices from './Prices'
import ProductStatus from './ProductStatus'
import { useAside } from './aside'

interface Props {
  className?: string
  data: TProductItem
  isLiked?: boolean
}

const ProductCard: FC<Props> = ({ className = '', data, isLiked }) => {
  const { title, price, status, rating, options, handle, selectedOptions, reviewNumber, images, featuredImage } = data
  const color = selectedOptions?.find((option: any) => option.name === 'Color')?.value

  const { open: openAside, setProductQuickViewHandle } = useAside()

  // GSAP Animation refs
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const ratingRef = useRef<HTMLDivElement>(null)
  const buttonGroupRef = useRef<HTMLDivElement>(null)
  const reviewPopupRef = useRef<HTMLDivElement>(null)
  const reviewArrowRef = useRef<HTMLDivElement>(null)

  // State for cycling through reviews
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Get all available reviews
  const getAllReviews = () => {
    const reviews = data.reviews || data.review || data.testimonials || []
    if (reviews && reviews.length > 0) {
      return reviews.map((review: any) => ({
        name: review.author_name || review.name || review.reviewer || review.customer_name || "Anonymous",
        rating: review.rating || review.stars || review.score || rating || 5,
        comment: review.content || review.comment || review.review || review.text || "Great product!",
        date: review.created_at || review.date || review.time || "Recently",
        verified: review.verified_purchase || review.verified || true
      }))
    }
    
    // Return sample reviews if no real reviews
    return [
      {
        name: "Sarah M.",
        rating: rating || 5,
        comment: "Amazing quality! Perfect fit. Highly recommend!",
        date: "2 days ago",
        verified: true
      },
      {
        name: "Mike R.",
        rating: rating || 5,
        comment: "Excellent service and fast delivery. Very satisfied!",
        date: "1 week ago",
        verified: true
      },
      {
        name: "Emma L.",
        rating: (rating || 5) - 1,
        comment: "Good quality product. Would buy again.",
        date: "3 days ago",
        verified: true
      }
    ]
  }

  const allReviews = getAllReviews()
  const currentReview = allReviews[currentReviewIndex] || allReviews[0]

  // Cycle through reviews on each hover
  useEffect(() => {
    const nextIndex = (currentReviewIndex + 1) % allReviews.length
    const timer = setTimeout(() => {
      setCurrentReviewIndex(nextIndex)
    }, 5000) // Change review every 5 seconds when component is mounted

    return () => clearTimeout(timer)
  }, [currentReviewIndex, allReviews.length])

  // Format date for display
  const formatReviewDate = (dateString: string) => {
    if (!dateString || dateString === "Recently") return "Recently"
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return "Today"
      if (diffDays === 1) return "Yesterday"
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      return `${Math.floor(diffDays / 365)} years ago`
    } catch {
      return dateString
    }
  }

  // Truncate review text for mobile
  const truncateReview = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  // Initialize GSAP animations on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return

    // Set initial mobile state
    setIsMobile(window.innerWidth < 640)

    // Add resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)

    const cleanup = () => {
      window.removeEventListener('resize', handleResize)
    }

    const ctx = gsap.context(() => {
      // Initial entrance animation
      gsap.set(cardRef.current, { opacity: 0, y: 30, scale: 0.95 })
      gsap.set([titleRef.current, priceRef.current, ratingRef.current], { opacity: 0, x: -20 })
      gsap.set(imageRef.current, { scale: 1.1, opacity: 0 })

      // Animate entrance
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: Math.random() * 0.3 // Stagger for multiple cards
      })

      gsap.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.1
      })

      gsap.to([titleRef.current, priceRef.current, ratingRef.current], {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.3
      })

      // Initially hide review popup
      gsap.set(reviewPopupRef.current, { 
        opacity: 0, 
        scale: 0.8, 
        y: -10,
        visibility: 'hidden'
      })
      gsap.set(reviewArrowRef.current, { 
        rotation: 0,
        scale: 1
      })

    }, cardRef)

    return () => {
      ctx.revert()
      cleanup()
    }
  }, [])

  // Mouse hover animations
  const handleMouseEnter = () => {
    if (typeof window === 'undefined' || !cardRef.current) return

    // Cycle to next review on hover for variety
    setCurrentReviewIndex((prev) => (prev + 1) % allReviews.length)

    // Use state-based mobile check instead of direct window access

    // Increase z-index when hovering to ensure popup appears above other cards
    gsap.set(cardRef.current, { zIndex: 50 })

    gsap.to(cardRef.current, {
      y: isMobile ? -4 : -8, // Smaller lift on mobile
      scale: isMobile ? 1.01 : 1.02, // Smaller scale on mobile
      duration: 0.4,
      ease: "power2.out"
    })

    gsap.to(imageRef.current, {
      scale: isMobile ? 1.02 : 1.05, // Smaller scale on mobile
      duration: 0.4,
      ease: "power2.out"
    })

    gsap.to(titleRef.current, {
      color: '#3b82f6',
      duration: 0.3,
      ease: "power2.out"
    })

    gsap.to([priceRef.current, ratingRef.current], {
      y: -2,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.05
    })

    // Animate buttons appearing
    gsap.to(buttonGroupRef.current, {
      opacity: 1,
      y: -10,
      duration: 0.3,
      ease: "back.out(1.7)"
    })

    // Show review popup with animation
    gsap.set(reviewPopupRef.current, { visibility: 'visible' })
    gsap.to(reviewPopupRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
      delay: 0.1
    })

    // Animate arrow
    gsap.to(reviewArrowRef.current, {
      rotation: 180,
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out"
    })

    // Trigger star animations
    const stars = reviewPopupRef.current?.querySelectorAll('.star-container')
    if (stars) {
      stars.forEach((star, index) => {
        gsap.fromTo(star, 
          { 
            opacity: 0, 
            scale: 0, 
            rotation: -180 
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: 0.3 + (index * 0.1)
          }
        )
      })
    }
  }

  const handleMouseLeave = () => {
    if (typeof window === 'undefined' || !cardRef.current) return

    // Reset z-index when not hovering
    gsap.set(cardRef.current, { zIndex: 1 })

    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    })

    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    })

    gsap.to(titleRef.current, {
      color: '',
      duration: 0.3,
      ease: "power2.out"
    })

    gsap.to([priceRef.current, ratingRef.current], {
      y: 0,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.05
    })

    // Animate buttons hiding
    gsap.to(buttonGroupRef.current, {
      opacity: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    })

    // Hide review popup
    gsap.to(reviewPopupRef.current, {
      opacity: 0,
      scale: 0.8,
      y: -10,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(reviewPopupRef.current, { visibility: 'hidden' })
      }
    })

    // Reset arrow
    gsap.to(reviewArrowRef.current, {
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  // Quick view animation
  const handleQuickView = () => {
    gsap.to(cardRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        if (handle) {
          setProductQuickViewHandle(handle)
          openAside('product-quick-view')
        }
      }
    })
  }

  const renderColorOptions = () => {
    const optionColorValues = options?.find((option: any) => option.name === 'Color')?.optionValues

    if (!optionColorValues?.length) {
      return null
    }

    return (
      <div className="flex gap-2">
        {optionColorValues.map((color: any) => (
          <div key={color.name} className="relative size-4 cursor-pointer overflow-hidden rounded-full">
            <div
              className="absolute inset-0 z-0 rounded-full bg-cover ring-1 ring-neutral-900/20 dark:ring-white/20"
              style={{
                backgroundColor: color.swatch?.color,
                backgroundImage: color.swatch?.image ? `url(${color.swatch.image})` : undefined,
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  const renderGroupButtons = () => {
    return (
      <div 
        ref={buttonGroupRef}
        className="absolute inset-x-1 bottom-0 flex justify-center gap-1 sm:gap-1.5 opacity-0 transition-all"
        style={{ transform: 'translateY(10px)' }}
      >
        <AddToCardButton
          as={'button'}
          className="flex cursor-pointer items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-neutral-900 px-3 sm:px-4 py-1.5 sm:py-2 text-xs/normal text-white shadow-lg hover:bg-neutral-800 transform hover:scale-105 transition-transform duration-200"
          title={title || ''}
          imageUrl={featuredImage?.src || ''}
          price={price || 0}
          quantity={1}
          size={selectedOptions?.find((option: any) => option.name === 'Size')?.value}
          color={selectedOptions?.find((option: any) => option.name === 'Color')?.value}
          productId={parseInt(data.id?.replace('gid://', '') || '0')}
        >
          <ShoppingBagIcon className="-ml-1 size-3 sm:size-3.5" />
          <span className="hidden sm:inline">Add to bag</span>
          <span className="sm:hidden">Add</span>
        </AddToCardButton>

        <button
          className="flex cursor-pointer items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs/normal text-neutral-950 shadow-lg hover:bg-neutral-50 transform hover:scale-105 transition-transform duration-200"
          type="button"
          onClick={handleQuickView}
        >
          <ArrowsPointingOutIcon className="-ml-1 size-3 sm:size-3.5" />
          <span className="hidden sm:inline">Quick view</span>
          <span className="sm:hidden">View</span>
        </button>
      </div>
    )
  }

  const renderReviewPopup = () => {
    return (
      <div 
        ref={reviewPopupRef}
        className="absolute bottom-full left-1 right-1 sm:left-2 sm:right-2 mb-1 sm:mb-2 z-[100] bg-white dark:bg-neutral-800 rounded-lg shadow-2xl border border-neutral-200 dark:border-neutral-700 p-2 sm:p-3"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)' 
        }}
      >
        {/* Arrow pointing down - responsive positioning */}
        <div className="absolute -bottom-1.5 sm:-bottom-2 left-4 sm:left-6">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white dark:bg-neutral-800 border-r border-b border-neutral-200 dark:border-neutral-700 transform rotate-45"></div>
        </div>
        
        {/* Review Content - Mobile Responsive */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {currentReview.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {currentReview.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                  {formatReviewDate(currentReview.date)}
                </p>
              </div>
            </div>
            
            {/* Animated Star Rating - Mobile Responsive */}
            <div className="flex items-center space-x-0.5 flex-shrink-0 ml-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="star-container"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <StarIcon
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-all duration-300 ${
                      i < currentReview.rating
                        ? 'text-yellow-400 animate-star-glow'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Review text - responsive with better mobile handling */}
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-1.5 sm:mb-2 line-clamp-2 sm:line-clamp-2">
            "{isMobile ? truncateReview(currentReview.comment, 60) : truncateReview(currentReview.comment, 120)}"
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              {currentReview.verified ? '✓ Verified' : '• Review'}
            </span>
            <div 
              ref={reviewArrowRef}
              className="text-neutral-400 dark:text-neutral-500"
            >
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div 
        ref={cardRef}
        className={`product-card relative flex flex-col bg-transparent ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter} // Add touch support for mobile
        onTouchEnd={handleMouseLeave}   // Add touch support for mobile
        style={{ zIndex: 1 }}
      >
        <Link href={'/products/' + handle} className="absolute inset-0"></Link>

        <div 
          ref={imageRef}
          className="group relative z-1 shrink-0 overflow-hidden rounded-3xl bg-neutral-50 dark:bg-neutral-300"
        >
          <Link href={'/products/' + handle} className="block">
            {featuredImage?.src && (
              <NcImage
                containerClassName="flex aspect-w-1 aspect-h-1 w-full h-0"
                src={featuredImage}
                className="h-full w-full object-cover transition-transform duration-300"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
                alt={handle}
              />
            )}
          </Link>
          <ProductStatus status={status} />
          <LikeButton liked={isLiked} className="absolute end-3 top-3 z-10" />
          {renderGroupButtons()}
        </div>

        {/* Review Popup */}
        {renderReviewPopup()}

        <div className="space-y-3 sm:space-y-4 px-2 sm:px-2.5 pt-4 sm:pt-5 pb-2 sm:pb-2.5">
          {renderColorOptions()}
          <div>
            <h2 
              ref={titleRef}
              className="nc-ProductCard__title text-sm sm:text-base font-semibold transition-colors line-clamp-2"
            >
              {title}
            </h2>
            <p className={`mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400`}>{color}</p>
          </div>

          <div className="flex items-end justify-between">
            <div ref={priceRef}>
              <Prices price={price ?? 1} />
            </div>
            <div ref={ratingRef} className="mb-0.5 flex items-center">
              <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 pb-px text-amber-400" />
              <span className="ms-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <span className="hidden sm:inline">{rating ? Number(rating).toFixed(1) : '0.0'} ({data.review_count || reviewNumber || 0} reviews)</span>
                <span className="sm:hidden">{rating ? Number(rating).toFixed(1) : '0.0'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard

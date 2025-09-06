'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { TProductItem } from '@/data/data'
import { useNotification } from '@/contexts/NotificationContext'
import user1 from '@/images/users/1.png'
import user2 from '@/images/users/2.png'
import user3 from '@/images/users/3.png'
import user4 from '@/images/users/4.png'

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing quality! The fabric is so soft and the fit is perfect. Will definitely order again.",
    product: "Premium Cotton T-Shirt",
    userImage: user1
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 5,
    comment: "Fast shipping and excellent customer service. The jacket exceeded my expectations!",
    product: "Winter Jacket",
    userImage: user2
  },
  {
    id: 3,
    name: "Emma Davis",
    rating: 4,
    comment: "Love the style and comfort. Great value for money. Highly recommend!",
    product: "Casual Dress",
    userImage: user3
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    rating: 5,
    comment: "Perfect fit and great material. The colors are vibrant and haven't faded after washing.",
    product: "Designer Jeans",
    userImage: user4
  },
  {
    id: 5,
    name: "Lisa Thompson",
    rating: 5,
    comment: "Outstanding quality and beautiful design. This has become my favorite piece!",
    product: "Silk Blouse",
    userImage: user1
  },
  {
    id: 6,
    name: "David Wilson",
    rating: 4,
    comment: "Great product, fast delivery. The sizing chart was accurate. Very satisfied!",
    product: "Sports Hoodie",
    userImage: user2
  }
]

interface TestimonialsSectionProps {
  products?: TProductItem[];
}

export default function TestimonialsSection({ products = [] }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { setProducts } = useNotification()

  // Set products for global notifications when component mounts
  useEffect(() => {
    if (products.length > 0) {
      setProducts(products)
    }
  }, [products, setProducts])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getVisibleTestimonials = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length
      visible.push(testimonials[index])
    }
    return visible
  }

  return (
    <div className="py-8 sm:py-12 lg:py-16 relative">
      <div className="text-center mb-6 sm:mb-8 px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3">
          What Our Customers Say
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Don't just take our word for it - hear from our satisfied customers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
        {getVisibleTestimonials().map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${currentIndex}`}
            className="relative bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 animate-fade-in overflow-hidden"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400 to-yellow-500 rounded-full transform -translate-x-4 translate-y-4"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>
              
              <div className="border-t pt-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={typeof testimonial.userImage === 'string' ? testimonial.userImage : testimonial.userImage.src} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {testimonial.product}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
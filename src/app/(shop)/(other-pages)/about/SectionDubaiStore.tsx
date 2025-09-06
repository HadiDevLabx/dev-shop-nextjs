import Heading from '@/components/Heading/Heading'
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'

export interface SectionDubaiStoreProps {
  className?: string
}

const SectionDubaiStore: FC<SectionDubaiStoreProps> = ({ className = '' }) => {
  return (
    <div className={`nc-SectionDubaiStore relative ${className}`}>
      <Heading
        description="Visit our flagship store in the heart of Dubai for an exclusive shopping experience"
      >
        🏢 Our Dubai Store
      </Heading>
      
      <div className="grid gap-8 lg:grid-cols-2 xl:gap-12">
        {/* Store Information */}
        <div className="space-y-8">
          <div className="rounded-2xl bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6 dark:text-neutral-200">
              Store Details
            </h3>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <MapPinIcon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-200">Address</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    Dubai Mall, Ground Floor<br />
                    Downtown Dubai, Dubai<br />
                    United Arab Emirates
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <PhoneIcon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-200">Contact</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    +971 4 123 4567<br />
                    dubai@devshop.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <ClockIcon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-200">Store Hours</h4>
                  <div className="text-neutral-600 dark:text-neutral-400 mt-1 space-y-1">
                    <p>Monday - Thursday: 10:00 AM - 10:00 PM</p>
                    <p>Friday - Saturday: 10:00 AM - 12:00 AM</p>
                    <p>Sunday: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Features */}
          <div className="rounded-2xl bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6 dark:text-neutral-200">
              Store Features
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-white dark:bg-neutral-700">
                <div className="text-2xl mb-2">👔</div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Personal Styling</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white dark:bg-neutral-700">
                <div className="text-2xl mb-2">🎁</div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Gift Wrapping</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white dark:bg-neutral-700">
                <div className="text-2xl mb-2">🚚</div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Same Day Delivery</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white dark:bg-neutral-700">
                <div className="text-2xl mb-2">💎</div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">VIP Lounge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Experience */}
        <div className="space-y-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-8 dark:from-primary-900/20 dark:to-primary-800/20">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6 dark:text-neutral-200">
              Exclusive Dubai Experience
            </h3>
            <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
              <p>
                Our Dubai flagship store offers a premium shopping experience in the world&apos;s largest mall. 
                Spanning over 2,000 square feet, the store features our complete collection alongside 
                exclusive Dubai-only pieces.
              </p>
              <p>
                Enjoy personalized styling sessions with our expert consultants, relax in our VIP lounge, 
                and take advantage of same-day delivery throughout Dubai and the UAE.
              </p>
              <p>
                Located in the prestigious Downtown Dubai, our store provides a luxury retail experience 
                that reflects the cosmopolitan spirit of this global city.
              </p>
            </div>
          </div>

          {/* Special Services */}
          <div className="rounded-2xl bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6 dark:text-neutral-200">
              Special Services
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Complimentary alterations for all purchases
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Private shopping appointments available
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Multi-language customer service (Arabic, English, Hindi)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Tax-free shopping for tourists
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  International shipping services
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionDubaiStore

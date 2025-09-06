'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { TProductItem } from '@/data/data'
import avatar1 from '@/images/users/avatar1.jpg'
import avatar2 from '@/images/users/avatar2.jpg'
import avatar3 from '@/images/users/avatar3.jpg'
import avatar4 from '@/images/users/avatar4.jpg'

interface NotificationType {
  name: string;
  product: TProductItem;
  userImage: any;
}

interface NotificationContextType {
  showNotification: (notification: NotificationType) => void;
  setProducts: (products: TProductItem[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

const fakeUsers = [
  { name: "John D.", userImage: avatar1 },
  { name: "Sarah M.", userImage: avatar2 },
  { name: "Mike R.", userImage: avatar3 },
  { name: "Emma L.", userImage: avatar4 },
  { name: "Alex P.", userImage: avatar1 },
  { name: "Maria G.", userImage: avatar2 },
  { name: "Tom W.", userImage: avatar3 },
  { name: "Lisa K.", userImage: avatar4 }
]

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showNotificationState, setShowNotificationState] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<NotificationType | null>(null)
  const [products, setProducts] = useState<TProductItem[]>([])

  const getRandomNotification = (): NotificationType | null => {
    if (products.length === 0) return null
    const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)]
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    return {
      name: randomUser.name,
      product: randomProduct,
      userImage: randomUser.userImage
    }
  }

  const showNotification = (notification: NotificationType) => {
    setCurrentNotification(notification)
    setShowNotificationState(true)
    
    setTimeout(() => {
      setShowNotificationState(false)
    }, 5000)
  }

  useEffect(() => {
    if (products.length === 0) return
    
    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      const randomNotification = getRandomNotification()
      if (randomNotification) {
        showNotification(randomNotification)
      }
    }, 3000)
    
    // Then show notifications every 12 seconds
    const notificationInterval = setInterval(() => {
      const randomNotification = getRandomNotification()
      if (randomNotification) {
        showNotification(randomNotification)
      }
    }, 12000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(notificationInterval)
    }
  }, [products])

  return (
    <NotificationContext.Provider value={{ showNotification, setProducts }}>
      {children}
      
      {/* Global Notification - Fixed to entire page */}
      {showNotificationState && currentNotification && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 max-w-sm w-72 transform transition-all duration-500 ease-out animate-slide-in-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-green-400">
              <img 
                src={typeof currentNotification.userImage === 'string' ? currentNotification.userImage : currentNotification.userImage.src} 
                alt="User" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {currentNotification.name} just purchased
                </p>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                {currentNotification.product.title}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Verified purchase
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
              <img 
                src={currentNotification.product.featuredImage?.src || '/images/placeholder-small.png'} 
                alt="Product" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}

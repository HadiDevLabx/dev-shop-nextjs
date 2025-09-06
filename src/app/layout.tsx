import Aside from '@/components/aside'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import GlobalClient from './GlobalClient'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s - Dev Lab',
    default: 'Dev Lab',
  },
  description:
    'Dev Lab is a modern and elegant e-commerce platform built with Next.js, Tailwind CSS, and TypeScript. Designed for simplicity and ease of use, with a focus on performance and accessibility.',
  keywords: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Dev Lab', 'Headless UI', 'Fashion', 'E-commerce'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body 
        className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200"
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Aside.Provider>
                {children}

                {/* Client component: Toaster, ... */}
                <GlobalClient />

              </Aside.Provider>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

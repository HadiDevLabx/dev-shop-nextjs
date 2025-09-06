import { ApplicationLayout } from '@/app/(shop)/application-layout'
import { ReactNode } from 'react'

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}
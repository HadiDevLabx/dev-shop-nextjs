'use client'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function EmailVerificationContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircleIcon className="h-16 w-16 text-green-500" />,
          title: 'Email Verified!',
          message: 'Your email has been verified successfully.',
        }
      case 'already-verified':
        return {
          icon: <CheckCircleIcon className="h-16 w-16 text-blue-500" />,
          title: 'Already Verified',
          message: 'Your email was already verified.',
        }
      default:
        return {
          icon: <XCircleIcon className="h-16 w-16 text-red-500" />,
          title: 'Verification Failed',
          message: 'Email verification failed.',
        }
    }
  }

  const content = getContent()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {content.icon}
        <h2 className="text-2xl font-bold mt-4">{content.title}</h2>
        <p className="mt-2 mb-6">{content.message}</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-2 rounded">
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationContent />
    </Suspense>
  )
}
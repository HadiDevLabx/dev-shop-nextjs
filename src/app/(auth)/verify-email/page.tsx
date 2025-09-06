'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const VerifyEmailPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Since email verification is skipped, redirect to home page
    router.push('/')
  }, [router])

  return (
    <div className="container mb-24 lg:mb-32">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Redirecting...</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Email verification is not required. Redirecting to home page...
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailPage
'use client'

import { useAuth } from '@/contexts/AuthContext'
import facebookSvg from '@/images/socials/facebook-2.svg'
import googleSvg from '@/images/socials/google.svg'
import twitterSvg from '@/images/socials/twitter.svg'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Field, FieldGroup, Fieldset, Label } from '@/shared/fieldset'
import { Input } from '@/shared/input'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const loginSocials = [
  {
    name: 'Continue with Facebook',
    href: '#',
    icon: facebookSvg,
  },
  {
    name: 'Continue with Twitter',
    href: '#',
    icon: twitterSvg,
  },
  {
    name: 'Continue with Google',
    href: '#',
    icon: googleSvg,
  },
]

const PageLogin = () => {
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await login({ email, password })
      
      // Check for checkout redirect
      const checkoutRedirect = localStorage.getItem('checkout_redirect')
      if (checkoutRedirect) {
        localStorage.removeItem('checkout_redirect')
        router.push('/checkout')
      } else {
        // Check for URL redirect parameter
        const searchParams = new URLSearchParams(window.location.search)
        const redirect = searchParams.get('redirect')
        
        if (redirect === 'checkout') {
          router.push('/checkout')
        } else {
          router.push('/')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="container mb-24 lg:mb-32">
        <h1 className="my-20 flex items-center justify-center text-3xl leading-[115%] font-semibold text-neutral-900 md:text-5xl md:leading-[115%] dark:text-neutral-100">
          Login
        </h1>
        <div className="mx-auto flex max-w-md flex-col gap-y-6">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:-translate-y-0.5 sm:px-6 dark:bg-neutral-800"
              >
                <Image className="size-5 shrink-0 object-cover" src={item.icon} alt={item.name} sizes="40px" />
                <h3 className="grow text-center text-sm font-medium text-neutral-700 sm:text-sm dark:text-neutral-300">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
              OR
            </span>
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 transform border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <Fieldset>
              <FieldGroup className="sm:space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}
                <Field>
                  <Label>Email</Label>
                  <Input type="email" name="email" placeholder="example@example.com" required />
                </Field>
                <Field>
                  <Label className="flex items-center justify-between gap-2">
                    <span>Password</span>
                    <Link className="text-sm font-normal text-primary-600" href="/forgot-password">
                      Forgot password?
                    </Link>
                  </Label>
                  <Input type="password" name="password" required />
                </Field>
                <ButtonPrimary className="mt-2 w-full" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Continue'}
                </ButtonPrimary>
              </FieldGroup>
            </Fieldset>
          </form>

          {/* ==== */}
          <span className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-primary-600 underline" href="/signup">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PageLogin

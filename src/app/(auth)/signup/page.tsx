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

const PageSignUp = () => {
  const { register } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const password_confirmation = formData.get('password_confirmation') as string

    if (password !== password_confirmation) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await register({ name, email, password, password_confirmation })
      
      // Since email verification is skipped, redirect directly to dashboard/home
      setSuccess('Registration successful! Redirecting...')
      setTimeout(() => router.push('/'), 1000)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mb-24 lg:mb-32">
      <h1 className="my-20 flex items-center justify-center text-3xl leading-[115%] font-semibold text-neutral-900 md:text-5xl md:leading-[115%] dark:text-neutral-100">
        Sign up
      </h1>
      <div className="mx-auto max-w-md space-y-6">
        <div className="grid gap-3">
          {loginSocials.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex w-full transform rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:translate-y-[-2px] sm:px-6 dark:bg-neutral-800"
            >
              <Image sizes="40px" className="size-5 shrink-0 object-cover" src={item.icon} alt={item.name} />
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
              {success && (
                <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {success}
                </div>
              )}
              <Field>
                <Label>Full Name</Label>
                <Input type="text" name="name" placeholder="John Doe" required />
              </Field>
              <Field>
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="example@example.com" required />
              </Field>
              <Field>
                <Label>Password</Label>
                <Input type="password" name="password" required minLength={8} />
              </Field>
              <Field>
                <Label>Confirm Password</Label>
                <Input type="password" name="password_confirmation" required minLength={8} />
              </Field>

              <ButtonPrimary className="mt-2 w-full" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Continue'}
              </ButtonPrimary>
            </FieldGroup>
          </Fieldset>
        </form>

        {/* ==== */}
        <span className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account? {` `}
          <Link className="text-primary-600 underline" href="/login">
            Sign in
          </Link>
        </span>
      </div>
    </div>
  )
}

export default PageSignUp

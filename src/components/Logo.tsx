import { Link } from '@/components/Link'
import React from 'react'

export interface LogoProps extends React.ComponentPropsWithoutRef<'svg'> {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = 'shrink-0', ...props }) => {
  return (
    <Link href="/" className={`flex text-neutral-950 dark:text-neutral-50 ${className}`}>
      <span className="text-2xl font-bold">Dev Lab</span>
    </Link>
  )
}

export default Logo

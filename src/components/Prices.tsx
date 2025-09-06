import clsx from 'clsx'
import { formatCurrency } from '@/utils/price'
import { FC } from 'react'

export interface PricesProps {
  className?: string
  price: number | string
  contentClass?: string
}

const Prices: FC<PricesProps> = ({
  className,
  price,
  contentClass = 'py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium',
}) => {
  return (
    <div className={clsx(className)}>
      <div className={`flex items-center rounded-lg border-2 border-primary-500 ${contentClass}`}>
        <span className="leading-none! text-primary-500">{formatCurrency(price)}</span>
      </div>
    </div>
  )
}

export default Prices

'use client'

import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { FC, useEffect, useState } from 'react'

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  defaultValue?: number
  min?: number
  max?: number
  onChange?: (value: number) => void
  label?: string
  description?: string
}

const NcInputNumber: FC<Props> = ({
  className = 'w-full',
  defaultValue = 1,
  min = 1,
  max = 99,
  onChange,
  label,
  description,
  ...rest
}) => {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleClickDecrement = () => {
    if (min >= value) return
    setValue((state) => {
      return state - 1
    })
    onChange && onChange(value - 1)
  }
  const handleClickIncrement = () => {
    if (max && max <= value) return
    setValue((state) => {
      return state + 1
    })
    onChange && onChange(value + 1)
  }

  return (
    <div className={`flex items-center justify-between gap-x-5 ${className}`}>
      {label && (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">{label}</span>
          {description && (
            <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">{description}</span>
          )}
        </div>
      )}
      <div className="flex w-26 items-center justify-between sm:w-28">
        <button
          className="flex size-8 items-center justify-center rounded-full border border-neutral-400 bg-white hover:border-neutral-700 focus:outline-hidden disabled:cursor-default disabled:opacity-50 disabled:hover:border-neutral-400 dark:border-neutral-500 dark:bg-neutral-900 dark:hover:border-neutral-400 dark:disabled:hover:border-neutral-500"
          type="button"
          onClick={handleClickDecrement}
          disabled={min >= value}
        >
          <MinusIcon className="size-4" />
        </button>
        <input type="hidden" name="quantity" {...rest} value={value} />
        <span className="block flex-1 text-center leading-none select-none">{value}</span>
        <button
          className="flex size-8 items-center justify-center rounded-full border border-neutral-400 bg-white hover:border-neutral-700 focus:outline-hidden disabled:cursor-default disabled:opacity-50 disabled:hover:border-neutral-400 dark:border-neutral-500 dark:bg-neutral-900 dark:hover:border-neutral-400 dark:disabled:hover:border-neutral-500"
          type="button"
          onClick={handleClickIncrement}
          disabled={max ? max <= value : false}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

export default NcInputNumber

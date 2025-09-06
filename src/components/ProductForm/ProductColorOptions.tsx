'use client'

import { TProductItem } from '@/data/data'
import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { useState } from 'react'

const ProductColorOptions = ({
  options,
  className,
  defaultColor,
}: {
  options: TProductItem['options']
  className?: string
  defaultColor: string
}) => {
  const [colorSelected, setColorSelected] = useState(defaultColor)

  const colorOptionValues = options?.find((option: { name: string; optionValues: any[] }) => option.name === 'Color')?.optionValues

  if (!colorOptionValues?.length) {
    return null
  }

  return (
    <Headless.Field className={clsx(className)}>
      <Headless.RadioGroup value={colorSelected} name="color" onChange={setColorSelected} aria-label="Color">
        <Headless.Label className="block text-sm font-medium rtl:text-right">Color</Headless.Label>
        <div className="mt-2.5 flex gap-x-2.5">
          {colorOptionValues.map((value: { name: string; swatch: { color?: string; image?: string } | null }) => {
            const isActive = value.name === colorSelected

            return (
              <Headless.Radio
                key={value.name}
                value={value.name}
                as="div"
                className={clsx(
                  'relative size-9 cursor-pointer rounded-full',
                  isActive && 'ring-2 ring-neutral-900 dark:ring-neutral-300'
                )}
              >
                <div
                  className="absolute inset-0.5 z-0 overflow-hidden rounded-full bg-cover ring-1 ring-neutral-900/10 dark:ring-white/15"
                  style={{
                    backgroundColor: value.swatch?.color,
                    backgroundImage: value.swatch?.image ? `url(${value.swatch.image})` : undefined,
                  }}
                />
              </Headless.Radio>
            )
          })}
        </div>
      </Headless.RadioGroup>
    </Headless.Field>
  )
}

export default ProductColorOptions

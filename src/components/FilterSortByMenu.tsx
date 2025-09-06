'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { ArrangeByLettersAZIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { FC, Fragment, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const sortByOptions = [
  { name: 'Newest', value: 'newest' },
  { name: 'Oldest', value: 'oldest' },
  { name: 'Price: low to high', value: 'price_low_high' },
  { name: 'Price: high to low', value: 'price_high_low' },
  { name: 'A to Z', value: 'name' },
]

type Props = {
  className?: string
  filterOptions?: { name: string; value: string }[]
}

export const FilterSortByMenuListBox: FC<Props> = ({ className, filterOptions = sortByOptions }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOption, setSelectedOption] = useState(filterOptions[0].value)

  useEffect(() => {
    const sortBy = searchParams.get('sort_by')
    if (sortBy) {
      setSelectedOption(sortBy)
    }
  }, [searchParams])

  const handleSortChange = (value: string) => {
    setSelectedOption(value)
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort_by', value)
    
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/products'
    const newUrl = `${currentPath}?${params.toString()}`
    router.push(newUrl)
  }

  return (
    <div className={clsx('product-sort-by-list-box flex shrink-0', className)}>
      <Listbox value={selectedOption} onChange={handleSortChange}>
        <div className="relative">
          <ListboxButton
            className={clsx(
              'flex items-center justify-center rounded-full px-4 py-2.5 text-sm select-none ring-inset group-data-open:ring-2 group-data-open:ring-black hover:bg-neutral-50 focus:outline-hidden dark:group-data-open:ring-white dark:hover:bg-neutral-900',
              'ring-1 ring-neutral-300 dark:ring-neutral-700'
            )}
          >
            <HugeiconsIcon icon={ArrangeByLettersAZIcon} size={18} />
            <span className="ms-2">{filterOptions.find((item) => item.value === selectedOption)?.name || 'Sort by'}</span>
            <ChevronDownIcon className="ml-3 size-4" aria-hidden="true" />
          </ListboxButton>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ListboxOptions className="absolute right-0 z-50 mt-2 max-h-60 w-52 overflow-auto rounded-xl bg-white py-1 text-sm text-neutral-900 shadow-lg ring-1 ring-black/5 focus:outline-hidden dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700">
              {filterOptions.map((item) => (
                <ListboxOption
                  key={item.value}
                  className={({ focus: active }) =>
                    clsx(
                      'relative flex cursor-default py-2 ps-10 pe-4 select-none',
                      active && 'bg-primary-50 text-primary-700 dark:bg-neutral-700 dark:text-neutral-200'
                    )
                  }
                  value={item.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={clsx('block truncate', selected && 'font-medium')}>{item.name}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-primary-700 dark:text-neutral-200">
                          <CheckIcon className="size-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

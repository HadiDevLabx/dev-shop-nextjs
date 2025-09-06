'use client'

import ButtonClose from '@/shared/Button/ButtonClose'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonThird from '@/shared/Button/ButtonThird'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/shared/checkbox'
import { Radio, RadioField, RadioGroup } from '@/shared/radio'
import * as Headless from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  DollarCircleIcon,
  FilterVerticalIcon,
  Note01Icon,
  PackageDimensions01Icon,
  PaintBucketIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import clsx from 'clsx'
import Form from 'next/form'
import { useState, useEffect } from 'react'
import { PriceRangeSlider } from './PriceRangeSlider'
import { apiClient } from '@/lib/api'
import { getProducts } from '@/data/data'

type FilterOption = {
  id: string
  name: string
  type: 'checkbox' | 'price-range' | 'radio'
  hugeIcon?: IconSvgElement
  // For checkbox type
  options?: { name: string; value: string }[]
  // For price-range type
  min?: number
  max?: number
}

// Fallback demo filters for other components
const demo_filters_options: FilterOption[] = [
  {
    id: 'categories',
    name: 'Categories',
    type: 'checkbox',
    hugeIcon: Note01Icon,
    options: [
      { name: 'Electronics', value: 'electronics' },
      { name: 'Clothing', value: 'clothing' },
      { name: 'Books', value: 'books' },
    ],
  },
  {
    id: 'colors',
    name: 'Colors',
    type: 'checkbox',
    hugeIcon: PaintBucketIcon,
    options: [
      { name: 'Black', value: 'black' },
      { name: 'White', value: 'white' },
      { name: 'Blue', value: 'blue' },
    ],
  },
  {
    id: 'sizes',
    name: 'Sizes',
    type: 'checkbox',
    hugeIcon: PackageDimensions01Icon,
    options: [
      { name: 'S', value: 's' },
      { name: 'M', value: 'm' },
      { name: 'L', value: 'l' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    type: 'price-range',
    min: 0,
    max: 1000,
    hugeIcon: DollarCircleIcon,
  },
]

type Props = {
  filterOptions?: FilterOption[]
  className?: string
}

export const FiltersMenuTabs = ({
  className,
}: Props) => {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoriesResponse = await apiClient.getCategories()
        let categories = []
        if (categoriesResponse?.success && categoriesResponse?.data) {
          categories = categoriesResponse.data
        } else if (categoriesResponse?.data) {
          categories = categoriesResponse.data
        } else if (Array.isArray(categoriesResponse)) {
          categories = categoriesResponse
        }

        // Fetch products to extract colors and sizes from variants
        const productsResponse = await getProducts({ per_page: 100 })
        const products = productsResponse || []
        
        // Extract unique colors and sizes from products
        const allColors = new Set<string>()
        const allSizes = new Set<string>()
        let minPrice = 0
        let maxPrice = 1000
        
        if (products.length > 0) {
          const prices = products.map((p: any) => parseFloat(p.price) || 0).filter((p: number) => p > 0)
          if (prices.length > 0) {
            minPrice = Math.min(...prices)
            maxPrice = Math.max(...prices)
          }
        }

        products.forEach((product: any) => {
          // Extract colors from variants or product data
          if (product.variants && Array.isArray(product.variants)) {
            product.variants.forEach((variant: any) => {
              if (variant.color) allColors.add(variant.color)
              if (variant.size) allSizes.add(variant.size)
            })
          }
          // Also check product-level attributes
          if (product.color) allColors.add(product.color)
          if (product.size) allSizes.add(product.size)
          if (product.colors && Array.isArray(product.colors)) {
            product.colors.forEach((color: string) => allColors.add(color))
          }
          if (product.sizes && Array.isArray(product.sizes)) {
            product.sizes.forEach((size: string) => allSizes.add(size))
          }
        })

        // Build dynamic filter options
        const dynamicFilters: FilterOption[] = [
          {
            id: 'categories',
            name: 'Categories',
            type: 'checkbox',
            hugeIcon: Note01Icon,
            options: categories.map((cat: any) => ({
              name: cat.name,
              value: cat.slug,
            })),
          },
          {
            id: 'colors',
            name: 'Colors',
            type: 'checkbox',
            hugeIcon: PaintBucketIcon,
            options: Array.from(allColors).map(color => ({
              name: color,
              value: color.toLowerCase(),
            })),
          },
          {
            id: 'sizes',
            name: 'Sizes',
            type: 'checkbox',
            hugeIcon: PackageDimensions01Icon,
            options: Array.from(allSizes).map(size => ({
              name: size,
              value: size.toLowerCase(),
            })),
          },
          {
            id: 'price',
            name: 'Price',
            type: 'price-range',
            min: Math.floor(minPrice),
            max: Math.ceil(maxPrice),
            hugeIcon: DollarCircleIcon,
          },
        ]

        // Filter out empty options
        const validFilters = dynamicFilters.filter(filter => {
          if (filter.type === 'checkbox') {
            return filter.options && filter.options.length > 0
          }
          return true
        })

        setFilterOptions(validFilters)
      } catch (error) {
        console.error('Failed to fetch filter data:', error)
        // Fallback to empty filters if API fails
        setFilterOptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchFilterData()
  }, [])

  const handleFormSubmit = async (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries())
    console.log('Form submitted with data:', formDataObject)
    
    // Here you can update the URL parameters to apply filters
    const searchParams = new URLSearchParams()
    Object.entries(formDataObject).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value.toString())
      }
    })
    
    // Update the URL to apply filters
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`
      window.history.pushState({}, '', newUrl)
      window.location.reload() // Reload to apply filters
    }
  }

  if (loading) {
    return (
      <div className={clsx('flex flex-wrap md:gap-x-4 md:gap-y-2', className)}>
        <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-24"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-20"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-16"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-18"></div>
      </div>
    )
  }

  if (!filterOptions || filterOptions.length === 0) {
    return <div>No filter options available</div>
  }

  return (
    <div className={clsx('flex flex-wrap md:gap-x-4 md:gap-y-2', className)}>
      {/* ALL FILTERS DIALOG */}
      <div className="shrink-0 md:hidden">
        <FiltersMenuDialog filterOptions={filterOptions} />
      </div>

      {/* POPOVER FILTERS */}
      <div className="hidden md:block">
        <Headless.PopoverGroup as={Form} action={handleFormSubmit}>
          <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
            {filterOptions.map((filterOption, index) => {
              if (!filterOption) {
                return null
              }

              const checkedNumber = index < 3 ? 2 : 0 // Example logic for checked number, replace with actual logic

              return (
                <Headless.Popover className="relative" key={index}>
                  <Headless.PopoverButton
                    className={clsx(
                      'relative flex items-center justify-center rounded-full px-4 py-2.5 text-sm select-none ring-inset group-data-open:ring-2 group-data-open:ring-black hover:bg-neutral-50 focus:outline-hidden dark:group-data-open:ring-white dark:hover:bg-neutral-900',
                      checkedNumber
                        ? 'ring-2 ring-black dark:ring-white'
                        : 'ring-1 ring-neutral-300 dark:ring-neutral-700'
                    )}
                  >
                    {filterOption.hugeIcon && <HugeiconsIcon icon={filterOption.hugeIcon} size={18} />}
                    <span className="ms-2">{filterOption.name}</span>
                    <ChevronDownIcon className="ms-3 size-4" />
                    {checkedNumber ? (
                      <span className="absolute top-0 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-black text-[0.65rem] font-semibold text-white ring-2 ring-white dark:bg-neutral-200 dark:text-neutral-900 dark:ring-neutral-900">
                        {checkedNumber}
                      </span>
                    ) : null}
                  </Headless.PopoverButton>

                  <Headless.PopoverPanel
                    transition
                    unmount={false}
                    className="absolute -start-5 top-full z-50 mt-3 w-sm transition data-closed:translate-y-1 data-closed:opacity-0"
                  >
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                      <div className="hidden-scrollbar max-h-[28rem] overflow-y-auto px-5 py-6">
                        {filterOption.type === 'checkbox' && (
                          <CheckboxGroup>
                            {filterOption.options?.map((option, i) => {
                              if (!option) return null
                              const isChecked = i < 2 // Example logic for checked state, replace with actual logic
                              return (
                                <CheckboxField key={option.name}>
                                  <Checkbox
                                    name={`${filterOption.id}[]`}
                                    value={option.value}
                                    defaultChecked={isChecked}
                                  />
                                  <Headless.Label className="text-sm/6">{option.name}</Headless.Label>
                                </CheckboxField>
                              )
                            })}
                          </CheckboxGroup>
                        )}
                        {filterOption.type === 'price-range' && (
                          <PriceRangeSlider
                            key={index}
                            min={filterOption.min ?? 0}
                            max={filterOption.max ?? 1000}
                            name={filterOption.name}
                          />
                        )}
                        {filterOption.type === 'radio' && (
                          <RadioGroup name={filterOption.id} defaultValue={filterOption.options?.[0]?.value}>
                            {filterOption.options?.map((option, i) => {
                              if (!option) return null
                              return (
                                <RadioField key={option.value}>
                                  <Radio value={option.value} />
                                  <Headless.Label className="text-sm/6">{option.name}</Headless.Label>
                                </RadioField>
                              )
                            })}
                          </RadioGroup>
                        )}
                      </div>

                      <div className="flex items-center justify-between rounded-b-2xl bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                        <Headless.CloseButton className="-mx-3" size="smaller" as={ButtonThird} type="button">
                          Cancel
                        </Headless.CloseButton>
                        <Headless.CloseButton size="smaller" as={ButtonPrimary} type="submit">
                          Apply
                        </Headless.CloseButton>
                      </div>
                    </div>
                  </Headless.PopoverPanel>
                </Headless.Popover>
              )
            })}
          </fieldset>
        </Headless.PopoverGroup>
      </div>
    </div>
  )
}

export const FiltersMenuSidebar = ({ filterOptions = demo_filters_options, className }: Props) => {
  const handleFormSubmit = async (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries())
    console.log('Form submitted with data:', formDataObject)
  }

  if (!filterOptions || filterOptions.length === 0) {
    return <div>No filter options available</div>
  }

  return (
    <>
      {/* ALL FILTERS DIALOG */}
      <div className="shrink-0 lg:hidden">
        <FiltersMenuDialog filterOptions={filterOptions} />
      </div>

      {/* SIDEBAR FILTERS */}
      <div className="hidden lg:block">
        <Form action={handleFormSubmit}>
          <fieldset className="w-full">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filterOptions?.map((filterOption) => {
                if (!filterOption) return null
                return (
                  <div key={filterOption.id} className="py-10 first:pt-0 last:pb-0">
                    <legend className="text-lg font-medium">{filterOption.name}</legend>
                    <div className="pt-7">
                      {filterOption.type === 'checkbox' && (
                        <CheckboxGroup>
                          {filterOption.options?.map((option, i) => {
                            if (!option) return null
                            const checked = i < 1 // Example logic for checked state, replace with actual logic
                            return (
                              <CheckboxField key={option.name}>
                                <Checkbox name={`${filterOption.id}[]`} value={option.value} defaultChecked={checked} />
                                <Headless.Label className="text-sm/6">{option.name}</Headless.Label>
                              </CheckboxField>
                            )
                          })}
                        </CheckboxGroup>
                      )}
                      {filterOption.type === 'price-range' && (
                        <PriceRangeSlider
                          min={filterOption.min ?? 0}
                          max={filterOption.max ?? 1000}
                          name={filterOption.name}
                        />
                      )}
                      {filterOption.type === 'radio' && (
                        <RadioGroup name={filterOption.id} defaultValue={filterOption.options?.[0]?.value}>
                          {filterOption.options?.map((option, i) => {
                            if (!option) return null
                            return (
                              <RadioField key={option.value}>
                                <Radio value={option.value} />
                                <Headless.Label className="text-sm/6">{option.name}</Headless.Label>
                              </RadioField>
                            )
                          })}
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </fieldset>
        </Form>
      </div>
    </>
  )
}

export function FiltersMenuDialog({ className, filterOptions = demo_filters_options }: Props) {
  const [showAllFilter, setShowAllFilter] = useState(false)

  const handleFormSubmit = async (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries())
    console.log(formDataObject)
  }

  if (!filterOptions || filterOptions.length === 0) {
    return <div>No filter options available</div>
  }

  const checkedNumber = 3 // Example logic for checked number, replace with actual logic
  return (
    <div className={clsx('shrink-0', className)}>
      <Headless.Button
        className={clsx(
          'relative flex items-center justify-center rounded-full px-4 py-2.5 text-sm select-none ring-inset group-data-open:ring-2 group-data-open:ring-black hover:bg-neutral-50 focus:outline-hidden dark:group-data-open:ring-white dark:hover:bg-neutral-900',
          checkedNumber ? 'ring-2 ring-black dark:ring-white' : 'ring-1 ring-neutral-300 dark:ring-neutral-700'
        )}
        onClick={() => setShowAllFilter(true)}
      >
        <HugeiconsIcon icon={FilterVerticalIcon} size={18} />
        <span className="ms-2">All filters</span>
        <ChevronDownIcon className="ms-3 size-4" />
        {checkedNumber ? (
          <span className="absolute top-0 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-black text-[0.65rem] font-semibold text-white ring-2 ring-white dark:bg-neutral-200 dark:text-neutral-900 dark:ring-neutral-900">
            {checkedNumber}
          </span>
        ) : null}
      </Headless.Button>

      <Headless.Dialog open={showAllFilter} onClose={setShowAllFilter} className="relative z-50">
        <Headless.DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 duration-200 ease-out data-closed:opacity-0"
        />
        <Form
          action={handleFormSubmit}
          className="fixed inset-0 flex max-h-screen w-screen items-center justify-center pt-3"
        >
          <Headless.DialogPanel
            className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white text-left align-middle shadow-xl duration-200 ease-out data-closed:translate-y-16 data-closed:opacity-0 dark:border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            transition
            as={'fieldset'}
          >
            <div className="relative shrink-0 border-b border-neutral-200 p-4 text-center sm:px-8 dark:border-neutral-800">
              <Headless.DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                Filters
              </Headless.DialogTitle>
              <div className="absolute end-2 top-2">
                <Headless.CloseButton
                  as={ButtonClose}
                  colorClassName="bg-white text-neutral-900 hover:bg-neutral-100"
                />
              </div>
            </div>

            <div className="hidden-scrollbar grow overflow-y-auto text-start">
              <div className="divide-y divide-neutral-200 px-4 sm:px-8 dark:divide-neutral-800">
                {filterOptions?.map((filterOption) => {
                  if (!filterOption) return null
                  return (
                    <div key={filterOption.id} className="py-7">
                      <p className="text-lg font-medium">{filterOption.name}</p>
                      <div className="mt-6">
                        {filterOption.type === 'checkbox' && (
                          <CheckboxGroup>
                            {filterOption.options?.map((option, i) => {
                              if (!option) return null
                              const checked = i < 2 // Example logic for checked state, replace with actual logic
                              return (
                                <CheckboxField key={option.name}>
                                  <Checkbox
                                    name={`${filterOption.id}[]`}
                                    value={option.value}
                                    defaultChecked={checked}
                                  />
                                  <Headless.Label className="text-sm/6">{option.name}</Headless.Label>
                                </CheckboxField>
                              )
                            })}
                          </CheckboxGroup>
                        )}
                        {filterOption.type === 'price-range' && (
                          <PriceRangeSlider
                            min={filterOption.min ?? 0}
                            max={filterOption.max ?? 1000}
                            name={filterOption.name}
                          />
                        )}
                        {filterOption.type === 'radio' && (
                          <RadioGroup name={filterOption.id} defaultValue={filterOption.options?.[0]?.value}>
                            {filterOption.options?.map((option, i) => {
                              if (!option) return null
                              return (
                                <RadioField key={option.value}>
                                  <Radio value={option.value} />
                                  <Headless.Label className="text-sm/6">{option.name}</Headless.Label>
                                </RadioField>
                              )
                            })}
                          </RadioGroup>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between bg-neutral-50 p-4 sm:px-8 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
              <Headless.CloseButton as={ButtonThird} size="smaller" className="-mx-2" type="button">
                Cancel
              </Headless.CloseButton>
              <Headless.CloseButton as={ButtonPrimary} size="smaller" type="submit">
                Apply filters
              </Headless.CloseButton>
            </div>
          </Headless.DialogPanel>
        </Form>
      </Headless.Dialog>
    </div>
  )
}

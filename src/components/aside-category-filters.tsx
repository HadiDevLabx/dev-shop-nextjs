'use client'

import { Checkbox, Disclosure, DisclosureButton, DisclosurePanel, Fieldset, Label, Legend } from '@headlessui/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Aside } from './aside/aside'
import { useFilters } from '@/contexts/FilterContext'
import { getCategories } from '@/data/data'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'

interface Props {
  className?: string
}

const AsideCategoryFilters = ({ className = '' }: Props) => {
  const { filters, updateFilter, clearFilters, applyFilters } = useFilters()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const staticFilters = [
    {
      id: 'colors',
      name: 'Colors',
      options: [
        { value: 'white', label: 'White' },
        { value: 'black', label: 'Black' },
        { value: 'blue', label: 'Blue' },
        { value: 'brown', label: 'Brown' },
        { value: 'green', label: 'Green' },
        { value: 'red', label: 'Red' },
      ],
    },
    {
      id: 'sizes',
      name: 'Sizes',
      options: [
        { value: 'xs', label: 'XS' },
        { value: 's', label: 'S' },
        { value: 'm', label: 'M' },
        { value: 'l', label: 'L' },
        { value: 'xl', label: 'XL' },
        { value: '2xl', label: '2XL' },
      ],
    },
  ]

  const dynamicFilters = [
    {
      id: 'categories',
      name: 'Categories',
      options: categories.map(cat => ({ value: cat.slug, label: cat.name }))
    },
    ...staticFilters
  ]

  const handleFilterChange = (filterId: string, value: string, checked: boolean) => {
    const currentValues = filters[filterId as keyof typeof filters] as string[] || []
    let newValues: string[]
    
    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }
    
    updateFilter(filterId as keyof typeof filters, newValues)
  }

  const isChecked = (filterId: string, value: string) => {
    const currentValues = filters[filterId as keyof typeof filters] as string[] || []
    return currentValues.includes(value)
  }

  return (
    <Aside openFrom="right" type="category-filters" heading="Filters" contentMaxWidthClassName="max-w-sm">
      <div className={clsx('flex h-full flex-col', className)}>
        <div className="hidden-scrollbar flex-1 overflow-x-hidden overflow-y-auto">
          <div className="flow-root">
            {/* Price Range */}
            <div className="border-b border-neutral-200 pt-4 pb-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-4">Price Range</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: Number(e.target.value) || 1000 })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Filters */}
            {dynamicFilters.map((section) => (
              <Disclosure key={section.name} as="div" className="border-b border-neutral-200 pt-4 pb-4" defaultOpen>
                <Fieldset>
                  <Legend className="w-full">
                    <DisclosureButton className="group flex w-full items-center justify-between p-2 text-neutral-400 hover:text-neutral-500">
                      <p className="text-sm font-medium text-neutral-900">{section.name}</p>
                      <span className="ms-6 flex h-7 items-center">
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          className="size-5 shrink-0 group-data-open:-rotate-180"
                          size={16}
                          color="currentColor"
                          strokeWidth={1.5}
                        />
                      </span>
                    </DisclosureButton>
                  </Legend>
                  <DisclosurePanel className="px-4 pt-4 pb-2">
                    <div className="space-y-2">
                      {section.options.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <Checkbox
                            checked={isChecked(section.id, option.value)}
                            onChange={(checked) => handleFilterChange(section.id, option.value, checked)}
                            className="mr-3"
                          />
                          <Label className="text-sm text-neutral-600 cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Fieldset>
              </Disclosure>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-neutral-200 p-4 space-y-3">
          <ButtonPrimary onClick={applyFilters} className="w-full">
            Apply Filters
          </ButtonPrimary>
          <ButtonSecondary onClick={clearFilters} className="w-full">
            Clear All
          </ButtonSecondary>
        </div>
      </div>
    </Aside>
  )
}

export default AsideCategoryFilters

'use client'

import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import Nav from '@/shared/Nav/Nav'
import NavItem from '@/shared/Nav/NavItem'
import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { FilterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FC, useState, useEffect } from 'react'
import { Divider } from './Divider'
import { FilterSortByMenuListBox } from './FilterSortByMenu'
import { FiltersMenuTabs } from './FiltersMenu'
import Heading from './Heading/Heading'
import { getCategories } from '@/data/data'
import { useRouter } from 'next/navigation'

export interface HeaderFilterSectionProps {
  className?: string
  heading?: string
}

const HeaderFilterSection: FC<HeaderFilterSectionProps> = ({ className = 'mb-12', heading }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [tabActive, setTabActive] = useState('All Items')
  const [categories, setCategories] = useState<any[]>([{ name: 'All Items', slug: 'all' }])
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiCategories = await getCategories()
        if (apiCategories && apiCategories.length > 0) {
          const allCategories = [{ name: 'All Items', slug: 'all' }, ...apiCategories]
          setCategories(allCategories)
          setTabActive(allCategories[0].name)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (categoryName: string) => {
    setTabActive(categoryName)
    
    const category = categories.find(cat => cat.name === categoryName)
    if (category) {
      router.push(`/collections/${category.slug}`)
    }
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      {heading && <Heading className="mb-8 sm:mb-10 lg:mb-12 text-neutral-900 dark:text-neutral-50">{heading}</Heading>}
      <div className="flex flex-col gap-y-4 sm:gap-y-6 lg:flex-row lg:justify-between lg:items-center lg:gap-x-2 lg:gap-y-0">
        {/* <Nav className="sm:gap-x-2">
          {categories.map((category, index) => (
            <NavItem key={index} isActive={tabActive === category.name} onClick={() => handleCategoryClick(category.name)}>
              {category.name}
            </NavItem>
          ))}
        </Nav> */}

        <span className="flex justify-center lg:justify-start lg:shrink-0">
          <ButtonPrimary
            size="smaller"
            onClick={() => {
              setIsOpen(!isOpen)
            }}
            className="w-full sm:w-auto"
          >
            <HugeiconsIcon icon={FilterIcon} size={20} className="-ml-1 sm:size-[22px]" color="currentColor" strokeWidth={1.5} />
            <span className="ml-2">Filter</span>
            <ChevronDownIcon className={`size-4 sm:size-5 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </ButtonPrimary>
        </span>
      </div>

      <Transition
        as={'div'}
        show={isOpen}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Divider className="my-6 sm:my-8" />
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-2.5">
          <div className="flex-1 sm:flex-initial">
            <FiltersMenuTabs />
          </div>
          <div className="sm:ml-auto">
            <FilterSortByMenuListBox className="" />
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default HeaderFilterSection

'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterState {
  categories: string[]
  colors: string[]
  sizes: string[]
  priceRange: { min: number; max: number }
  sortBy: string
  search: string
}

interface FilterContextType {
  filters: FilterState
  updateFilter: (key: keyof FilterState, value: any) => void
  clearFilters: () => void
  applyFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const initialFilters: FilterState = {
  categories: [],
  colors: [],
  sizes: [],
  priceRange: { min: 0, max: 1000 },
  sortBy: 'newest',
  search: ''
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize from URL params
    return {
      categories: searchParams.get('categories')?.split(',') || [],
      colors: searchParams.get('colors')?.split(',') || [],
      sizes: searchParams.get('sizes')?.split(',') || [],
      priceRange: {
        min: Number(searchParams.get('min_price')) || 0,
        max: Number(searchParams.get('max_price')) || 1000
      },
      sortBy: searchParams.get('sort_by') || 'newest',
      search: searchParams.get('search') || ''
    }
  })

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
    // Use router to navigate to current path without query params
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/products'
    router.push(currentPath)
  }, [router])

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    }
    if (filters.colors.length > 0) {
      params.set('colors', filters.colors.join(','))
    }
    if (filters.sizes.length > 0) {
      params.set('sizes', filters.sizes.join(','))
    }
    if (filters.priceRange.min > 0) {
      params.set('min_price', filters.priceRange.min.toString())
    }
    if (filters.priceRange.max < 1000) {
      params.set('max_price', filters.priceRange.max.toString())
    }
    if (filters.sortBy !== 'newest') {
      params.set('sort_by', filters.sortBy)
    }
    if (filters.search) {
      params.set('search', filters.search)
    }

    const queryString = params.toString()
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/products'
    const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath
    router.push(newUrl)
  }, [filters, router])

  return (
    <FilterContext.Provider value={{ filters, updateFilter, clearFilters, applyFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}
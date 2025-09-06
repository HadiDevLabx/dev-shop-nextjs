export async function getNavigation(): Promise<TNavigationItem[]> {
  const staticStartItems = [
    {
      id: '1',
      href: '/',
      name: 'Home',
    },
  ]

  const staticEndItems = [
    {
      id: 'about',
      href: '/about',
      name: 'About',
    },
    {
      id: 'contact',
      href: '/contact',
      name: 'Contact',
    },
  ]

  try {
    const { apiClient } = await import('@/lib/api')
    const response = await apiClient.getCategories()
    
    if (response && Array.isArray(response)) {
      const categoryItems = response.map((category: any) => ({
        id: `nav-${category.id}`,
        href: `/collections/${category.slug}`,
        name: category.name,
      }))
      
      return [...staticStartItems, ...categoryItems, ...staticEndItems]
    }
  } catch (error) {
    console.warn('Failed to fetch categories for navigation:', error)
  }

  // Fallback navigation
  return [
    ...staticStartItems,
    {
      id: 'shirts',
      href: '/collections/shirts',
      name: 'Shirts',
    },
    {
      id: 'jeans',
      href: '/collections/jeans',
      name: 'Jeans',
    },
    {
      id: 'jackets',
      href: '/collections/jackets',
      name: 'Jackets',
    },
    ...staticEndItems,
  ]
}

export async function getNavMegaMenu(): Promise<TNavigationItem> {
  try {
    const { apiClient } = await import('@/lib/api')
    const response = await apiClient.getCategories()
    
    if (response && Array.isArray(response)) {
      // Create a mega menu with categories
      const categoryGroups = response.map((category: any) => ({
        id: `mega-${category.id}`,
        name: category.name,
        href: `/collections/${category.slug}`,
        children: []
      }))

      return {
        id: 'shop-megamenu',
        name: 'Shop',
        href: '/collections/all',
        type: 'mega-menu',
        children: [
          {
            id: 'categories-group',
            name: 'Categories',
            href: '#',
            children: categoryGroups.slice(0, 8) // Limit to 8 categories for display
          }
        ]
      }
    }
  } catch (error) {
    console.warn('Failed to fetch categories for mega menu:', error)
  }

  // Fallback mega menu
  return {
    id: 'shop-megamenu',
    name: 'Shop',
    href: '/collections/all',
    type: 'mega-menu',
    children: [
      {
        id: 'categories-group',
        name: 'Categories',
        href: '#',
        children: [
          {
            id: 'shirts',
            name: 'Shirts',
            href: '/collections/shirts',
          },
          {
            id: 'jeans',
            name: 'Jeans',
            href: '/collections/jeans',
          },
          {
            id: 'jackets',
            name: 'Jackets',
            href: '/collections/jackets',
          }
        ]
      }
    ]
  }
}

// ============ TYPE =============
export type TNavigationItem = Partial<{
  id: string
  href: string
  name: string
  type?: 'dropdown' | 'mega-menu'
  isNew?: boolean
  children?: TNavigationItem[]
}>

export const getLanguages = async () => {
  return [
    {
      id: 'English',
      name: 'English',
      description: 'United State',
      href: '#',
      active: true,
    },
    {
      id: 'Vietnamese',
      name: 'Vietnamese',
      description: 'Vietnamese',
      href: '#',
    },
    {
      id: 'Francais',
      name: 'Francais',
      description: 'Belgique',
      href: '#',
    },
    {
      id: 'Francais',
      name: 'Francais',
      description: 'Canada',
      href: '#',
    },
    {
      id: 'Francais',
      name: 'Francais',
      description: 'Belgique',
      href: '#',
    },
    {
      id: 'Francais',
      name: 'Francais',
      description: 'Canada',
      href: '#',
    },
  ]
}
export const getCurrencies = async () => {
  return [
    {
      id: 'EUR',
      name: 'EUR',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#000000" strokeWidth="1.5"></path>
    <path d="M15 14.4923C14.5216 15.3957 13.6512 16 12.6568 16C11.147 16 9.92308 14.6071 9.92308 12.8889V11.1111C9.92308 9.39289 11.147 8 12.6568 8C13.6512 8 14.5216 8.60426 15 9.50774M9 12H12.9231" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
      active: true,
    },
    {
      id: 'USD',
      name: 'USD',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#000000" strokeWidth="1.5"></path>
    <path d="M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
    },
    {
      id: 'GBF',
      name: 'GBF',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 12H13.2M9 12V9.2963C9 8.82489 9 8.58919 9.14645 8.44274C9.29289 8.2963 9.5286 8.2963 10 8.2963H13.2C14.1941 8.2963 15 9.1254 15 10.1481C15 11.1709 14.1941 12 13.2 12M9 12V14.7037C9 15.1751 9 15.4108 9.14645 15.5572C9.29289 15.7037 9.5286 15.7037 10 15.7037H13.2C14.1941 15.7037 15 14.8746 15 13.8518C15 12.8291 14.1941 12 13.2 12M10.4938 8.2963V7M10.4938 17V15.7037M12.8982 8.2963V7M12.8982 17V15.7037" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg>`,
    },
    {
      id: 'SAR',
      name: 'SAR',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#000000" strokeWidth="1.5"></path>
    <path d="M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
    },
    {
      id: 'QAR',
      name: 'QAR',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 7.5C9.2 8.41667 10.08 10.5 12 11.5M12 11.5C13.92 10.5 14.8 8.41667 15 7.5M12 11.5V16.5M14.5 13.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>`,
    },
    {
      id: 'BAD',
      name: 'BAD',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#000000" strokeWidth="1.5"></path>
    <path d="M9 7.5C9.2 8.41667 10.08 10.5 12 11.5M12 11.5C13.92 10.5 14.8 8.41667 15 7.5M12 11.5V16.5M14.5 13.5H9.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>`,
    },
  ]
}

export const getHeaderDropdownCategories = async () => {
  try {
    const { apiClient } = await import('@/lib/api')
    const response = await apiClient.getCategories()
    
    if (response && Array.isArray(response)) {
      // Category-specific icons mapping
      const categoryIcons: { [key: string]: string } = {
        'shirts': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2H8C7.44772 2 7 2.44772 7 3V7C7 7.55228 7.44772 8 8 8H8.5V21C8.5 21.5523 8.94772 22 9.5 22H14.5C15.0523 22 15.5 21.5523 15.5 21V8H16C16.5523 8 17 7.55228 17 7V3C17 2.44772 16.5523 2 16 2Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M7 6L5 8V12L7 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M17 6L19 8V12L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        'jeans': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2H16V8L14 22H10L8 8V2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 8H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M10 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M11 18H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        'jackets': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3V7L6 9V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V9L16 7V3C16 2.4 15.6 2 15 2H9C8.4 2 8 2.4 8 3Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 7L5 10V15L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M16 7L19 10V15L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M10 10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M12 10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M14 10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        'shoes': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V16H2V18Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M2 16L4 14L8 12L12 10L16 12L20 14L22 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 12V8C8 6.89543 8.89543 6 10 6H12C13.1046 6 14 6.89543 14 8V10" stroke="currentColor" stroke-width="1.5"/>
        </svg>`,
        'accessories': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M20 24H4C2.89543 24 2 23.1046 2 22V14C2 12.8954 2.89543 12 4 12H20C21.1046 12 22 12.8954 22 14V22C22 23.1046 21.1046 24 20 24Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        'dresses': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2H16V8L18 22H6L8 8V2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 8H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M10 4H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
      }
      
      return response.map((category: any) => {
        const categoryKey = category.slug?.toLowerCase() || category.name?.toLowerCase()
        const icon = categoryIcons[categoryKey] || categoryIcons['shirts'] // Default to shirt icon
        
        return {
          name: category.name,
          handle: category.slug,
          description: category.description || 'Explore our collection',
          icon: icon,
        }
      })
    }
  } catch (error) {
    console.warn('Failed to fetch categories for header dropdown:', error)
  }

  // Fallback categories with better icons
  return [
    {
      name: 'Shirts',
      handle: 'shirts',
      description: 'Comfortable shirts for everyday wear',
      icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2H8C7.44772 2 7 2.44772 7 3V7C7 7.55228 7.44772 8 8 8H8.5V21C8.5 21.5523 8.94772 22 9.5 22H14.5C15.0523 22 15.5 21.5523 15.5 21V8H16C16.5523 8 17 7.55228 17 7V3C17 2.44772 16.5523 2 16 2Z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M7 6L5 8V12L7 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M17 6L19 8V12L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
    },
    {
      name: 'Jeans',
      handle: 'jeans',
      description: 'Premium denim jeans',
      icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2H16V8L14 22H10L8 8V2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 8H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M10 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M11 18H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
    },
    {
      name: 'Jackets',
      handle: 'jackets',
      description: 'Stylish jackets for all seasons',
      icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3V7L6 9V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V9L16 7V3C16 2.4 15.6 2 15 2H9C8.4 2 8 2.4 8 3Z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 7L5 10V15L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M16 7L19 10V15L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M10 10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M14 10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
    },
  ]
}

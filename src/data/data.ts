import avatarImage1 from '@/images/users/avatar1.jpg'
import avatarImage2 from '@/images/users/avatar2.jpg'
import avatarImage3 from '@/images/users/avatar3.jpg'
import avatarImage4 from '@/images/users/avatar4.jpg'
import { apiClient } from '@/lib/api'

export async function getOrder(number: string) {
  try {
    const response = await apiClient.getOrder(number)
    return response
  } catch (error) {
    console.warn('Failed to fetch order from API:', error)
    return null
  }
}

export async function getOrders() {
  try {
    const response = await apiClient.getOrders()
    return response || []
  } catch (error) {
    console.warn('Failed to fetch orders from API:', error)
    return []
  }
}

export async function getCountries() {
  return [
    {
      name: 'Canada',
      code: 'CA',
      flagUrl: '/flags/ca.svg',
      regions: [
        'Alberta',
        'British Columbia',
        'Manitoba',
        'New Brunswick',
        'Newfoundland and Labrador',
        'Northwest Territories',
        'Nova Scotia',
        'Nunavut',
        'Ontario',
        'Prince Edward Island',
        'Quebec',
        'Saskatchewan',
        'Yukon',
      ],
    },
    {
      name: 'Mexico',
      code: 'MX',
      flagUrl: '/flags/mx.svg',
      regions: [
        'Aguascalientes',
        'Baja California',
        'Baja California Sur',
        'Campeche',
        'Chiapas',
        'Chihuahua',
        'Ciudad de Mexico',
        'Coahuila',
        'Colima',
        'Durango',
        'Guanajuato',
        'Guerrero',
        'Hidalgo',
        'Jalisco',
        'Mexico State',
        'Michoacán',
        'Morelos',
        'Nayarit',
        'Nuevo León',
        'Oaxaca',
        'Puebla',
        'Querétaro',
        'Quintana Roo',
        'San Luis Potosí',
        'Sinaloa',
        'Sonora',
        'Tabasco',
        'Tamaulipas',
        'Tlaxcala',
        'Veracruz',
        'Yucatán',
        'Zacatecas',
      ],
    },
    {
      name: 'United States',
      code: 'US',
      flagUrl: '/flags/us.svg',
      regions: [
        'Alabama',
        'Alaska',
        'American Samoa',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Washington DC',
        'Micronesia',
        'Florida',
        'Georgia',
        'Guam',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Marshall Islands',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Northern Mariana Islands',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Palau',
        'Pennsylvania',
        'Puerto Rico',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'U.S. Virgin Islands',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
        'Armed Forces Americas',
        'Armed Forces Europe',
        'Armed Forces Pacific',
      ],
    },
  ]
}

 
export async function getProductReviews(handle: string) {
  try {
    const response = await apiClient.getProductByHandle(handle)
    if (response?.success && response?.data?.reviews?.length > 0) {
      return response.data.reviews.map((review: any, index: number) => ({
        id: review.id.toString(),
        title: review.title || 'Great product!',
        rating: review.rating || 5,
        content: `<p>${review.comment || review.content || 'Excellent quality and fast delivery!'}</p>`,
        author: review.user?.name || review.author || 'Anonymous',
        authorAvatar: [avatarImage1, avatarImage2, avatarImage3, avatarImage4][index % 4],
        date: new Date(review.created_at || Date.now()).toLocaleDateString(),
        datetime: review.created_at || new Date().toISOString(),
        isVerifiedPurchase: review.is_verified_purchase ?? true,
      }))
    }
  } catch (error) {
    console.warn('Failed to fetch reviews from API:', error)
  }

  return []
}
 

export async function getCart(id: string) {
  try {
    const response = await apiClient.getCart()
    return response
  } catch (error) {
    console.warn('Failed to fetch cart from API:', error)
    return null
  }
}

export async function getCategories() {
  try {
    const response = await apiClient.getCategories()
    if (response && Array.isArray(response)) {
      return response.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || 'Explore our collection',
        is_active: category.is_active,
      }))
    }
  } catch (error) {
    console.warn('Failed to fetch categories from API:', error)
  }
  return []
}

export async function getCollections() {
  try {
    const response = await apiClient.getCategories()
    if (response && Array.isArray(response)) {
      return response.map((category: any) => ({
        id: `gid://${category.id}`,
        title: category.name,
        handle: category.slug,
        description: category.description || 'Explore our collection',
        sortDescription: 'From API',
        color: 'bg-indigo-50',
        count: 0,
        image: {
          src: category.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          width: 400,
          height: 300,
          alt: category.name,
        },
      }))
    }
  } catch (error) {
    console.warn('Failed to fetch collections from API:', error)
  }

  // Return empty array if API fails
  return []
}

export async function getCollectionByHandle(handle: string) {
  // Check if handle is provided and valid
  if (!handle || typeof handle !== 'string' || handle.trim() === '') {
    console.warn('Invalid or empty handle provided to getCollectionByHandle:', handle)
    return null
  }
  
  // lowercase handle
  handle = handle.toLowerCase().trim()
  
  // Handle special case for 'all' collections
  if (handle === 'all') {
    return {
      id: 'gid://all',
      title: 'All Products',
      handle: 'all',
      description: 'Explore our entire collection of products',
      sortDescription: 'All products',
      color: 'bg-indigo-50',
      count: 0,
      image: {
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        width: 400,
        height: 300,
        alt: 'All Products',
      },
    }
  }

  try {
    const response = await apiClient.getCategoryBySlug(handle)
    if (response) {
      return {
        id: `gid://${response.id}`,
        title: response.name,
        handle: response.slug,
        description: response.description || 'Explore our collection',
        sortDescription: 'From API',
        color: 'bg-indigo-50',
        count: response.products?.length || 0,
        image: {
          src: response.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          width: 400,
          height: 300,
          alt: response.name,
        },
      }
    }
  } catch (error) {
    console.warn('Failed to fetch collection from API:', error)
  }

  // Return fallback collection instead of null to prevent 404
  return {
    id: `gid://${handle}`,
    title: handle.charAt(0).toUpperCase() + handle.slice(1),
    handle: handle,
    description: `Browse our ${handle} collection`,
    sortDescription: 'Category',
    color: 'bg-indigo-50',
    count: 0,
    image: {
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      width: 400,
      height: 300,
      alt: handle.charAt(0).toUpperCase() + handle.slice(1),
    },
  }
}

export async function getGroupCollections() {
  try {
    const response = await apiClient.getCategories()
    console.log('Categories API response:', response) // Debug log
    
    // Handle different response formats from Laravel API
    let categories = []
    if (response?.success && response?.data) {
      categories = response.data
    } else if (response?.data) {
      categories = response.data
    } else if (Array.isArray(response)) {
      categories = response
    }
    
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const allCollections = await getCollections()
      
      // Add "All Items" as the first category
      const groupCollections = [{
        id: 'all-items',
        title: 'All Items',
        handle: 'all',
        description: 'Browse all our products',
        iconSvg: `<svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        collections: allCollections.slice(0, 6),
      }]
      
      // Add dynamic categories from API
      const dynamicGroups = categories.map((category: any) => ({
        id: `group-${category.id}`,
        title: category.name,
        handle: category.slug,
        description: category.description || `Explore our ${category.name} collection`,
        iconSvg: `<svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.866 8.13401 16 12 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 16V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 19H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        collections: allCollections.filter(c => 
          c.handle === category.slug || 
          c.title?.toLowerCase().includes(category.name?.toLowerCase())
        ).slice(0, 6),
      }))
      
      return [...groupCollections, ...dynamicGroups]
    }
  } catch (error) {
    console.error('Failed to fetch group collections from API:', error)
  }

  // Return empty array if API fails
  return []
}

export async function getProducts(params?: {
  search?: string
  category?: string
  colors?: string
  sizes?: string
  min_price?: number
  max_price?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}) {
  try {
    const response = await apiClient.getProducts(params)
    if (response && response.data) {
      // Transform backend products to frontend format
      return response.data.map((product: any) => ({
        id: `gid://${product.id}`,
        title: product.name,
        handle: product.slug,
        createdAt: product.created_at,
        vendor: product.category?.name || 'Store',
        price: parseFloat(product.sale_price || product.price),
        compareAtPrice: product.sale_price ? parseFloat(product.price) : undefined,
        featuredImage: {
          src: product.featured_image || product.images?.[0] || '/images/placeholder-small.png',
          width: 400,
          height: 400,
          alt: product.name,
        },
        images: (product.images || []).map((img: string) => ({
          src: img,
          width: 400,
          height: 400,
          alt: product.name,
        })),
        reviewNumber: parseInt(product.review_count) || 0,
        rating: parseFloat(product.rating) ? parseFloat(parseFloat(product.rating).toFixed(1)) : 0,
        status: product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
        options: [
          {
            name: 'Color',
            optionValues: [
              { name: 'Black', swatch: { color: '#000000', image: null } },
              { name: 'White', swatch: { color: '#ffffff', image: null } },
              { name: 'Navy', swatch: { color: '#1e3a8a', image: null } },
              { name: 'Gray', swatch: { color: '#6b7280', image: null } },
              { name: 'Brown', swatch: { color: '#8B4513', image: null } },
            ],
          },
          {
            name: 'Size',
            optionValues: [
              { name: 'S', swatch: null },
              { name: 'M', swatch: null },
              { name: 'L', swatch: null },
              { name: 'XL', swatch: null },
            ],
          },
        ],
        selectedOptions: [
          { name: 'Color', value: 'Black' },
          { name: 'Size', value: 'M' },
        ],
      }))
    }
  } catch (error) {
    console.error('Failed to fetch products from API:', error)
  }
  
  // Return empty array if API fails
  return []
}

export async function getProductByHandle(handle: string) {
  // Check if handle is provided and valid
  if (!handle || typeof handle !== 'string' || handle.trim() === '') {
    console.warn('Invalid or empty handle provided to getProductByHandle:', handle)
    return null
  }
  
  // lowercase handle
  handle = handle.toLowerCase().trim()

  try {
    const response = await apiClient.getProduct(handle)
    if (response) {
      const product = response
      return {
        id: `gid://${product.id}`,
        title: product.name,
        handle: product.slug,
        createdAt: product.created_at,
        vendor: product.category?.name || 'Store',
        price: parseFloat(product.sale_price || product.price),
        compareAtPrice: product.sale_price ? parseFloat(product.price) : undefined,
        featuredImage: {
          src: product.featured_image || product.images?.[0] || '/images/placeholder-small.png',
          width: 400,
          height: 400,
          alt: product.name,
        },
        images: (product.images || []).map((img: string) => ({
          src: img,
          width: 400,
          height: 400,
          alt: product.name,
        })),
        reviewNumber: parseInt(product.review_count) || 0,
        rating: parseFloat(product.rating) ? parseFloat(parseFloat(product.rating).toFixed(1)) : 0,
        status: product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
        options: [
          {
            name: 'Color',
            optionValues: [
              { name: 'Black', swatch: { color: '#000000', image: null } },
              { name: 'White', swatch: { color: '#ffffff', image: null } },
              { name: 'Navy', swatch: { color: '#1e3a8a', image: null } },
              { name: 'Gray', swatch: { color: '#6b7280', image: null } },
              { name: 'Brown', swatch: { color: '#8B4513', image: null } },
            ],
          },
          {
            name: 'Size',
            optionValues: [
              { name: 'S', swatch: null },
              { name: 'M', swatch: null },
              { name: 'L', swatch: null },
              { name: 'XL', swatch: null },
            ],
          },
        ],
        selectedOptions: [
          { name: 'Color', value: 'Black' },
          { name: 'Size', value: 'M' },
        ],
      }
    } else {
      console.log('API response indicates failure or no data')
    }
  } catch (error) {
    console.warn('Failed to fetch product from API:', error)
  }

  // Return null if not found
  console.log('Returning null - product not found')
  return null
}

export async function getProductDetailByHandle(handle: string) {
  // Check if handle is provided and valid
  if (!handle || typeof handle !== 'string' || handle.trim() === '') {
    console.warn('Invalid or empty handle provided to getProductDetailByHandle:', handle)
    return null
  }
  
  handle = handle.toLowerCase().trim()

  try {
    const response = await apiClient.getProductByHandle(handle)
    
    if (response?.success && response?.data) {
      const product = response.data
      
      const avgRating = product.reviews?.length > 0 ? 
        product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length : 4.5
      
      return {
        id: `gid://${product.id}`,
        title: product.name,
        handle: product.slug,
        description: product.description || 'Premium quality product with excellent craftsmanship and attention to detail.',
        price: parseFloat(product.sale_price || product.price),
        compareAtPrice: product.sale_price ? parseFloat(product.price) : undefined,
        status: product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
        rating: avgRating,
        reviewNumber: product.reviews?.length || 0,
        featuredImage: {
          src: product.featured_image || product.images?.[0] || '/images/placeholder-small.png',
          alt: product.name,
          width: 400,
          height: 400,
        },
        images: (product.images || []).map((img: string) => ({
          src: img,
          alt: product.name,
          width: 400,
          height: 400,
        })),
        breadcrumbs: [
          { id: 1, name: 'Home', href: '/' },
          { id: 2, name: product.category?.name || 'Products', href: `/collections/${product.category?.slug || 'all'}` },
        ],
        options: [
          {
            name: 'Color',
            optionValues: [
              { name: 'Black', swatch: { color: '#000000', image: null } },
              { name: 'White', swatch: { color: '#ffffff', image: null } },
              { name: 'Gray', swatch: { color: '#6b7280', image: null } },
            ],
          },
          {
            name: 'Size',
            optionValues: [
              { name: 'S', swatch: null },
              { name: 'M', swatch: null },
              { name: 'L', swatch: null },
              { name: 'XL', swatch: null },
            ],
          },
        ],
        selectedOptions: [
          { name: 'Color', value: 'Black' },
          { name: 'Size', value: 'M' },
        ],
      }
    }
  } catch (error) {
    console.warn('Failed to fetch product detail from API:', error)
  }

  return null
}

// Helper function to get color hex values
function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'brown': '#8B4513',
    'navy': '#000080',
    'blue': '#0000ff',
    'red': '#ff0000',
    'green': '#008000',
    'yellow': '#ffff00',
    'pink': '#ffc0cb',
    'purple': '#800080',
    'orange': '#ffa500',
    'beige': '#f5f5dc',
    'cream': '#fffdd0',
    'tan': '#d2b48c',
  }
  
  // Safely handle color conversion
  if (!color || typeof color !== 'string') {
    return '#000000'
  }
  
  return colorMap[color.toLowerCase()] || '#000000'
}

// COMMON Types ------------------------------------------------------------------------
export type TCollection = Partial<Awaited<ReturnType<typeof getCollections>>[number]>
export type TProductItem = Partial<Awaited<ReturnType<typeof getProducts>>[number]>
export type TProductDetail = Partial<Awaited<ReturnType<typeof getProductDetailByHandle>>>
export type TCardProduct = {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
  variant?: any
}
 
export type TReview = Partial<Awaited<ReturnType<typeof getProductReviews>>[number]>
export type TOrder = Partial<Awaited<ReturnType<typeof getOrders>>[number]>

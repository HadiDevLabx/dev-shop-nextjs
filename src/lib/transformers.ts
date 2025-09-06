import { TProductItem, TCollection } from '@/data/data'

// Transform Laravel product to Dev Lab format
export function transformProduct(laravelProduct: any): TProductItem {
  // Handle images - your API returns images as array of strings
  const images = laravelProduct.images || []
  const mainImage = laravelProduct.image || images[0]
  
  // Extract colors and sizes from variants if available
  const colors = laravelProduct.variants?.map((v: any) => v.color).filter(Boolean) || 
                laravelProduct.variantsConfig?.colors || 
                ['Black', 'White', 'Gray']
  const sizes = laravelProduct.variants?.map((v: any) => v.size).filter(Boolean) || 
               laravelProduct.variantsConfig?.sizes || 
               ['S', 'M', 'L', 'XL']
  
  // Remove duplicates
  const uniqueColors = [...new Set(colors)]
  const uniqueSizes = [...new Set(sizes)]

  return {
    id: `gid://${laravelProduct.id}`,
    title: laravelProduct.name,
    handle: laravelProduct.handle,
    price: parseFloat(laravelProduct.price) || 0,
    vendor: laravelProduct.category?.name || 'Store',
    featuredImage: mainImage ? {
      src: mainImage,
      alt: laravelProduct.name,
      width: 400,
      height: 400,
    } : undefined,
    images: images.map((img: string) => ({
      src: img,
      alt: laravelProduct.name,
      width: 400,
      height: 400,
    })),
    rating: parseFloat(laravelProduct.rating) || 0,
    reviewNumber: parseInt(laravelProduct.review_count) || 0,
    review_count: parseInt(laravelProduct.review_count) || 0,
    status: laravelProduct.isFeatured ? 'Featured' : 'New in',
    options: [
      {
        name: 'Color',
        optionValues: uniqueColors.map(color => ({
          name: String(color),
          swatch: {
            color: getColorHex(String(color)),
            image: null,
          },
        })),
      },
      {
        name: 'Size',
        optionValues: uniqueSizes.map(size => ({
          name: String(size),
          swatch: null,
        })),
      },
    ],
    selectedOptions: [
      {
        name: 'Color',
        value: uniqueColors[0] || 'Black',
      },
      {
        name: 'Size',
        value: uniqueSizes[0] || 'M',
      },
    ],
  }
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
  
  return colorMap[String(color).toLowerCase()] || '#000000'
}

// Transform Laravel category to Dev Lab format
export function transformCategory(laravelCategory: any): TCollection {
  return {
    id: `gid://category-${laravelCategory.id}`,
    title: laravelCategory.name,
    handle: laravelCategory.slug,
    description: laravelCategory.description || '',
    count: laravelCategory.products?.length || 0,
    image: laravelCategory.image ? {
      src: laravelCategory.image,
      alt: laravelCategory.name,
      width: 400,
      height: 400,
    } : undefined,
    color: 'bg-indigo-50',
    sortDescription: 'Popular items',
  }
}

// Transform multiple products
export function transformProducts(laravelProducts: any[]): TProductItem[] {
  return laravelProducts.map(transformProduct)
}

// Transform multiple categories
export function transformCategories(laravelCategories: any[]): TCollection[] {
  return laravelCategories.map(transformCategory)
}
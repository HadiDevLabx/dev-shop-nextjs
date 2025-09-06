/**
 * Safely formats a price value to a fixed decimal string
 * Handles both string and number inputs
 * @param price - The price value (can be string, number, or undefined)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string
 */
export function formatPrice(price: string | number | undefined | null, decimals: number = 2): string {
  if (price === null || price === undefined) {
    return '0.00'
  }
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  
  if (isNaN(numericPrice)) {
    return '0.00'
  }
  
  return numericPrice.toFixed(decimals)
}

/**
 * Safely formats a price value with currency symbol
 * @param price - The price value (can be string, number, or undefined)
 * @param currency - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string with currency
 */
export function formatCurrency(
  price: string | number | undefined | null, 
  currency: string = '$', 
  decimals: number = 2
): string {
  return `${currency}${formatPrice(price, decimals)}`
}

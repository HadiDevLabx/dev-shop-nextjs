// Test API connection
export async function testApiConnection() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/health-check')
    const data = await response.json()
    console.log('API Health Check:', data)
    return data
  } catch (error) {
    console.error('API Connection Error:', error)
    return null
  }
}

export async function testProductApi() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/products/handle/product-3')
    const data = await response.json()
    console.log('Product API Test:', data)
    return data
  } catch (error) {
    console.error('Product API Error:', error)
    return null
  }
}
'use client'

import { useState } from 'react'
import { testApiConnection, testProductApi } from '@/lib/test-api'

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [productData, setProductData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testHealth = async () => {
    setLoading(true)
    const result = await testApiConnection()
    setHealthStatus(result)
    setLoading(false)
  }

  const testProduct = async () => {
    setLoading(true)
    const result = await testProductApi()
    setProductData(result)
    setLoading(false)
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={testHealth}
            disabled={loading}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Health Check'}
          </button>
          {healthStatus && (
            <pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          )}
        </div>

        <div>
          <button 
            onClick={testProduct}
            disabled={loading}
            className="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Product API'}
          </button>
          {productData && (
            <pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(productData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'

import { apiClient, getAuthToken, removeAuthToken, setAuthToken } from '@/lib/api'
import { AuthResponse, LoginData, RegisterData, User } from '@/lib/types'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginData) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<void>
  verifyEmail: (id: string, hash: string, signature: string, expires: string) => Promise<any>
  resendVerification: () => Promise<any>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user && !!getAuthToken()

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const response = await apiClient.getUser()
          setUser(response.user)
        } catch (error) {
          removeAuthToken()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.login(data)
      setAuthToken(response.token)
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.register(data)
      setAuthToken(response.token)
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      removeAuthToken()
      setUser(null)
    }
  }

  const verifyEmail = async (id: string, hash: string, signature: string, expires: string) => {
    try {
      const response = await apiClient.verifyEmail(id, hash, signature, expires)
      if (response.verified && user) {
        setUser({ ...user, email_verified_at: new Date().toISOString() })
      }
      return response
    } catch (error) {
      throw error
    }
  }

  const resendVerification = async () => {
    try {
      return await apiClient.resendVerification()
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        resendVerification,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getTokenUser, logout, refreshAccessToken } from '@/action/AuthAction'
import { getValidToken, setupAutoRefresh, isTokenExpired } from '@/utils/tokenUtils'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const autoRefreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    checkAuthStatus()
    
    // Cleanup auto refresh timeout khi component unmount
    return () => {
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current)
      }
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await getValidToken() // Sử dụng getValidToken thay vì getTokenUser
      const isValid = !!token
      setIsAuthenticated(isValid)
      
      // Thiết lập auto refresh nếu có token hợp lệ
      if (isValid && token) {
        setupTokenAutoRefresh(token)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  const setupTokenAutoRefresh = (token: string) => {
    // Clear existing timeout
    if (autoRefreshTimeoutRef.current) {
      clearTimeout(autoRefreshTimeoutRef.current)
    }
    
    // Setup new auto refresh
    autoRefreshTimeoutRef.current = setupAutoRefresh(token, async () => {
      await refreshAuth()
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsAuthenticated(false)
      router.push('/vi/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const refreshAuth = async () => {
    setIsLoading(true)
    try {
      const newToken = await refreshAccessToken()
      setIsAuthenticated(true)
      
      // Setup auto refresh cho token mới
      if (newToken) {
        setupTokenAutoRefresh(newToken)
      }
    } catch (error) {
      console.error('Refresh auth failed:', error)
      setIsAuthenticated(false)
      
      // Clear auto refresh timeout khi refresh thất bại
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current)
        autoRefreshTimeoutRef.current = null
      }
      
      router.push('/vi/login')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isAuthenticated,
    isLoading,
    logout: handleLogout,
    refreshAuth
  }
}
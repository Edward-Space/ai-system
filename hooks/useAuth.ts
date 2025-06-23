"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTokenUser, logout } from '@/action/AuthAction'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await getTokenUser()
      setIsAuthenticated(!!token)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
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

  const refreshAuth = () => {
    setIsLoading(true)
    checkAuthStatus()
  }

  return {
    isAuthenticated,
    isLoading,
    logout: handleLogout,
    refreshAuth
  }
}
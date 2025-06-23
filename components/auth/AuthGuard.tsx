"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getTokenUser } from "@/action/AuthAction"

interface AuthGuardProps {
  children: React.ReactNode
  lang: string
}

export function AuthGuard({ children, lang }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getTokenUser()
        
        if (!token) {
          // Redirect to login if no token
          router.replace(`/${lang}/login`)
          return
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.replace(`/${lang}/login`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [lang, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
"use client"

import { useState, useEffect } from 'react'
import { getTokenUser, getRefreshToken } from '@/action/AuthAction'
import { getTokenTimeRemaining, isTokenExpired } from '@/utils/tokenUtils'

interface TokenStatusProps {
  showDetails?: boolean
}

export function TokenStatus({ showDetails = false }: TokenStatusProps) {
  const [tokenInfo, setTokenInfo] = useState<{
    hasAccessToken: boolean
    hasRefreshToken: boolean
    isExpired: boolean
    timeRemaining: number
    lastChecked: Date
  } | null>(null)

  const checkTokenStatus = async () => {
    try {
      const accessToken = await getTokenUser()
      const refreshToken = await getRefreshToken()
      
      const hasAccessToken = !!accessToken
      const hasRefreshToken = !!refreshToken
      const isExpired = accessToken ? isTokenExpired(accessToken) : true
      const timeRemaining = accessToken ? getTokenTimeRemaining(accessToken) : 0
      
      setTokenInfo({
        hasAccessToken,
        hasRefreshToken,
        isExpired,
        timeRemaining,
        lastChecked: new Date()
      })
    } catch (error) {
      console.error('Error checking token status:', error)
      setTokenInfo(null)
    }
  }

  useEffect(() => {
    checkTokenStatus()
    
    // Cập nhật mỗi 30 giây
    const interval = setInterval(checkTokenStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return 'Expired'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getStatusColor = () => {
    if (!tokenInfo?.hasAccessToken) return 'text-red-500'
    if (tokenInfo.isExpired) return 'text-red-500'
    if (tokenInfo.timeRemaining < 300) return 'text-yellow-500' // Cảnh báo khi còn < 5 phút
    return 'text-green-500'
  }

  const getStatusText = () => {
    if (!tokenInfo?.hasAccessToken) return 'No Token'
    if (tokenInfo.isExpired) return 'Expired'
    if (tokenInfo.timeRemaining < 300) return 'Expiring Soon'
    return 'Valid'
  }

  if (!showDetails) {
    return (
      <div className={`text-sm font-medium ${getStatusColor()}`}>
        Token: {getStatusText()}
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Token Status</h3>
      
      {tokenInfo ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Access Token:</span>
            <span className={tokenInfo.hasAccessToken ? 'text-green-600' : 'text-red-600'}>
              {tokenInfo.hasAccessToken ? '✓ Present' : '✗ Missing'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Refresh Token:</span>
            <span className={tokenInfo.hasRefreshToken ? 'text-green-600' : 'text-red-600'}>
              {tokenInfo.hasRefreshToken ? '✓ Present' : '✗ Missing'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={getStatusColor()}>
              {getStatusText()}
            </span>
          </div>
          
          {tokenInfo.hasAccessToken && (
            <div className="flex justify-between">
              <span>Time Remaining:</span>
              <span className={getStatusColor()}>
                {formatTime(tokenInfo.timeRemaining)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-gray-500">
            <span>Last Checked:</span>
            <span>{tokenInfo.lastChecked.toLocaleTimeString()}</span>
          </div>
          
          <button
            onClick={checkTokenStatus}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Refresh Status
          </button>
        </div>
      ) : (
        <div className="text-red-500">Error loading token status</div>
      )}
    </div>
  )
}
"use client"

import { useState } from 'react'
import { TokenStatus } from './TokenStatus'
import { useAuth } from '@/hooks/useAuth'
import { refreshAccessToken, logout } from '@/action/AuthAction'

export function AuthDebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isAuthenticated, isLoading, refreshAuth } = useAuth()

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshAuth()
      console.log('Manual refresh successful')
    } catch (error) {
      console.error('Manual refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/vi/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Chỉ hiển thị trong development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        🔐 Auth Debug
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Auth Debug Panel</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Auth Status */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">Authentication Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Is Authenticated:</span>
                <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                  {isAuthenticated ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Is Loading:</span>
                <span className={isLoading ? 'text-yellow-600' : 'text-gray-600'}>
                  {isLoading ? '⏳ Yes' : '✓ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Token Status */}
          <div className="mb-4">
            <TokenStatus showDetails={true} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing || !isAuthenticated}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isRefreshing ? '🔄 Refreshing...' : '🔄 Manual Refresh'}
            </button>
            
            <button
              onClick={handleLogout}
              disabled={!isAuthenticated}
              className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              🚪 Logout
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <p className="font-medium mb-1">Debug Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Monitor token expiry in real-time</li>
              <li>Test manual refresh functionality</li>
              <li>Verify auto-refresh behavior</li>
              <li>Check token cleanup on logout</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
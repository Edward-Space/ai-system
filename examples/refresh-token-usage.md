# Refresh Token Usage Examples

## 1. Sử dụng trong Component

### Basic Usage với useAuth Hook

```tsx
import { useAuth } from '@/hooks/useAuth'
import { TokenStatus } from '@/components/auth/TokenStatus'

function MyComponent() {
  const { isAuthenticated, isLoading, refreshAuth } = useAuth()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      
      {/* Hiển thị token status */}
      <TokenStatus showDetails={true} />
      
      {/* Manual refresh button */}
      <button onClick={refreshAuth}>
        Refresh Token
      </button>
    </div>
  )
}
```

### Sử dụng getValidToken trong API Calls

```tsx
import { getValidToken } from '@/utils/tokenUtils'
import axios from 'axios'

async function fetchUserData() {
  try {
    // getValidToken sẽ tự động refresh nếu token hết hạn
    const token = await getValidToken()
    
    if (!token) {
      throw new Error('No valid token available')
    }
    
    const response = await axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    throw error
  }
}
```

## 2. Server-Side Usage

### Trong Server Components

```tsx
import { getValidToken } from '@/utils/tokenUtils'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const token = await getValidToken()
  
  if (!token) {
    redirect('/vi/login')
  }
  
  // Fetch data với token hợp lệ
  const userData = await fetchUserData(token)
  
  return (
    <div>
      <h1>Welcome {userData.name}</h1>
    </div>
  )
}
```

### Trong API Routes

```tsx
// app/api/protected/route.ts
import { getValidToken } from '@/utils/tokenUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = await getValidToken()
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Process request với token hợp lệ
    const data = await processRequest(token)
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## 3. Manual Token Management

### Kiểm tra Token Status

```tsx
import { 
  isTokenExpired, 
  getTokenTimeRemaining,
  getValidToken 
} from '@/utils/tokenUtils'
import { getTokenUser } from '@/action/AuthAction'

async function checkTokenStatus() {
  const currentToken = await getTokenUser()
  
  if (!currentToken) {
    console.log('No token found')
    return
  }
  
  const expired = isTokenExpired(currentToken)
  const timeRemaining = getTokenTimeRemaining(currentToken)
  
  console.log('Token expired:', expired)
  console.log('Time remaining:', timeRemaining, 'seconds')
  
  // Lấy token hợp lệ (auto refresh nếu cần)
  const validToken = await getValidToken()
  console.log('Valid token:', !!validToken)
}
```

### Manual Refresh

```tsx
import { refreshAccessToken } from '@/action/AuthAction'

async function handleManualRefresh() {
  try {
    const newToken = await refreshAccessToken()
    console.log('Token refreshed successfully')
    
    // Token mới đã được lưu vào cookie tự động
    // Có thể update UI state nếu cần
    
  } catch (error) {
    console.error('Refresh failed:', error)
    
    // Redirect to login
    window.location.href = '/vi/login'
  }
}
```

## 4. Debug và Monitoring

### Sử dụng AuthDebugPanel

```tsx
// Chỉ trong development mode
import { AuthDebugPanel } from '@/components/auth/AuthDebugPanel'

function App() {
  return (
    <div>
      {/* Your app content */}
      
      {/* Debug panel sẽ tự động ẩn trong production */}
      <AuthDebugPanel />
    </div>
  )
}
```

### Custom Token Monitor

```tsx
import { useState, useEffect } from 'react'
import { getTokenUser, getRefreshToken } from '@/action/AuthAction'
import { getTokenTimeRemaining } from '@/utils/tokenUtils'

function TokenMonitor() {
  const [tokenInfo, setTokenInfo] = useState(null)
  
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = await getTokenUser()
      const refreshToken = await getRefreshToken()
      
      if (accessToken) {
        const timeRemaining = getTokenTimeRemaining(accessToken)
        setTokenInfo({
          hasAccess: true,
          hasRefresh: !!refreshToken,
          timeRemaining
        })
      } else {
        setTokenInfo(null)
      }
    }
    
    checkToken()
    const interval = setInterval(checkToken, 10000) // Check every 10s
    
    return () => clearInterval(interval)
  }, [])
  
  if (!tokenInfo) {
    return <div className="text-red-500">No token</div>
  }
  
  return (
    <div className="text-sm">
      <div>Access Token: ✓</div>
      <div>Refresh Token: {tokenInfo.hasRefresh ? '✓' : '✗'}</div>
      <div>Expires in: {tokenInfo.timeRemaining}s</div>
    </div>
  )
}
```

## 5. Error Handling Best Practices

### Axios Interceptor (Đã được setup tự động)

```tsx
// lib/axios.ts - Đã được cấu hình sẵn
// Tự động xử lý 401 errors và retry với token mới

import axiosInstance from '@/lib/axios'

// Chỉ cần sử dụng axiosInstance bình thường
async function apiCall() {
  try {
    const response = await axiosInstance.get('/api/data')
    return response.data
  } catch (error) {
    // Lỗi 401 đã được xử lý tự động
    // Chỉ cần handle các lỗi khác
    console.error('API call failed:', error)
    throw error
  }
}
```

### Custom Error Handling

```tsx
import { getValidToken } from '@/utils/tokenUtils'

async function safeApiCall() {
  try {
    const token = await getValidToken()
    
    if (!token) {
      // Redirect to login
      window.location.href = '/vi/login'
      return
    }
    
    // Make API call
    const response = await fetch('/api/data', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      // Token might be invalid, try refresh
      const newToken = await getValidToken()
      
      if (newToken) {
        // Retry with new token
        return fetch('/api/data', {
          headers: {
            Authorization: `Bearer ${newToken}`
          }
        })
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/vi/login'
      }
    }
    
    return response
    
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}
```

## 6. Testing

### Test Token Expiry

```tsx
// Để test token expiry, có thể modify token manually
import { isTokenExpired, getTokenTimeRemaining } from '@/utils/tokenUtils'

// Test với token giả
const expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzAwMDAwMDB9.signature'

console.log('Is expired:', isTokenExpired(expiredToken)) // true
console.log('Time remaining:', getTokenTimeRemaining(expiredToken)) // 0
```

### Test Auto Refresh

```tsx
// Trong development, có thể force refresh
import { refreshAccessToken } from '@/action/AuthAction'

async function testRefresh() {
  try {
    console.log('Testing refresh...')
    const newToken = await refreshAccessToken()
    console.log('Refresh successful:', !!newToken)
  } catch (error) {
    console.log('Refresh failed:', error.message)
  }
}
```
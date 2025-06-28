# Authentication System

Hệ thống xác thực cho ứng dụng Next.js với kiểm tra token, refresh token tự động và redirect tự động.

## Cấu trúc

### 1. Middleware (`middleware.ts`)
- Kiểm tra token ở tất cả các route
- Redirect về `/vi/login` nếu không có token (trừ trang `/vi`)
- Redirect về `/vi` nếu đã đăng nhập và truy cập trang login
- Cho phép truy cập trang `/vi` mà không cần token

### 2. Server Auth Guard (`ServerAuthGuard.tsx`)
- Kiểm tra token ở server-side
- Redirect về login nếu không có token
- Sử dụng trong layout của (main) routes

### 3. Client Auth Guard (`AuthGuard.tsx`)
- Kiểm tra token ở client-side
- Hiển thị loading spinner khi đang kiểm tra
- Redirect về login nếu không có token

### 4. Auth Hook (`useAuth.ts`)
- Hook để quản lý authentication state
- Cung cấp functions: `logout`, `refreshAuth`
- Theo dõi trạng thái: `isAuthenticated`, `isLoading`

### 5. Auth Actions (`AuthAction.tsx`)
- `actionLogin`: Lưu access_token và refresh_token vào cookie
- `getTokenUser`: Lấy access token (hỗ trợ cả client và server)
- `getRefreshToken`: Lấy refresh token (hỗ trợ cả client và server)
- `refreshAccessToken`: Refresh access token bằng refresh token
- `logout`: Xóa tất cả tokens (hỗ trợ cả client và server)

### 6. Token Utils (`/utils/tokenUtils.ts`)
- `isTokenExpired`: Kiểm tra token có hết hạn không
- `getValidToken`: Lấy token hợp lệ, tự động refresh nếu cần
- `getTokenTimeRemaining`: Tính thời gian còn lại của token
- `setupAutoRefresh`: Thiết lập auto-refresh trước khi token hết hạn

### 7. Token Status Component (`TokenStatus.tsx`)
- Hiển thị trạng thái token cho debugging
- Monitor thời gian hết hạn
- Refresh status theo thời gian thực

## Cách sử dụng

### 1. Trong Component

```tsx
import { useAuth } from '@/hooks/useAuth'
import { LogoutButton } from '@/components/auth/LogoutButton'

function MyComponent() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Đã đăng nhập</p>
          <LogoutButton />
        </div>
      ) : (
        <p>Chưa đăng nhập</p>
      )}
    </div>
  )
}
```

### 2. Bảo vệ Route

```tsx
import { ServerAuthGuard } from '@/components/auth/ServerAuthGuard'

export default async function ProtectedLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  return (
    <ServerAuthGuard lang={lang}>
      {children}
    </ServerAuthGuard>
  )
}
```

### 3. Login Process

```tsx
import { actionLogin } from '@/action/AuthAction'
import { useRouter } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  
  const handleLogin = async (credentials: LoginData) => {
    try {
      const response = await loginAPI(credentials)
      await actionLogin(response)
      router.push('/vi')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  return (
    // Login form JSX
  )
}
```

## Luồng hoạt động
### 1. User chưa đăng nhập

1. Truy cập `/vi/dashboard` → Middleware kiểm tra → Redirect `/vi/login`
2. Đăng nhập thành công → `actionLogin` lưu access_token và refresh_token → Redirect `/vi`
3. Truy cập các trang khác → ServerAuthGuard kiểm tra → Cho phép truy cập

### 2. User đã đăng nhập
1. Truy cập `/vi/login` → Middleware kiểm tra → Redirect `/vi`
2. Truy cập các trang protected → ServerAuthGuard kiểm tra → Cho phép truy cập
3. Click logout → `logout` xóa tất cả tokens → Redirect `/vi/login`

### 3. Refresh Token Flow
1. **Auto Refresh**: Token sẽ tự động refresh trước 5 phút khi hết hạn
2. **API Call với Token hết hạn**: 
   - Axios interceptor bắt lỗi 401
   - Tự động gọi refresh token API
   - Retry request ban đầu với token mới
   - Nếu refresh thất bại → Redirect `/vi/login`
3. **Manual Token Check**:
   - `getValidToken()` kiểm tra token expiry
   - Tự động refresh nếu token hết hạn
   - Trả về token hợp lệ hoặc null

### 4. Token Monitoring
1. `useAuth` hook thiết lập auto-refresh timer
2. `TokenStatus` component hiển thị trạng thái real-time
3. Tự động cleanup timers khi component unmount

### 3. Trang `/vi` (không cần token)
1. Truy cập `/vi` → Middleware cho phép → Hiển thị trang
2. Có thể là landing page hoặc trang giới thiệu

## Cấu hình Routes

```
app/
├── [lang]/
│   ├── layout.tsx              # Root layout với SWRProvider
│   ├── (auth)/                 # Auth routes (không cần token)
│   │   ├── layout.tsx          # Auth layout
│   │   └── login/
│   │       └── page.tsx        # Login page
│   ├── (main)/                 # Protected routes (cần token)
│   │   ├── layout.tsx          # Main layout với ServerAuthGuard
│   │   ├── page.tsx            # Dashboard
│   │   ├── bot/
│   │   └── management-*/
│   └── page.tsx                # Landing page (/vi) - không cần token
```

## Lưu ý

1. **Token Storage**: Sử dụng HTTP-only cookie để bảo mật
2. **Middleware**: Chạy ở edge runtime, kiểm tra tất cả requests
3. **Server vs Client**: AuthAction hỗ trợ cả server và client side
4. **Refresh Token Security**: 
   - Refresh token có thời hạn dài hơn access token
   - Được lưu trong HTTP-only cookie để tránh XSS
   - Tự động xóa khi refresh thất bại
5. **Auto Refresh**: 
   - Chạy trước 5 phút khi token hết hạn
   - Sử dụng setTimeout, tự động cleanup
   - Chỉ hoạt động khi user đang active
6. **Error Handling**: 
   - Axios interceptor xử lý 401 tự động
   - Fallback về login khi refresh thất bại
   - Retry logic cho failed requests
7. **Performance**: 
   - Token validation chỉ parse JWT header
   - Minimal API calls với smart caching
   - Cleanup timers để tránh memory leaks
4. **Error Handling**: Tự động redirect về login khi có lỗi
5. **Performance**: ServerAuthGuard kiểm tra ở server, tránh flash content

## Troubleshooting

### 1. Infinite redirect loop
- Kiểm tra middleware matcher
- Đảm bảo auth routes không bị protect

### 2. Token không được lưu
- Kiểm tra cookie settings (path, domain)
- Verify server response format

### 3. Client-side hydration issues
- Sử dụng ServerAuthGuard thay vì AuthGuard
- Kiểm tra SSR/CSR consistency
# Authentication System

Hệ thống xác thực cho ứng dụng Next.js với kiểm tra token và redirect tự động.

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
- `actionLogin`: Lưu token vào cookie
- `getTokenUser`: Lấy token (hỗ trợ cả client và server)
- `logout`: Xóa token (hỗ trợ cả client và server)

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
2. Đăng nhập thành công → `actionLogin` lưu token → Redirect `/vi`
3. Truy cập các trang khác → ServerAuthGuard kiểm tra → Cho phép truy cập

### 2. User đã đăng nhập
1. Truy cập `/vi/login` → Middleware kiểm tra → Redirect `/vi`
2. Truy cập các trang protected → ServerAuthGuard kiểm tra → Cho phép truy cập
3. Click logout → `logout` xóa token → Redirect `/vi/login`

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
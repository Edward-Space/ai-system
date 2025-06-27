# AI System

Một ứng dụng web hiện đại được xây dựng với Next.js, Tailwind CSS và các thành phần UI tùy chỉnh.

## Tổng quan

Dự án này là một ứng dụng web sử dụng các công nghệ mới nhất trong hệ sinh thái React và Next.js. Dự án bao gồm các thành phần UI tùy chỉnh, hiệu ứng đặc biệt và các tính năng tương tác người dùng hiện đại.

## Công nghệ sử dụng

- **Next.js 15.3.3**: Framework React hiện đại với tính năng App Router
- **React 18.3.1**: Thư viện UI cốt lõi
- **Tailwind CSS 4**: Framework CSS tiện ích
- **Radix UI**: Thư viện thành phần UI không có style sẵn
- **MagicUI**: Bộ thành phần UI tùy chỉnh với các hiệu ứng đặc biệt
- **SWR**: Thư viện quản lý dữ liệu và caching
- **Recoil**: Thư viện quản lý trạng thái
- **Cobe**: Thư viện tạo hiệu ứng globe 3D
- **Motion**: Thư viện animation

## Cấu trúc dự án

```
├── app/                  # App Router của Next.js
│   ├── api/              # API routes
│   ├── layout.tsx        # Layout chính của ứng dụng
│   └── page.tsx          # Trang chính
├── components/           # Các thành phần UI
│   ├── magicui/          # Các thành phần UI đặc biệt
│   └── ui/               # Các thành phần UI cơ bản
├── hooks/                # React hooks tùy chỉnh
├── lib/                  # Các tiện ích và hàm helper
├── model/                # TypeScript interfaces và types
├── public/               # Tài nguyên tĩnh
└── service/              # API services
    ├── api.ts            # Axios configuration
    ├── swr.ts            # SWR hooks
    └── index.ts          # Service exports
```

## Tính năng

- **Thiết kế hiện đại**: Giao diện người dùng đẹp mắt với Tailwind CSS
- **Thành phần UI tùy chỉnh**: Sử dụng Radix UI và các thành phần tùy chỉnh
- **Hiệu ứng đặc biệt**: Bao gồm globe 3D, lưới nhấp nháy, và hiệu ứng marquee
- **Responsive**: Tương thích với nhiều kích thước màn hình
- **Dark mode**: Hỗ trợ chế độ sáng/tối
- **API Integration**: Tích hợp Axios và SWR để gọi API

## Bắt đầu

### Yêu cầu

- Node.js 18.0 trở lên
- npm hoặc pnpm

### Cài đặt

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng pnpm
pnpm install
```

### Chạy ứng dụng

```bash
# Chế độ phát triển
npm run dev
# hoặc
pnpm dev

# Build cho production
npm run build
# hoặc
pnpm build

# Chạy bản build
npm run start
# hoặc
pnpm start
```

## API Services

Dự án sử dụng Axios với cấu hình tự động credentials và SWR để gọi API.

### Server-side API (Axios)

Sử dụng các methods từ `service/api.ts` với axios đã được cấu hình:

```typescript
import { GET, POST, PUT, PATCH, DELETE } from '@/service/api';
import { User } from '@/model';

// GET request
const users = await GET<User[]>('/api/v1/users');

// POST request
const newUser = await POST<User>('/api/v1/users', { 
  name: 'John Doe', 
  email: 'john@example.com' 
});

// PUT request
const updatedUser = await PUT<User>(`/api/v1/users/${userId}`, { 
  name: 'Jane Doe' 
});

// PATCH request
const patchedUser = await PATCH<User>(`/api/v1/users/${userId}`, { 
  name: 'Updated Name' 
});

// DELETE request
await DELETE(`/api/v1/users/${userId}`);
```

**Tính năng Axios:**
- ✅ Tự động thêm `Authorization` header với Bearer token
- ✅ Tự động gửi cookies với `withCredentials: true`
- ✅ Error handling tự động (401 → redirect login)
- ✅ Support cả server-side và client-side
- ✅ TypeScript support với generics

**Sử dụng trực tiếp axios instance:**
```typescript
import { apiClient } from '@/lib/axios';

// Custom request với config
const response = await apiClient.get('/api/v1/data', {
  params: { page: 1, limit: 10 },
  timeout: 5000
});
```

### Client-side API (SWR)

Sử dụng các hooks từ `swrService` để gọi API từ client-side:

```typescript
import { useApi, usePostMutation } from '@/service';
import { User } from '@/model';

// Fetch data
const { data: users, error, isLoading } = useApi<User[]>('/users');

// Mutation (POST, PUT, PATCH, DELETE)
const { trigger: createUser, isMutating } = usePostMutation<User>('/users');

// Sử dụng mutation
const handleSubmit = async () => {
  const newUser = await createUser({ name: 'John Doe', email: 'john@example.com' });
  console.log('Created user:', newUser);
};
```

## Môi trường

Tạo file `.env.local` với các biến môi trường sau:

```
NEXT_PUBLIC_API_URL=http://your-api-url.com/api
```

```

# Chạy môi trường phát triển
pnpm dev

# Xây dựng ứng dụng cho production
pnpm build

# Chạy ứng dụng đã build
pnpm start
```

## Phát triển

Dự án sử dụng Turbopack để tăng tốc quá trình phát triển. Bạn có thể chỉnh sửa các file trong thư mục `app` và `components` để bắt đầu tùy chỉnh ứng dụng.

```bash
# Chạy với Turbopack
pnpm dev
```

## Triển khai

Dự án này có thể được triển khai dễ dàng trên Vercel:

```bash
# Triển khai lên Vercel
vercel
```

## Giấy phép

MIT
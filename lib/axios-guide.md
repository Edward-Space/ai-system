# Axios Configuration Guide

## Tổng quan

Dự án đã được cấu hình axios với các tính năng:
- Tự động thêm credentials và cookies
- Interceptors để xử lý authentication
- Error handling tự động
- Support cả server-side và client-side

## Cấu hình chính

### 1. Axios Instance (`lib/axios.ts`)

```typescript
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  withCredentials: true, // Tự động gửi cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Request Interceptor

- Tự động thêm `Authorization` header với Bearer token
- Hỗ trợ cả server-side và client-side token retrieval
- Thêm các headers bổ sung như `X-Requested-With`, `Accept`

### 3. Response Interceptor

- Xử lý lỗi 401 (Unauthorized) và redirect về login
- Log các lỗi server (5xx)
- Xử lý lỗi 403 (Forbidden)

## Cách sử dụng

### 1. Sử dụng API methods từ `service/api.ts`

```typescript
import { GET, POST, PUT, PATCH, DELETE } from '@/service/api';

// GET request
const users = await GET<User[]>('/api/v1/users');

// POST request
const newUser = await POST<User>('/api/v1/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const updatedUser = await PUT<User>('/api/v1/users/1', userData);

// PATCH request
const patchedUser = await PATCH<User>('/api/v1/users/1', { name: 'New Name' });

// DELETE request
await DELETE('/api/v1/users/1');
```

### 2. Sử dụng trực tiếp apiClient

```typescript
import { apiClient } from '@/lib/axios';

// Với custom config
const response = await apiClient.get('/api/v1/users', {
  params: { page: 1, limit: 10 },
  timeout: 5000
});

// Upload file
const formData = new FormData();
formData.append('file', file);

const uploadResponse = await apiClient.post('/api/v1/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### 3. Sử dụng trong React Components

```typescript
import { useState, useEffect } from 'react';
import { GET } from '@/service/api';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await GET<User[]>('/api/v1/users');
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

### 4. Error Handling

```typescript
import { POST } from '@/service/api';
import { AxiosError } from 'axios';

const createUser = async (userData: any) => {
  try {
    const result = await POST<User>('/api/v1/users', userData);
    return result;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        console.error('Validation error:', error.response.data);
      } else if (error.response?.status === 401) {
        console.error('Unauthorized');
        // Redirect sẽ được xử lý tự động bởi interceptor
      }
    }
    throw error;
  }
};
```

## Tính năng nâng cao

### 1. Custom Headers cho request cụ thể

```typescript
import { apiClient } from '@/lib/axios';

const response = await apiClient.post('/api/v1/data', payload, {
  headers: {
    'Custom-Header': 'custom-value',
    'X-API-Version': '2.0'
  }
});
```

### 2. Request với timeout custom

```typescript
const response = await GET<Data>('/api/v1/slow-endpoint', {
  timeout: 60000 // 60 seconds
});
```

### 3. Cancel requests

```typescript
import { apiClient } from '@/lib/axios';

const controller = new AbortController();

const response = await apiClient.get('/api/v1/data', {
  signal: controller.signal
});

// Cancel request
controller.abort();
```

## Migration từ fetch

Nếu bạn đang sử dụng fetch API, có thể dễ dàng migrate:

```typescript
// Trước (fetch)
const response = await fetch('/api/v1/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
const result = await response.json();

// Sau (axios)
const result = await POST<User>('/api/v1/users', data);
```

## Environment Variables

Đảm bảo có các biến môi trường:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Lưu ý quan trọng

1. **Credentials**: `withCredentials: true` đảm bảo cookies được gửi tự động
2. **Token**: Token sẽ được thêm tự động vào header `Authorization`
3. **Error Handling**: Lỗi 401 sẽ tự động redirect về login
4. **Server-side**: Hoạt động tốt với Next.js App Router
5. **Type Safety**: Hỗ trợ TypeScript generics cho response types

## Troubleshooting

### CORS Issues
Nếu gặp lỗi CORS, đảm bảo backend đã cấu hình:
```javascript
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

### Cookie Issues
Đảm bảo cookies được set với:
```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
});
```
'use client';

import { useState } from 'react';
import { useApi, usePostMutation } from '@/service';
import { User, LoginRequest, LoginResponse } from '@/model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApiExamplePage() {
  // State cho form đăng nhập
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  // Sử dụng SWR để fetch dữ liệu user
  const { data: users, error, isLoading, mutate } = useApi<User[]>('/users');

  // Sử dụng SWR Mutation để đăng nhập
  const { trigger: login, isMutating } = usePostMutation<LoginResponse, LoginRequest>(
    '/auth/login',
    {
      // Callback khi login thành công
      onSuccess: (data) => {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        // Revalidate dữ liệu users
        mutate();
        // Reset form
        setLoginData({ email: '', password: '' });
      },
    }
  );

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginData);
  };

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Example</h1>

      {/* Form đăng nhập */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>

      {/* Hiển thị danh sách users */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>
        
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Lỗi: {error.message}</p>
        ) : !users || users.length === 0 ? (
          <p>Không có dữ liệu người dùng</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="p-2 border-b">
                <div className="flex items-center gap-2">
                  {user.avatar && (
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{user.fullName || user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
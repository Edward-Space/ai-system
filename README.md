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
│   ├── layout.tsx        # Layout chính của ứng dụng
│   └── page.tsx          # Trang chính
├── components/           # Các thành phần UI
│   ├── magicui/          # Các thành phần UI đặc biệt
│   └── ui/               # Các thành phần UI cơ bản
├── hooks/                # React hooks tùy chỉnh
├── lib/                  # Các tiện ích và hàm helper
└── public/               # Tài nguyên tĩnh
```

## Tính năng

- **Thiết kế hiện đại**: Giao diện người dùng đẹp mắt với Tailwind CSS
- **Thành phần UI tùy chỉnh**: Sử dụng Radix UI và các thành phần tùy chỉnh
- **Hiệu ứng đặc biệt**: Bao gồm globe 3D, lưới nhấp nháy, và hiệu ứng marquee
- **Responsive**: Tương thích với nhiều kích thước màn hình
- **Dark mode**: Hỗ trợ chế độ sáng/tối

## Bắt đầu

### Yêu cầu

- Node.js 18.0 trở lên
- npm hoặc pnpm

### Cài đặt

```bash
# Cài đặt các dependencies
pnpm install

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
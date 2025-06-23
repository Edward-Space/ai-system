# AvatarSelect Component

Component chọn avatar với giao diện đẹp mắt, animation mượt mà và hỗ trợ đầy đủ accessibility.

## Tính năng

- ✨ **Animation mượt mà**: Hiệu ứng fade-in/zoom-in khi mở dropdown
- 🎨 **3 kích thước**: Small (sm), Medium (md), Large (lg)
- 🎯 **Click outside**: Tự động đóng khi click bên ngoài
- ♿ **Accessibility**: Hỗ trợ đầy đủ keyboard navigation
- 🔧 **Tùy chỉnh**: Dễ dàng custom style với Tailwind CSS
- 🚫 **Disabled state**: Hỗ trợ trạng thái disabled
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị
- 🌙 **Dark mode**: Tương thích với dark mode

## Cài đặt

Component này sử dụng các dependencies sau:

```bash
npm install @radix-ui/react-avatar lucide-react
```

## Sử dụng cơ bản

```tsx
import { AvatarSelect, type AvatarOption } from "@/components/ui/avatar-select"

const avatarOptions: AvatarOption[] = [
  {
    id: "avatar-1",
    src: "https://github.com/shadcn.png",
    alt: "Shadcn",
    fallback: "SH"
  },
  {
    id: "avatar-2",
    src: "https://github.com/vercel.png",
    alt: "Vercel",
    fallback: "VE"
  }
]

function MyComponent() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")

  return (
    <AvatarSelect
      options={avatarOptions}
      value={selectedAvatar}
      onValueChange={setSelectedAvatar}
      placeholder="Chọn avatar..."
      size="md"
    />
  )
}
```

## Sử dụng nâng cao

### Với giá trị mặc định

```tsx
<AvatarSelect
  options={avatarOptions}
  value="avatar-1"
  onValueChange={handleChange}
  placeholder="Chọn avatar..."
  size="lg"
/>
```

### Với custom styling

```tsx
<AvatarSelect
  options={avatarOptions}
  value={selectedAvatar}
  onValueChange={setSelectedAvatar}
  className="w-full max-w-md"
  size="sm"
/>
```

### Disabled state

```tsx
<AvatarSelect
  options={avatarOptions}
  value="avatar-1"
  disabled
  placeholder="Không thể chọn..."
/>
```

## Props

### AvatarSelectProps

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `options` | `AvatarOption[]` | - | **Required.** Danh sách các avatar option |
| `value` | `string` | `undefined` | Giá trị hiện tại được chọn |
| `onValueChange` | `(value: string) => void` | `undefined` | Callback khi giá trị thay đổi |
| `placeholder` | `string` | `"Chọn avatar..."` | Text hiển thị khi chưa chọn |
| `className` | `string` | `undefined` | CSS class tùy chỉnh |
| `disabled` | `boolean` | `false` | Trạng thái disabled |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Kích thước avatar |

### AvatarOption Interface

```tsx
interface AvatarOption {
  id: string        // ID duy nhất của avatar
  src: string       // URL của hình ảnh
  alt: string       // Alt text và tên hiển thị
  fallback?: string // Text fallback khi ảnh không load được
}
```

## Styling

Component sử dụng Tailwind CSS và có thể tùy chỉnh thông qua:

### Size Classes

```tsx
const sizeClasses = {
  sm: "size-8",   // 32px
  md: "size-12",  // 48px  
  lg: "size-16"   // 64px
}
```

### Custom CSS

```css
/* Tùy chỉnh dropdown */
[data-avatar-select] .dropdown {
  @apply bg-background border-border;
}

/* Tùy chỉnh avatar hover */
[data-avatar-select] .avatar-option:hover {
  @apply bg-accent/50;
}
```

## Animation Classes

Component sử dụng các animation classes sau:

- `animate-in fade-in-0 zoom-in-95` - Hiệu ứng mở dropdown
- `slide-in-from-top-1` - Hiệu ứng xuất hiện từng option
- `rotate-180` - Xoay icon chevron

## Accessibility

- ✅ Keyboard navigation (Enter, Escape, Arrow keys)
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Color contrast compliance

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Demo

Xem demo tại: `/avatar-select-demo`

## Troubleshooting

### Avatar không hiển thị

1. Kiểm tra URL của `src` có hợp lệ không
2. Đảm bảo `fallback` được cung cấp
3. Kiểm tra CORS policy nếu load ảnh từ domain khác

### Dropdown không đóng

1. Đảm bảo `data-avatar-select` attribute được thêm vào container
2. Kiểm tra z-index của các element khác

### Performance issues

1. Sử dụng `React.memo` cho component cha
2. Optimize hình ảnh avatar (WebP, lazy loading)
3. Giới hạn số lượng options nếu quá nhiều
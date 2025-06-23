# Multi-Select Component

Một component multi-select với hiệu ứng animation mượt mà, được xây dựng dựa trên Radix UI và Tailwind CSS.

## Tính năng

- ✨ **Animation mượt mà**: Hiệu ứng fade-in, zoom-in, slide-in cho các phần tử
- 🎯 **Tùy chỉnh linh hoạt**: Có thể tùy chỉnh placeholder, maxCount, animation delay
- 🔍 **Tìm kiếm nhanh**: Hỗ trợ keyboard navigation
- 🎨 **Responsive design**: Tương thích với mọi kích thước màn hình
- ♿ **Accessibility**: Tuân thủ các tiêu chuẩn accessibility
- 🌙 **Dark mode**: Hỗ trợ chế độ tối

## Cài đặt

Component này sử dụng các dependencies sau:

```bash
npm install @radix-ui/react-select lucide-react class-variance-authority
```

## Sử dụng cơ bản

```tsx
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"

const options: MultiSelectOption[] = [
  { label: "React", value: "react" },
  { label: "Vue.js", value: "vue" },
  { label: "Angular", value: "angular" },
]

function MyComponent() {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  return (
    <MultiSelect
      options={options}
      onValueChange={setSelectedValues}
      defaultValue={selectedValues}
      placeholder="Chọn frameworks..."
    />
  )
}
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `options` | `MultiSelectOption[]` | - | Danh sách các tùy chọn |
| `onValueChange` | `(value: string[]) => void` | - | Callback khi giá trị thay đổi |
| `defaultValue` | `string[]` | `[]` | Giá trị mặc định |
| `placeholder` | `string` | `"Chọn các tùy chọn..."` | Text hiển thị khi chưa chọn |
| `className` | `string` | - | CSS class tùy chỉnh |
| `disabled` | `boolean` | `false` | Vô hiệu hóa component |
| `maxCount` | `number` | `3` | Số lượng badge hiển thị tối đa |
| `animation` | `number` | `0` | Độ trễ animation (ms) |

## MultiSelectOption Interface

```tsx
interface MultiSelectOption {
  label: string    // Text hiển thị
  value: string    // Giá trị
  disabled?: boolean // Vô hiệu hóa tùy chọn này
}
```

## Ví dụ nâng cao

### Với animation tùy chỉnh

```tsx
<MultiSelect
  options={options}
  onValueChange={setSelectedValues}
  animation={200} // Độ trễ 200ms
  maxCount={5}    // Hiển thị tối đa 5 badges
  placeholder="Chọn kỹ năng của bạn..."
/>
```

### Với validation

```tsx
function ValidatedMultiSelect() {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleValueChange = (values: string[]) => {
    if (values.length === 0) {
      setError("Vui lòng chọn ít nhất một tùy chọn")
    } else if (values.length > 3) {
      setError("Chỉ được chọn tối đa 3 tùy chọn")
    } else {
      setError(null)
    }
    setSelectedValues(values)
  }

  return (
    <div>
      <MultiSelect
        options={options}
        onValueChange={handleValueChange}
        defaultValue={selectedValues}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}
```

## Styling

Component sử dụng Tailwind CSS và có thể được tùy chỉnh thông qua:

- `className` prop cho container chính
- CSS variables cho colors
- Tailwind classes cho responsive design

### Custom CSS Variables

```css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}
```

## Keyboard Navigation

- `Enter`: Mở/đóng dropdown
- `Backspace`: Xóa item cuối cùng khi input trống
- `Escape`: Đóng dropdown
- `Arrow Up/Down`: Điều hướng trong danh sách
- `Space/Enter`: Chọn/bỏ chọn item

## Animation Classes

Component sử dụng các animation classes sau:

- `animate-in fade-in-0 zoom-in-95`: Hiệu ứng xuất hiện
- `animate-out fade-out-0 zoom-out-95`: Hiệu ứng biến mất
- `slide-in-from-top-1`: Trượt từ trên xuống
- `animate-pulse`: Hiệu ứng nhấp nháy
- `transition-transform duration-200`: Chuyển đổi mượt mà

## Accessibility

- Hỗ trợ screen readers
- Keyboard navigation đầy đủ
- ARIA labels và roles
- Focus management
- High contrast mode support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Demo

Xem demo tại: `/multi-select-demo`

## Troubleshooting

### Component không hiển thị đúng

1. Kiểm tra import đúng path
2. Đảm bảo Tailwind CSS được cấu hình
3. Kiểm tra dependencies đã được cài đặt

### Animation không hoạt động

1. Kiểm tra Tailwind animation classes
2. Đảm bảo `animation` prop được set
3. Kiểm tra CSS conflicts

### Performance issues

1. Sử dụng `React.memo` cho large datasets
2. Implement virtualization cho > 1000 items
3. Debounce search input

## Contributing

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
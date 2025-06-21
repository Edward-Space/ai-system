# AvatarUpload Component

A flexible and feature-rich avatar upload component with drag & drop functionality, image preview, and comprehensive validation.

## Features

- 🖼️ **Image Preview**: Real-time preview of uploaded images
- 📁 **Drag & Drop**: Intuitive drag and drop interface
- 📏 **Multiple Sizes**: 4 predefined sizes (sm, md, lg, xl)
- ✅ **Validation**: File size and type validation
- 🎨 **Customizable**: Extensive styling and text customization
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 🌙 **Dark Mode**: Compatible with dark/light themes
- 📱 **Responsive**: Works on all device sizes
- ⚡ **Performance**: Optimized with React.memo and useCallback

## Installation

Make sure you have the required dependencies:

```bash
npm install lucide-react
# or
pnpm add lucide-react
```

## Basic Usage

```tsx
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { useState } from "react"

function MyComponent() {
  const [avatar, setAvatar] = useState<string | null>(null)
  
  const handleAvatarChange = (file: File | null, url: string | null) => {
    setAvatar(url)
    if (file) {
      // Handle file upload to your server
      console.log('File selected:', file)
    }
  }
  
  return (
    <AvatarUpload
      value={avatar}
      onChange={handleAvatarChange}
    />
  )
}
```

## Advanced Usage

```tsx
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { useState } from "react"

function AdvancedExample() {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handleAvatarChange = async (file: File | null, url: string | null) => {
    setError(null)
    setAvatar(url)
    
    if (file) {
      try {
        // Upload to your server
        const formData = new FormData()
        formData.append('avatar', file)
        
        const response = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        
        const result = await response.json()
        setAvatar(result.url)
      } catch (err) {
        setError('Failed to upload avatar')
        setAvatar(null)
      }
    }
  }
  
  return (
    <AvatarUpload
      value={avatar}
      onChange={handleAvatarChange}
      maxSize={2}
      accept="image/jpeg,image/png,image/webp"
      size="xl"
      uploadText="Choose Photo"
      removeText="Remove Photo"
      error={error}
      className="my-custom-class"
    />
  )
}
```

## Props

### AvatarUploadProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Current avatar URL |
| `onChange` | `(file: File \| null, url: string \| null) => void` | `undefined` | Callback when avatar changes |
| `maxSize` | `number` | `5` | Maximum file size in MB |
| `accept` | `string` | `"image/*"` | Accepted file types |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"lg"` | Avatar size |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | `undefined` | Custom CSS class |
| `showRemove` | `boolean` | `true` | Show remove button |
| `uploadText` | `string` | `"Upload Avatar"` | Upload button text |
| `removeText` | `string` | `"Remove"` | Remove button text |
| `error` | `string` | `undefined` | Error message to display |

## Sizes

| Size | Dimensions | Use Case |
|------|------------|----------|
| `sm` | 64x64px | Small profile pictures, comments |
| `md` | 80x80px | Medium profile pictures, cards |
| `lg` | 96x96px | Large profile pictures, headers |
| `xl` | 128x128px | Extra large avatars, profile pages |

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
<AvatarUpload
  className="custom-avatar-upload"
  // ... other props
/>
```

### Custom CSS

```css
.custom-avatar-upload {
  /* Custom styles */
}

.custom-avatar-upload .avatar-container {
  /* Style the avatar container */
}
```

## File Validation

The component includes built-in validation:

- **File Size**: Configurable maximum size (default: 5MB)
- **File Type**: Accepts image files by default
- **Error Handling**: Displays validation errors

```tsx
<AvatarUpload
  maxSize={2} // 2MB limit
  accept="image/jpeg,image/png" // Only JPEG and PNG
  onChange={(file, url) => {
    if (file) {
      // File passed validation
    }
  }}
/>
```

## Accessibility

- Full keyboard navigation support
- Screen reader compatible
- ARIA labels and descriptions
- Focus management
- High contrast support

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Demo

Visit `/avatar-upload-demo` to see the component in action with various configurations.

## Troubleshooting

### Common Issues

1. **File not uploading**: Check file size and type restrictions
2. **Preview not showing**: Ensure the file is a valid image
3. **Styling issues**: Verify Tailwind CSS is properly configured
4. **TypeScript errors**: Check that all required props are provided

### Performance Tips

- Use `React.memo` for parent components if needed
- Implement proper error boundaries
- Consider image compression for large files
- Use lazy loading for multiple avatars

## Examples

### Profile Settings

```tsx
function ProfileSettings() {
  const [userAvatar, setUserAvatar] = useState(user.avatar)
  
  return (
    <div className="space-y-4">
      <h2>Profile Picture</h2>
      <AvatarUpload
        value={userAvatar}
        onChange={handleAvatarUpdate}
        size="xl"
        maxSize={3}
      />
    </div>
  )
}
```

### Team Member Card

```tsx
function TeamMemberCard() {
  return (
    <Card>
      <CardContent className="text-center">
        <AvatarUpload
          value={member.avatar}
          onChange={updateMemberAvatar}
          size="lg"
          showRemove={false}
        />
        <h3>{member.name}</h3>
      </CardContent>
    </Card>
  )
}
```

### Multiple Avatars

```tsx
function TeamSettings() {
  const [members, setMembers] = useState(teamMembers)
  
  const updateMemberAvatar = (memberId: string) => 
    (file: File | null, url: string | null) => {
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, avatar: url }
          : member
      ))
    }
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {members.map(member => (
        <AvatarUpload
          key={member.id}
          value={member.avatar}
          onChange={updateMemberAvatar(member.id)}
          size="md"
        />
      ))}
    </div>
  )
}
```
# Chat Upload Components

Các component này được tạo để xử lý upload file và ảnh trong chat với flow API tương tự như knowledge upload.

## Components

### 1. ChatFileUpload.tsx
- Component chính xử lý upload file/ảnh
- Sử dụng react-dropzone cho drag & drop
- Upload file theo chunks (1MB mỗi chunk)
- Hiển thị progress bar và status
- Hỗ trợ retry khi upload lỗi

### 2. ChatUploadModal.tsx
- Modal wrapper cho ChatFileUpload
- Cung cấp giao diện đẹp hơn
- Trigger button với icon Paperclip

## Flow API Upload

1. **Tạo file metadata**: POST `/api/v1/files`
   ```json
   {
     "mime_type": "application/pdf",
     "name": "document.pdf",
     "path": "document.pdf",
     "size": 1024000,
     "storage_type": "local"
   }
   ```

2. **Upload chunks**: POST `/api/v1/files/chunks`
   ```formdata
   file_id: "uuid"
   chunk_index: "1"
   is_last: "false"
   chunk: [binary data]
   ```

## Supported File Types

### Documents
- PDF (.pdf)
- Word (.doc, .docx)
- PowerPoint (.ppt, .pptx)
- Text (.txt, .rtf)

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

## Usage trong ChatSection.tsx

```tsx
import ChatUploadModal from "./ChatUploadModal";

// Trong component
<ChatUploadModal
  onFileSelect={setSelectedFiles}
  onImageSelect={setSelectedImages}
  disabled={streamingState.isStreaming}
  maxFiles={5}
  maxFileSize={10}
/>
```

## Features

- ✅ Drag & drop upload
- ✅ Progress tracking
- ✅ Error handling & retry
- ✅ File type validation
- ✅ Size limit validation
- ✅ Chunk upload (1MB chunks)
- ✅ Toast notifications
- ✅ Modal interface
- ✅ Responsive design

## Dependencies

- `react-dropzone`: Drag & drop functionality
- `sonner`: Toast notifications
- `axios`: HTTP requests
- `lucide-react`: Icons
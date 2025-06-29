# File Preview Components

Các component preview cho các loại file khác nhau trong hệ thống knowledge management.

## 📁 Cấu trúc

```
previews/
├── PDFPreview.tsx      # Preview PDF files
├── DOCXPreview.tsx     # Preview DOCX files  
├── TXTPreview.tsx      # Preview text files
├── XLSXPreview.tsx     # Preview Excel files
└── README.md           # Tài liệu này
```

## 🚀 Cài đặt Dependencies

Trước khi sử dụng, cần cài đặt các thư viện cần thiết:

```bash
# Chạy script tự động
chmod +x install-preview-deps.sh
./install-preview-deps.sh

# Hoặc cài đặt thủ công
npm install react-pdf mammoth xlsx
npm install --save-dev @types/mammoth
```

## 📄 PDFPreview

**Thư viện:** `react-pdf`

**Tính năng:**
- Hiển thị PDF với pagination
- Zoom in/out
- Xoay trang
- Fallback với iframe

**Cách sử dụng:**
```tsx
import PDFPreview from './previews/PDFPreview';

<PDFPreview 
  fileUrl="https://example.com/file.pdf"
  fileName="document.pdf"
  onError={(error) => console.error(error)}
  onLoading={(loading) => setLoading(loading)}
/>
```

## 📝 DOCXPreview

**Thư viện:** `mammoth`

**Tính năng:**
- Convert DOCX sang HTML
- Hiển thị formatted content
- Download file
- Fallback view

**Cách sử dụng:**
```tsx
import DOCXPreview from './previews/DOCXPreview';

<DOCXPreview 
  fileUrl="https://example.com/file.docx"
  fileName="document.docx"
  onError={(error) => console.error(error)}
  onLoading={(loading) => setLoading(loading)}
/>
```

## 📄 TXTPreview

**Tính năng:**
- Hiển thị text với line numbers
- Search trong file
- Word wrap toggle
- Copy to clipboard
- File statistics

**Cách sử dụng:**
```tsx
import TXTPreview from './previews/TXTPreview';

<TXTPreview 
  fileUrl="https://example.com/file.txt"
  fileName="document.txt"
  onError={(error) => console.error(error)}
  onLoading={(loading) => setLoading(loading)}
/>
```

## 📊 XLSXPreview

**Thư viện:** `xlsx` (SheetJS)

**Tính năng:**
- Hiển thị multiple sheets
- Table view với headers
- Giới hạn rows/columns để tối ưu performance
- Sheet navigation

**Cách sử dụng:**
```tsx
import XLSXPreview from './previews/XLSXPreview';

<XLSXPreview 
  fileUrl="https://example.com/file.xlsx"
  fileName="spreadsheet.xlsx"
  onError={(error) => console.error(error)}
  onLoading={(loading) => setLoading(loading)}
/>
```

## 🔧 FilePreview Component

Component chính để tự động detect file type và render preview tương ứng:

```tsx
import FilePreview from './FilePreview';

<FilePreview file={uploadedFile} />
```

**Supported file types:**
- `.pdf` → PDFPreview
- `.docx`, `.doc` → DOCXPreview  
- `.txt`, `.text` → TXTPreview
- `.xlsx`, `.xls` → XLSXPreview

## 🎨 UI Features

- **Responsive design** - Hoạt động tốt trên mobile và desktop
- **Loading states** - Spinner và skeleton loading
- **Error handling** - Graceful error messages
- **Fallback views** - Khi library chưa được cài đặt
- **Download buttons** - Tải file gốc
- **Lazy loading** - Components được load khi cần

## 🔄 Lazy Loading

Tất cả preview components được lazy load để tối ưu performance:

```tsx
const PDFPreview = lazy(() => import('./previews/PDFPreview'));
const DOCXPreview = lazy(() => import('./previews/DOCXPreview'));
// ...

<Suspense fallback={<LoadingSpinner />}>
  <PDFPreview {...props} />
</Suspense>
```

## 🚨 Lưu ý

1. **Dependencies:** Cần cài đặt các thư viện trước khi sử dụng
2. **File size:** Các file lớn có thể mất thời gian load
3. **CORS:** Đảm bảo file server hỗ trợ CORS
4. **Performance:** Excel files được giới hạn hiển thị để tránh lag
5. **Security:** Không load file từ nguồn không tin cậy

## 🔮 Tương lai

- [ ] Hỗ trợ thêm file types (PPT, Images, etc.)
- [ ] Caching mechanism
- [ ] Thumbnail generation
- [ ] Full-text search
- [ ] Annotation support
- [ ] Print functionality

## 🐛 Troubleshooting

**PDF không hiển thị:**
- Kiểm tra react-pdf đã được cài đặt
- Kiểm tra CORS policy
- Thử fallback với iframe

**DOCX lỗi format:**
- Mammoth có thể không hỗ trợ một số features
- Thử download file gốc

**Excel quá chậm:**
- Giảm maxRows và maxCols
- Sử dụng pagination

**Text encoding issues:**
- Kiểm tra file encoding (UTF-8 recommended)
- Thử với browser khác
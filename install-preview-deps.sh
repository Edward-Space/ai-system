#!/bin/bash

# Script để cài đặt các dependencies cho file preview components

echo "🚀 Cài đặt dependencies cho file preview..."

# Cài đặt react-pdf cho PDF preview
echo "📄 Cài đặt react-pdf..."
pnpm i react-pdf

# Cài đặt mammoth cho DOCX preview
echo "📝 Cài đặt mammoth..."
pnpm i mammoth

# Cài đặt xlsx cho Excel preview
echo "📊 Cài đặt xlsx..."
pnpm i xlsx

# Cài đặt types nếu cần
echo "🔧 Cài đặt types..."
pnpm i --save-dev @types/mammoth

echo "✅ Hoàn thành cài đặt dependencies!"
echo ""
echo "📋 Các thư viện đã cài đặt:"
echo "   - react-pdf: Preview PDF files"
echo "   - mammoth: Convert DOCX to HTML"
echo "   - xlsx: Parse Excel files"
echo ""
echo "🎯 Bây giờ bạn có thể sử dụng file preview với đầy đủ tính năng!"
echo "💡 Lưu ý: Sau khi cài đặt, hãy uncomment các import trong preview components."
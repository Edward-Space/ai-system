"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, Image, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onImageSelect?: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedImageTypes?: string[];
  acceptedFileTypes?: string[];
  showPreview?: boolean;
}

interface FilePreviewProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
  maxFiles: number;
}

interface UploadedFile {
  file: File;
  id: string;
  type: 'image' | 'file';
  preview?: string;
}

// Component hiển thị preview files
function FilePreview({ uploadedFiles, onRemoveFile, maxFiles }: FilePreviewProps) {
  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mb-3 space-y-2">
      <div className="text-sm text-muted-foreground">
        Uploaded files ({uploadedFiles.length}/{maxFiles}):
      </div>
      <div className="flex flex-wrap gap-2">
        {uploadedFiles.map((uploadedFile) => (
          <div
            key={uploadedFile.id}
            className="relative group bg-background border rounded-lg p-2 flex items-center gap-2 max-w-[200px]"
          >
            {uploadedFile.type === 'image' ? (
              <div className="flex items-center gap-2">
                {uploadedFile.preview && (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {uploadedFile.file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(1)}MB
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {uploadedFile.file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(1)}MB
                  </div>
                </div>
              </div>
            )}
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(uploadedFile.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FileUpload({
  onFileSelect,
  onImageSelect,
  disabled = false,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  acceptedFileTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  showPreview = true
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File, type: 'image' | 'file'): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const acceptedTypes = type === 'image' ? acceptedImageTypes : acceptedFileTypes;
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }

    return null;
  };

  const handleFileSelect = (files: FileList | null, type: 'image' | 'file') => {
    if (!files || disabled) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check total files limit
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileArray.forEach(file => {
      const error = validateFile(file, type);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Create uploaded file objects
    const newUploadedFiles: UploadedFile[] = validFiles.map(file => {
      const uploadedFile: UploadedFile = {
        file,
        id: generateId(),
        type
      };

      // Create preview for images
      if (type === 'image') {
        uploadedFile.preview = URL.createObjectURL(file);
      }

      return uploadedFile;
    });

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Call callbacks
    if (type === 'image' && onImageSelect) {
      onImageSelect(validFiles);
    } else if (type === 'file' && onFileSelect) {
      onFileSelect(validFiles);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleImageClick = () => {
    if (!disabled) {
      imageInputRef.current?.click();
    }
  };

  const handleFileClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {/* Uploaded Files Preview đã được chuyển lên ChatSection.tsx */}
      
      {/* Upload Buttons */}
      <div className="w-fit flex gap-2">
        <Button
          type="button"
          onClick={handleImageClick}
          disabled={disabled}
          className="rounded-full bg-primary/80 group hover:w-[150px] transition-all duration-300 cursor-pointer disabled:opacity-50"
          size={"icon"}
        >
          <span className="group-hover:block hidden transition-all duration-300">
            Upload Image
          </span>
          <Image />
        </Button>
        
        <Button
          type="button"
          onClick={handleFileClick}
          disabled={disabled}
          className="rounded-full bg-primary/80 group hover:w-[150px] transition-all duration-300 cursor-pointer disabled:opacity-50"
          size={"icon"}
        >
          <span className="group-hover:block hidden transition-all duration-300">
            Upload File
          </span>
          <CloudUpload />
        </Button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept={acceptedImageTypes.join(',')}
        multiple
        onChange={(e) => handleFileSelect(e.target.files, 'image')}
        className="hidden"
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(',')}
        multiple
        onChange={(e) => handleFileSelect(e.target.files, 'file')}
        className="hidden"
      />
    </div>
  );
}
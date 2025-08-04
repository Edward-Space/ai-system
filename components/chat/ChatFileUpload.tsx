"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, AlertCircle, Paperclip, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface IChatUploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "error";
  progress: number;
  file_id?: string;
  originalFile?: File;
}

interface ChatFileUploadProps {
  onFileSelect: (files: File[], urls: string[]) => void;
  onImageSelect: (images: File[], urls: string[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "text/plain": [".txt"],
  "text/rtf": [".rtf"],
  "application/msword": [".doc"],
  "application/vnd.ms-powerpoint": [".ppt"],
};

const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const CHUNK_SIZE = 1024 * 1024; // 1MB
const STORAGE_TYPE = "local";

export default function ChatFileUpload({
  onFileSelect,
  onImageSelect,
  disabled = false,
  maxFiles = 5,
  maxFileSize = 10,
}: ChatFileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<IChatUploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFileToServer = async (file: File, targetFileId?: string): Promise<{ fileId: string; url: string } | null> => {
    try {
      // Step 1: Create file metadata
      const fileMetadata = {
        mime_type: file.type,
        name: file.name,
        path: file.name,
        size: file.size,
        storage_type: STORAGE_TYPE,
      };

      const metadataResponse = await axiosInstance.post("/api/v1/files", fileMetadata);
      const fileId = metadataResponse.data.data.id;
      const fileUrl = metadataResponse.data.data.url; // Lấy URL từ response

      if (!fileId) {
        throw new Error("Không nhận được file ID từ server");
      }

      // Step 2: Upload file chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const isLast = chunkIndex === totalChunks - 1;

        const formData = new FormData();
        formData.append("file_id", fileId);
        formData.append("chunk_index", (chunkIndex).toString());
        formData.append("is_last", isLast.toString());
        formData.append("chunk", chunk);

        await axiosInstance.post("/api/v1/files/chunks", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Update progress
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        if (targetFileId) {
          setUploadedFiles((prev: IChatUploadFile[]) =>
            prev.map((f: IChatUploadFile) =>
              f.id === targetFileId ? { ...f, progress } : f
            )
          );
        }
      }

      return { fileId, url: fileUrl };
    } catch (error: any) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);

    const newFiles: IChatUploadFile[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      originalFile: file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    const uploadedFilesList: File[] = [];
    const uploadedImagesList: File[] = [];
    const uploadedFileUrls: string[] = [];
    const uploadedImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const targetFile = newFiles[i];
      
      try {
        const result = await uploadFileToServer(file, targetFile?.id);
        
        if (result) {
          setUploadedFiles((prev: IChatUploadFile[]) =>
            prev.map((f: IChatUploadFile) =>
              f.id === targetFile?.id
                ? { ...f, status: "uploaded", progress: 100, file_id: result.fileId }
                : f
            )
          );
          
          // Phân loại file và image với URLs
          if (file.type.startsWith('image/')) {
            uploadedImagesList.push(file);
            uploadedImageUrls.push(result.url);
          } else {
            uploadedFilesList.push(file);
            uploadedFileUrls.push(result.url);
          }
          
          toast.success(`Tải lên thành công: ${file.name}`);
        }
      } catch (error: any) {
        setUploadedFiles((prev: IChatUploadFile[]) =>
          prev.map((f: IChatUploadFile) =>
            f.id === targetFile?.id ? { ...f, status: "error", progress: 0 } : f
          )
        );
        
        toast.error(`Lỗi tải lên ${file.name}: ${error.message}`);
      }
    }

    // Callback với files và URLs đã upload thành công
    if (uploadedFilesList.length > 0) {
      onFileSelect(uploadedFilesList, uploadedFileUrls);
    }
    if (uploadedImagesList.length > 0) {
      onImageSelect(uploadedImagesList, uploadedImageUrls);
    }

    setIsUploading(false);
  };

  const handleFileUploadCallback = useCallback(handleFileUpload, [onFileSelect, onImageSelect]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejection) => {
          const { file, errors } = rejection;
          errors.forEach((error: any) => {
            if (error.code === "file-too-large") {
              toast.error(`File ${file.name} quá lớn. Kích thước tối đa là ${maxFileSize}MB.`);
            } else if (error.code === "file-invalid-type") {
              toast.error(`File ${file.name} không được hỗ trợ.`);
            } else {
              toast.error(`Lỗi với file ${file.name}: ${error.message}`);
            }
          });
        });
      }

      if (acceptedFiles.length > 0) {
        handleFileUploadCallback(acceptedFiles);
      }
    },
    [handleFileUploadCallback, maxFileSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { ...ACCEPTED_FILE_TYPES, ...ACCEPTED_IMAGE_TYPES },
    maxSize: maxFileSize * 1024 * 1024,
    multiple: true,
    disabled: disabled || isUploading,
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const retryUpload = async (file: IChatUploadFile) => {
    if (file.originalFile) {
      removeFile(file.id);
      handleFileUpload([file.originalFile]);
    } else {
      toast.info("Để thử lại, vui lòng tải lên file một lần nữa.");
      removeFile(file.id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📊";
    return "📄";
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          (disabled || isUploading) && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center space-x-2">
          <Paperclip className="h-4 w-4" />
          <Image className="h-4 w-4" />
        </div>
        {isDragActive ? (
          <p className="text-sm mt-2">Thả files vào đây...</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">Kéo thả hoặc click để chọn files</p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ: PDF, DOCX, PPTX, TXT, Images (tối đa {maxFileSize}MB)
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Files đang tải ({uploadedFiles.length})</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-2 p-2 border rounded-lg text-sm"
              >
                <div className="text-lg">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-1">
                      {file.status === "uploaded" && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-5 w-5 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  {file.status === "uploading" && (
                    <div className="mt-1">
                      <Progress value={file.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground">
                        Uploading... {file.progress}%
                      </p>
                    </div>
                  )}
                  {file.status === "error" && (
                    <div className="mt-1">
                      <p className="text-xs text-red-500">Upload failed</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retryUpload(file)}
                        className="mt-1 h-5 text-xs"
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
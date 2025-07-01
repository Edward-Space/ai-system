"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { IUploadFile } from "@/model/knowledge";

interface UploadStepProps {
  uploadedFiles: IUploadFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<IUploadFile[]>>;
  onNext: () => void;
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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const CHUNK_SIZE = 1024 * 1024; // 1MB
const STORAGE_TYPE = "local";

export const UploadStep = ({ uploadedFiles, setUploadedFiles, onNext }: UploadStepProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFileToServer = async (file: File, targetFileId?: string): Promise<{fileId: string, fileUrl: string} | null> => {
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
      const fileData = metadataResponse.data.data;
      const fileId = fileData.id;
      const fileUrl = fileData.url;

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
          setUploadedFiles((prev: IUploadFile[]) =>
            prev.map((f: IUploadFile) =>
              f.id === targetFileId ? { ...f, progress } : f
            )
          );
        }
      }

      return { fileId, fileUrl };
    } catch (error: any) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    console.log(files);
    

    const newFiles: IUploadFile[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      localFile: file,
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const targetFile = newFiles[i]; // Use index to match exact file
      
      try {
        const result = await uploadFileToServer(file, targetFile?.id);
        
        setUploadedFiles((prev: IUploadFile[]) =>
          prev.map((f: IUploadFile) =>
            f.id === targetFile?.id
              ? { 
                  ...f, 
                  status: "uploaded", 
                  progress: 100, 
                  file_id: result?.fileId || undefined,
                  file_url: result?.fileUrl || undefined
                }
              : f
          )
        );
        
        toast.success(`Tải lên thành công: ${file.name}`);
      } catch (error: any) {
        setUploadedFiles((prev: IUploadFile[]) =>
          prev.map((f: IUploadFile) =>
            f.id === targetFile?.id ? { ...f, status: "error", progress: 0 } : f
          )
        );
        
        toast.error(`Lỗi tải lên ${file.name}: ${error.message}`);
      }
    }

    setIsUploading(false);
  };

  const handleFileUploadCallback = useCallback(handleFileUpload, [uploadedFiles]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejection) => {
          const { file, errors } = rejection;
          errors.forEach((error: any) => {
            if (error.code === "file-too-large") {
              toast.error(`File ${file.name} quá lớn. Kích thước tối đa là 50MB.`);
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
    [handleFileUploadCallback]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
  };

  const retryUpload = async (file: IUploadFile) => {
    // Find the original file object (this is a limitation - we'd need to store it)
    toast.info("Để thử lại, vui lòng tải lên file một lần nữa.");
    removeFile(file.id);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📊";
    return "📄";
  };

  const canProceed = uploadedFiles.length > 0 && uploadedFiles.every((file) => file.status === "uploaded");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Upload Documents</h2>
        <p className="text-muted-foreground">
          Upload your documents to create knowledge base. Supported formats: PDF, DOCX, PPTX, TXT, RTF
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Thả files vào đây...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">Kéo thả files vào đây hoặc click để chọn</p>
                <p className="text-sm text-muted-foreground">
                  Hỗ trợ: PDF, DOCX, PPTX, TXT, RTF (tối đa 50MB mỗi file)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Uploaded Files ({uploadedFiles.length})</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        {file.status === "uploaded" && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    {file.status === "uploading" && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploading... {file.progress}%
                        </p>
                      </div>
                    )}
                    {file.status === "error" && (
                      <div className="mt-2">
                        <p className="text-xs text-red-500">Upload failed</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryUpload(file)}
                          className="mt-1 h-6 text-xs"
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <div></div>
        <Button
          onClick={onNext}
          disabled={!canProceed || isUploading}
          className="px-8"
        >
          Next: Create Setting
        </Button>
      </div>
    </div>
  );
};
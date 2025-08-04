"use client";

import { useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Upload, X } from "lucide-react";
import LocalFilePreview from "./LocalFilePreview";
import FilePreview from "./FilePreview";
import ClientOnly from "@/components/common/ClientOnly";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "error";
  progress: number;
  file_id?: string;
  localFile?: File;
}

const LocalFilePreviewDemo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [previewMode, setPreviewMode] = useState<"local" | "filepreview">(
    "local"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create UploadedFile object for FilePreview component
      const uploadedFileObj: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
        localFile: file,
      };
      setUploadedFile(uploadedFileObj);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Local File Preview Demo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Test preview file local với LocalFilePreview và FilePreview
            components
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button onClick={triggerFileSelect} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Chọn file
              </Button>
              {selectedFile && (
                <Button onClick={clearFile} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Xóa file
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.jpg,.jpeg,.png,.gif,.webp,.svg"
            />
            {selectedFile && (
              <div className="text-sm text-muted-foreground">
                Đã chọn: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* Preview Mode Toggle */}
          {selectedFile && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Chế độ preview:</label>
              <div className="flex gap-2">
                <Button
                  variant={previewMode === "local" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("local")}
                >
                  LocalFilePreview
                </Button>
                <Button
                  variant={
                    previewMode === "filepreview" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setPreviewMode("filepreview")}
                >
                  FilePreview
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Area */}
      {selectedFile && (
        <div className="grid grid-cols-1 gap-6">
          {previewMode === "local" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                LocalFilePreview Component
              </h3>
              <LocalFilePreview file={selectedFile} />
            </div>
          )}

          {previewMode === "filepreview" && uploadedFile && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                FilePreview Component (với localFile)
              </h3>
              <ClientOnly>
                {" "}
                <FilePreview file={uploadedFile} />
              </ClientOnly>
            </div>
          )}
        </div>
      )}

      {!selectedFile && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chọn file để preview</h3>
            <p className="text-muted-foreground mb-4">
              Hỗ trợ: PDF, DOCX, TXT, XLSX, và hình ảnh
            </p>
            <Button onClick={triggerFileSelect}>
              <Upload className="h-4 w-4 mr-2" />
              Chọn file
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocalFilePreviewDemo;

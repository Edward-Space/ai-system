"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { FileText, Download, AlertCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { cn } from "@/lib/utils";

// Lazy load preview components for better performance
const PDFPreview = lazy(() => import("./previews").then(module => ({ default: module.PDFPreview })));
const DOCXPreview = lazy(() => import("./previews").then(module => ({ default: module.DOCXPreview })));
const TXTPreview = lazy(() => import("./previews").then(module => ({ default: module.TXTPreview })));
const XLSXPreview = lazy(() => import("./previews").then(module => ({ default: module.XLSXPreview })));

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  file_id?: string;
}

interface FilePreviewProps {
  file: UploadedFile;
}

type FileType = 'pdf' | 'docx' | 'txt' | 'xlsx' | 'unknown';

const FilePreview = ({ file }: FilePreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFileType = (fileName: string): FileType => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'docx':
      case 'doc':
        return 'docx';
      case 'txt':
      case 'text':
        return 'txt';
      case 'xlsx':
      case 'xls':
        return 'xlsx';
      default:
        return 'unknown';
    }
  };

  const generateFileUrl = (fileId: string): string => {
    // Generate URL for file preview
    return `https://file-aisystem.newweb.vn/media/${fileId}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = () => {
    if (!file.file_id) return;
    const url = generateFileUrl(file.file_id);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Đang tải...</span>
    </div>
  );

  const fileType = getFileType(file.name);

  const renderPreview = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Lỗi khi tải file</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={downloadFile} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Tải xuống file
          </Button>
        </div>
      );
    }

    const commonProps = {
      fileUrl: file.file_id ? generateFileUrl(file.file_id) : "",
      fileName: file.name,
      onError: setError,
      onLoading: setIsLoading
    };

    switch (fileType) {
      case 'pdf':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PDFPreview {...commonProps} />
          </Suspense>
        );
      
      case 'docx':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DOCXPreview {...commonProps} />
          </Suspense>
        );
      
      case 'txt':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TXTPreview {...commonProps} />
          </Suspense>
        );
      
      case 'xlsx':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <XLSXPreview {...commonProps} />
          </Suspense>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Không hỗ trợ preview</h3>
            <p className="text-muted-foreground mb-4">
              File type .{fileType} chưa được hỗ trợ preview
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>Các định dạng được hỗ trợ:</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="bg-muted px-2 py-1 rounded">.pdf</span>
                <span className="bg-muted px-2 py-1 rounded">.docx</span>
                <span className="bg-muted px-2 py-1 rounded">.txt</span>
                <span className="bg-muted px-2 py-1 rounded">.xlsx</span>
              </div>
            </div>
            <Button onClick={downloadFile} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Tải xuống file
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span className="truncate">{file.name}</span>
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadFile}
            disabled={!file.file_id}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            renderPreview()
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FilePreview;
export type { FilePreviewProps, UploadedFile };
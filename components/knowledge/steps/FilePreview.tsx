"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { FileText, Download, AlertCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import dynamic from "next/dynamic";
import LocalFilePreview from "./LocalFilePreview";

// Lazy load preview components for better performance
// Use dynamic import for PDFPreview to avoid SSR issues
const PDFPreview = dynamic(() => import("./previews/PDFPreview"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Đang tải PDF Preview...</span>
    </div>
  ),
});

const DOCXPreview = lazy(() => import("./previews/DOCXPreview"));
const TXTPreview = lazy(() => import("./previews/TXTPreview"));
const XLSXPreview = lazy(() => import("./previews/XLSXPreview"));

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "error";
  progress: number;
  file_id?: string;
  file_url?: string;
  localFile?: File;
}

interface FilePreviewProps {
  file: UploadedFile;
}

type FileType = "pdf" | "docx" | "txt" | "xlsx" | "unknown";

const FilePreview = ({ file }: FilePreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  console.log(file);
  
  // Create blob URL for local file preview
  useEffect(() => {
    if (file.localFile) {
      const url = URL.createObjectURL(file.localFile);
      setLocalFileUrl(url);

      // Cleanup blob URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
        setLocalFileUrl(null);
      };
    } else {
      setLocalFileUrl(null);
    }
  }, [file.localFile]);

  const getFileType = (fileName: string): FileType => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    switch (extension) {
      case "pdf":
        return "pdf";
      case "docx":
      case "doc":
        return "docx";
      case "txt":
      case "text":
        return "txt";
      case "xlsx":
      case "xls":
        return "xlsx";
      default:
        return "unknown";
    }
  };

  const generateFileUrl = (fileId: string): string => {
    // Generate URL for file preview - match the format used in API calls
    const fileType = getFileType(file.name);
    const extension =
      fileType === "unknown" ? file.name.split(".").pop() || "pdf" : fileType;
    const url = `https://file-aisystem.newweb.vn/media/Document/${fileId}.${extension}`;
    console.log(
      "Generated file URL:",
      url,
      "for file:",
      file.name,
      "fileId:",
      fileId
    );
    return url;
  };

  const getPreviewUrl = (): string => {
    // Priority: local file URL > server file URL
    if (localFileUrl) {
      return localFileUrl;
    }
    if (file.file_url) {
      return file.file_url;
    }
    // Fallback to generated URL if file_url is not available
    if (file.file_id) {
      return generateFileUrl(file.file_id);
    }
    return "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const downloadFile = () => {
    let url = "";
    if (file.file_url) {
      url = file.file_url;
    } else if (file.file_id) {
      url = generateFileUrl(file.file_id);
    } else {
      return;
    }
    
    const link = document.createElement("a");
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

    const previewUrl = getPreviewUrl();

    // If no preview URL available, show message
    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Chưa có file để preview</h3>
          <p className="text-muted-foreground mb-4">
            File chưa được upload hoặc chưa có dữ liệu local
          </p>
        </div>
      );
    }

    const commonProps = {
      fileUrl: previewUrl,
      fileName: file.name,
      onError: setError,
      onLoading: setIsLoading,
    };

    // For local files, use LocalFilePreview component
    if (file.localFile) {
      return <LocalFilePreview file={file.localFile} />;
    }

    switch (fileType) {
      case "pdf":
        return (
            <PDFPreview file={file} onError={setError} onLoading={setIsLoading} />
        );

      case "docx":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DOCXPreview {...commonProps} />
          </Suspense>
        );

      case "txt":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TXTPreview {...commonProps} />
          </Suspense>
        );

      case "xlsx":
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
        <ScrollArea className="h-[400px]">{renderPreview()}</ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FilePreview;
export type { FilePreviewProps, UploadedFile };

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { FileText, Download, AlertCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";

interface LocalFilePreviewProps {
  file: File;
  className?: string;
}

type FileType = "pdf" | "docx" | "txt" | "xlsx" | "image" | "unknown";

const LocalFilePreview = ({ file, className }: LocalFilePreviewProps) => {
  console.log(file);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);

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
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
      case "svg":
        return "image";
      default:
        return "unknown";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const downloadFile = () => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create blob URL and handle text files
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setIsLoading(true);
    setError(null);

    const fileType = getFileType(file.name);

    // For text files, read content directly
    if (fileType === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError("Không thể đọc file text");
        setIsLoading(false);
      };
      reader.readAsText(file);
    } else {
      // For other files, just set loading to false
      setIsLoading(false);
    }

    // Cleanup blob URL when component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const fileType = getFileType(file.name);

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải preview...</span>
        </div>
      );
    }

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

    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Không thể tạo preview</h3>
          <p className="text-muted-foreground mb-4">
            Không thể tạo URL cho file này
          </p>
        </div>
      );
    }

    switch (fileType) {
      case "image":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={fileUrl}
              alt={file.name}
              className="max-w-full max-h-[350px] object-contain rounded"
              onError={() => setError("Không thể hiển thị hình ảnh")}
            />
          </div>
        );

      case "txt":
        return (
          <div className="w-full h-full">
            <div className="mb-2 text-sm text-muted-foreground">
              📄 Text file: {file.name}
            </div>
            <ScrollArea className="h-[350px] w-full border rounded p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {textContent || "Đang tải nội dung..."}
              </pre>
            </ScrollArea>
          </div>
        );

      case "pdf":
      case "docx":
      case "xlsx":
        return (
          <div className="w-full h-full">
            <div className="mb-2 text-sm text-muted-foreground">
              📁 Preview file: {file.name}
            </div>
            <iframe
              src={fileUrl}
              className="w-full h-[350px] border rounded"
              title={`Preview of ${file.name}`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError("Trình duyệt không hỗ trợ preview file này");
                setIsLoading(false);
              }}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              💡 Nếu không hiển thị, hãy thử tải xuống file để xem
            </div>
          </div>
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
                <span className="bg-muted px-2 py-1 rounded">.jpg/.png</span>
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
    <Card className={`h-full ${className || ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span className="truncate">{file.name}</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            LOCAL
          </span>
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadFile}
            disabled={!fileUrl}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {renderPreview()}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LocalFilePreview;
export type { LocalFilePreviewProps };
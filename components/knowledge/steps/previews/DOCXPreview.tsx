"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Note: Cần cài đặt mammoth
// npm install mammoth
// import mammoth from 'mammoth';

interface DOCXPreviewProps {
  fileUrl: string;
  fileName: string;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

const DOCXPreview = ({ fileUrl, fileName, onError, onLoading }: DOCXPreviewProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    if (useFallback) {
      setIsLoading(false);
      return;
    }

    const loadDocx = async () => {
      try {
        setIsLoading(true);
        
        // Fetch file as ArrayBuffer
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Convert DOCX to HTML using mammoth
        // const result = await mammoth.convertToHtml({ arrayBuffer });
        // setHtmlContent(result.value);
        
        // Temporary placeholder
        setHtmlContent(`
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h3>DOCX Content Preview</h3>
            <p>File: ${fileName}</p>
            <p>Nội dung DOCX sẽ được hiển thị ở đây sau khi cài đặt mammoth library.</p>
            <p><code>npm install mammoth</code></p>
          </div>
        `);
        
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        onError(`Lỗi khi tải DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    loadDocx();
  }, [fileUrl, fileName, onError, useFallback]);

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fallback view
  if (useFallback) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">DOCX Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadFile}
            >
              <Download className="h-4 w-4 mr-1" />
              Tải xuống
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseFallback(false)}
            >
              Thử preview
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-8 text-center bg-muted/20">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">{fileName}</h3>
          <p className="text-muted-foreground mb-4">
            DOCX files cần được convert để preview
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>💡 Để preview DOCX files, cài đặt:</p>
            <code className="bg-muted px-2 py-1 rounded">npm install mammoth</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">DOCX Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadFile}
          >
            <Download className="h-4 w-4 mr-1" />
            Tải xuống
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseFallback(true)}
          >
            Về fallback
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="border rounded-lg overflow-auto max-h-[500px] bg-white">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang convert DOCX...</p>
          </div>
        ) : (
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
};

export default DOCXPreview;
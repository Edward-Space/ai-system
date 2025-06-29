"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Note: Cần cài đặt react-pdf
// npm install react-pdf
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFPreviewProps {
  fileUrl: string;
  fileName: string;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

const PDFPreview = ({ fileUrl, fileName, onError, onLoading }: PDFPreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Temporary fallback using iframe until react-pdf is installed
  const [useIframe, setUseIframe] = useState(true);

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    setIsLoading(false);
    onError(`Lỗi khi tải PDF: ${error.message}`);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Fallback với iframe cho đến khi cài đặt react-pdf
  if (useIframe) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <span className="text-sm font-medium">PDF Preview</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, '_blank')}
            >
              Mở trong tab mới
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            width="100%"
            height="500px"
            className="border-0"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              onError('Không thể tải PDF preview');
            }}
          />
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          💡 Để có trải nghiệm preview tốt hơn, hãy cài đặt: npm install react-pdf
        </div>
      </div>
    );
  }

  // Code cho react-pdf (sẽ được kích hoạt sau khi cài đặt)
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Trang {pageNumber} / {numPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="border rounded-lg overflow-auto max-h-[500px] bg-gray-100">
        <div className="flex justify-center p-4">
          
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="text-center p-8">Đang tải PDF...</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
         
          <div className="text-center p-8 text-muted-foreground">
            <p>React-PDF component sẽ được hiển thị ở đây</p>
            <p className="text-sm mt-2">Cài đặt: npm install react-pdf</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
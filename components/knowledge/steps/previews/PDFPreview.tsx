"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { UploadedFile } from "../FilePreview";
interface PDFPreviewProps {
  file: UploadedFile;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

const PDFPreview = ({ file, onError, onLoading }: PDFPreviewProps) => {
  console.log(file);
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check if react-pdf is loaded and available
  const [reactPdfLoaded, setReactPdfLoaded] = useState(false);

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    // Set a timeout to stop loading if iframe doesn't load within 10 seconds
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("PDF loading timeout");
        setIsLoading(false);
        onError("Timeout khi tải PDF. Vui lòng thử lại.");
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isLoading, onError]);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

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
          {reactPdfLoaded ? (
            // <Document
            //   file={fileUrl}
            //   onLoadSuccess={onDocumentLoadSuccess}
            //   onLoadError={onDocumentLoadError}
            //   loading={<div className="text-center p-8">Đang tải PDF...</div>}
            // >
            //   <Page
            //     pageNumber={pageNumber}
            //     scale={scale}
            //     rotate={rotation}
            //     renderTextLayer={false}
            //     renderAnnotationLayer={false}
            //   />
            // </Document>
            //    <iframe
            //   src={URL.createObjectURL(file.blob)}
            //   width="100%"
            //   className="border-0"
            //   style={{ height: "49vh" }}
            // >
            //   <p>
            //     Your browser doesn't support PDF preview.
            //     <a
            //       href={URL.createObjectURL(currentFile?.blob)}
            //       target="_blank"
            //       rel="noreferrer"
            //     >
            //       Download the PDF
            //     </a>
            //   </p>
            // </iframe>
            <></>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <p>Đang tải React-PDF component...</p>
              <p className="text-sm mt-2">
                Nếu không load được, hãy cài đặt: npm install react-pdf
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;

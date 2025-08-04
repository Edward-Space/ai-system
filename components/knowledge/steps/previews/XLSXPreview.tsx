"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Download, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Note: Cần cài đặt xlsx
// npm install xlsx
// import * as XLSX from 'xlsx';

interface XLSXPreviewProps {
  fileUrl: string;
  fileName: string;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

interface SheetData {
  name: string;
  data: any[][];
  headers: string[];
}

const XLSXPreview = ({ fileUrl, fileName, onError, onLoading }: XLSXPreviewProps) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(true);
  const [maxRows, setMaxRows] = useState(100); // Giới hạn số dòng hiển thị
  const [maxCols, setMaxCols] = useState(20); // Giới hạn số cột hiển thị

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    if (useFallback) {
      setIsLoading(false);
      return;
    }

    const loadExcelFile = async () => {
      try {
        setIsLoading(true);
        
        // Fetch file as ArrayBuffer
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Parse Excel file using SheetJS
        // const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // const sheetsData: SheetData[] = workbook.SheetNames.map(sheetName => {
        //   const worksheet = workbook.Sheets[sheetName];
        //   const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        //   
        //   const headers = jsonData[0] as string[] || [];
        //   const data = jsonData.slice(1) as any[][];
        //   
        //   return {
        //     name: sheetName,
        //     headers,
        //     data
        //   };
        // });
        
        // Temporary mock data
        const sheetsData: SheetData[] = [
          {
            name: "Sheet1",
            headers: ["Cột A", "Cột B", "Cột C", "Cột D"],
            data: [
              ["Dữ liệu 1", "Dữ liệu 2", "Dữ liệu 3", "Dữ liệu 4"],
              ["Excel file", "sẽ được", "hiển thị", "ở đây"],
              ["sau khi", "cài đặt", "xlsx", "library"]
            ]
          },
          {
            name: "Sheet2",
            headers: ["Header 1", "Header 2"],
            data: [
              ["Sample", "Data"],
              ["More", "Content"]
            ]
          }
        ];
        
        setSheets(sheetsData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        onError(`Lỗi khi tải Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    loadExcelFile();
  }, [fileUrl, onError, useFallback]);

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentSheet = sheets[currentSheetIndex];
  
  const displayData = currentSheet?.data.slice(0, maxRows) || [];
  const displayHeaders = currentSheet?.headers.slice(0, maxCols) || [];

  // Fallback view
  if (useFallback) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="text-sm font-medium">XLSX Preview</span>
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
          <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">{fileName}</h3>
          <p className="text-muted-foreground mb-4">
            Excel files cần được parse để preview
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>💡 Để preview Excel files, cài đặt:</p>
            <code className="bg-muted px-2 py-1 rounded">npm install xlsx</code>
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
          <FileSpreadsheet className="h-4 w-4" />
          <span className="text-sm font-medium">XLSX Preview</span>
          {sheets.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({sheets[currentSheetIndex]?.data.length || 0} dòng)
            </span>
          )}
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

      {/* Sheet Tabs */}
      {sheets.length > 1 && (
        <div className="flex items-center gap-1 p-1 bg-muted/30 rounded">
          {sheets.map((sheet, index) => (
            <Button
              key={index}
              variant={index === currentSheetIndex ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentSheetIndex(index)}
              className="h-8"
            >
              {sheet.name}
            </Button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="border rounded-lg overflow-auto max-h-[500px] bg-white">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang parse Excel file...</p>
          </div>
        ) : currentSheet ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              {/* Headers */}
              {displayHeaders.length > 0 && (
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="w-12 p-2 text-center border-r text-xs text-muted-foreground">
                      #
                    </th>
                    {displayHeaders.map((header, index) => (
                      <th key={index} className="p-2 text-left border-r font-medium min-w-[100px]">
                        {header || `Cột ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              
              {/* Data */}
              <tbody>
                {displayData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/20">
                    <td className="w-12 p-2 text-center border-r text-xs text-muted-foreground bg-muted/30">
                      {rowIndex + 1}
                    </td>
                    {displayHeaders.map((_, colIndex) => (
                      <td key={colIndex} className="p-2 border-r">
                        <div className="max-w-[200px] truncate" title={row[colIndex]}>
                          {row[colIndex] || ''}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Show truncation info */}
            {(currentSheet.data.length > maxRows || currentSheet.headers.length > maxCols) && (
              <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20">
                {currentSheet.data.length > maxRows && (
                  <p>Hiển thị {maxRows} / {currentSheet.data.length} dòng</p>
                )}
                {currentSheet.headers.length > maxCols && (
                  <p>Hiển thị {maxCols} / {currentSheet.headers.length} cột</p>
                )}
                <p className="text-xs mt-1">Tải xuống file để xem toàn bộ dữ liệu</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <FileSpreadsheet className="h-16 w-16 mx-auto mb-4" />
            <p>Không có dữ liệu để hiển thị</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default XLSXPreview;
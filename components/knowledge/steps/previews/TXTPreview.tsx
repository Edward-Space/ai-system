"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Download, FileText, Search, Copy, Check } from "lucide-react";
import { Input } from "../../../ui/input";
import { cn } from "@/lib/utils";

interface TXTPreviewProps {
  fileUrl: string;
  fileName: string;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

const TXTPreview = ({ fileUrl, fileName, onError, onLoading }: TXTPreviewProps) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    const loadTextFile = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        setContent(text);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        onError(`Lỗi khi tải file text: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    loadTextFile();
  }, [fileUrl, onError]);

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      onError('Không thể copy nội dung');
    }
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  const formatContent = () => {
    if (!content) return "";
    
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const highlightedLine = highlightSearchTerm(line);
      
      return (
        <div key={index} className="flex hover:bg-muted/30">
          {lineNumbers && (
            <div className="flex-shrink-0 w-12 px-2 py-0.5 text-xs text-muted-foreground text-right border-r select-none">
              {lineNumber}
            </div>
          )}
          <div 
            className={cn(
              "flex-1 px-3 py-0.5 text-sm font-mono",
              !wordWrap && "whitespace-nowrap overflow-x-auto"
            )}
            dangerouslySetInnerHTML={{ __html: highlightedLine }}
          />
        </div>
      );
    });
  };

  const getFileStats = () => {
    if (!content) return { lines: 0, characters: 0, words: 0 };
    
    const lines = content.split('\n').length;
    const characters = content.length;
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    return { lines, characters, words };
  };

  const stats = getFileStats();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Text Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!content}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? 'Đã copy' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadFile}
            >
              <Download className="h-4 w-4 mr-1" />
              Tải xuống
            </Button>
          </div>
        </div>
        
        {/* Search and Options */}
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm trong file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={lineNumbers ? "default" : "outline"}
              size="sm"
              onClick={() => setLineNumbers(!lineNumbers)}
            >
              Số dòng
            </Button>
            <Button
              variant={wordWrap ? "default" : "outline"}
              size="sm"
              onClick={() => setWordWrap(!wordWrap)}
            >
              Word wrap
            </Button>
          </div>
        </div>
      </div>

      {/* File Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground px-2">
        <span>{stats.lines} dòng</span>
        <span>{stats.characters} ký tự</span>
        <span>{stats.words} từ</span>
        {searchTerm && (
          <span className="text-primary">
            {(content.match(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length} kết quả
          </span>
        )}
      </div>

      {/* Content */}
      <div className="border rounded-lg overflow-auto max-h-[500px] bg-white dark:bg-gray-950">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải file...</p>
          </div>
        ) : content ? (
          <div className="text-sm">
            {formatContent()}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4" />
            <p>File trống hoặc không có nội dung</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TXTPreview;
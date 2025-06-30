"use client";

import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Eye, FileText, Loader2 } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { cn } from "@/lib/utils";
import FilePreview from "./FilePreview";
import { IUploadFile } from "@/model/knowledge";
import ClientOnly from "@/components/common/ClientOnly";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "error";
  progress: number;
  file_id?: string;
}

interface SegmentedPreviewStepProps {
  onNext: () => void;
  onPrev: () => void;
  uploadedFiles: UploadedFile[];
  selectedSegmentationOption: string | null;
}

interface SegmentPreview {
  id: string;
  content: string;
  metadata?: any;
}

export const SegmentedPreviewStep = ({
  onNext,
  onPrev,
  uploadedFiles,
  selectedSegmentationOption,
}: SegmentedPreviewStepProps) => {
  const [selectedFile, setSelectedFile] = useState<IUploadFile | null>(null);
  const [segmentPreviews, setSegmentPreviews] = useState<SegmentPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Filter uploaded files to only show successfully uploaded ones
  const uploadedFilesList = uploadedFiles.filter(
    (file) => file.status === "uploaded" && file.file_id
  );
  // Auto-select first file if available
  useEffect(() => {
    if (uploadedFilesList.length > 0 && !selectedFile) {
      setSelectedFile(uploadedFilesList[0]);
    }
  }, [uploadedFilesList, selectedFile]);

  // Fetch segment preview when file is selected
  useEffect(() => {
    if (selectedFile && selectedFile.file_id) {
      fetchSegmentPreview(selectedFile.file_id);
    }
  }, [selectedFile]);

  const fetchSegmentPreview = async (fileId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/segments/preview", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          chunking_strategy:
            selectedSegmentationOption === "Automatic segmentation & Cleaning"
              ? "auto"
              : "custom",
          document_url: `https://file-aisystem.newweb.vn/media/Document/${fileId}.pdf`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API response to SegmentPreview format
      if (data.segments && Array.isArray(data.segments)) {
        const previews: SegmentPreview[] = data.segments.map(
          (segment: any, index: number) => ({
            id: segment.id || `segment-${index}`,
            content: segment.content || segment.text || "",
            metadata: segment.metadata || {},
          })
        );
        setSegmentPreviews(previews);
      } else {
        setSegmentPreviews([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch segment preview"
      );
      setSegmentPreviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Segmented Preview</h2>
        <p className="text-muted-foreground">
          Preview how your content will be segmented using{" "}
          {selectedSegmentationOption}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Column 1: File List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files ({uploadedFilesList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-2">
                {uploadedFilesList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-2" />
                    <p>No uploaded files found</p>
                  </div>
                ) : (
                  uploadedFilesList.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedFile?.id === file.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="font-medium text-sm truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(file.size)} • {file.type}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Column 2: File Preview */}
        <div className="flex-1">
          {selectedFile ? (
            <ClientOnly>
              {" "}
              <FilePreview file={selectedFile} />
            </ClientOnly>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <FileText className="mx-auto h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">
                    Chọn file để xem preview
                  </p>
                  <p className="text-sm">Hỗ trợ: PDF, DOCX, TXT, XLSX</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Column 3: Segment Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {!isLoading && <Eye className="h-5 w-5" />}
              Segment Preview ({segmentPreviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Loading segments...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p className="font-medium mb-2">Error loading segments</p>
                    <p className="text-sm">{error}</p>
                  </div>
                ) : segmentPreviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="mx-auto h-12 w-12 mb-2" />
                    <p>No segments available</p>
                    <p className="text-xs mt-1">
                      Select a file to view segments
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {segmentPreviews.map((segment, index) => (
                      <div key={segment.id} className="p-3 border rounded-lg">
                        <div className="text-xs text-muted-foreground mb-2">
                          Segment {index + 1}
                        </div>
                        <div className="text-sm">
                          {segment.content.length > 200
                            ? `${segment.content.substring(0, 200)}...`
                            : segment.content}
                        </div>
                        {segment.metadata &&
                          Object.keys(segment.metadata).length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <details>
                                <summary className="cursor-pointer">
                                  Metadata
                                </summary>
                                <pre className="mt-1 text-xs">
                                  {JSON.stringify(segment.metadata, null, 2)}
                                </pre>
                              </details>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous: Create Setting
        </Button>
        <Button onClick={onNext} disabled={uploadedFilesList.length === 0}>
          Next: Process Data
        </Button>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Paperclip, Image, Upload } from "lucide-react";
import ChatFileUpload from "./ChatFileUpload";

interface ChatUploadModalProps {
  onFileSelect: (files: File[], urls: string[]) => void;
  onImageSelect: (images: File[], urls: string[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
}

export default function ChatUploadModal({
  onFileSelect,
  onImageSelect,
  disabled = false,
  maxFiles = 5,
  maxFileSize = 10,
}: ChatUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (files: File[], urls: string[]) => {
    onFileSelect(files, urls);
    // Không đóng modal ngay, để user thấy progress
  };

  const handleImageSelect = (images: File[], urls: string[]) => {
    onImageSelect(images, urls);
    // Không đóng modal ngay, để user thấy progress
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="text-gray-500 hover:text-gray-700 [&_svg:not([class*='size-'])]:size-5 size-8"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Files & Images</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ChatFileUpload
            onFileSelect={handleFileSelect}
            onImageSelect={handleImageSelect}
            disabled={disabled}
            maxFiles={maxFiles}
            maxFileSize={maxFileSize}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-6"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client"

import React, { useState, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { Upload, X, User } from "lucide-react"

export interface AvatarUploadProps {
  /** Current avatar URL */
  value?: string
  /** Callback when avatar changes */
  onChange?: (file: File | null, url: string | null) => void
  /** Maximum file size in MB */
  maxSize?: number
  /** Accepted file types */
  accept?: string
  /** Avatar size */
  size?: "sm" | "md" | "lg" | "xl"
  /** Disabled state */
  disabled?: boolean
  /** Custom className */
  className?: string
  /** Show remove button */
  showRemove?: boolean
  /** Upload button text */
  uploadText?: string
  /** Remove button text */
  removeText?: string
  /** Error message */
  error?: string
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-20 w-20",
  lg: "h-24 w-24",
  xl: "h-32 w-32"
}

const AvatarUpload = React.forwardRef<HTMLDivElement, AvatarUploadProps>(
  ({
    value,
    onChange,
    maxSize = 5,
    accept = "image/*",
    size = "lg",
    disabled = false,
    className,
    showRemove = true,
    uploadText = "Upload Avatar",
    removeText = "Remove",
    error,
    ...props
  }, ref) => {
    const [preview, setPreview] = useState<string | null>(value || null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = useCallback(
      (file: File) => {
        if (disabled) return

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          console.error(`File size exceeds ${maxSize}MB limit`)
          return
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.error("Please select an image file")
          return
        }

        setIsLoading(true)

        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          setPreview(url)
          setIsLoading(false)
          onChange?.(file, url)
        }
        reader.onerror = () => {
          setIsLoading(false)
          console.error("Error reading file")
        }
        reader.readAsDataURL(file)
      },
      [disabled, maxSize, onChange]
    )

    const handleFileInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          handleFileSelect(file)
        }
      },
      [handleFileSelect]
    )

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (disabled) return

        const file = e.dataTransfer.files?.[0]
        if (file) {
          handleFileSelect(file)
        }
      },
      [disabled, handleFileSelect]
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragging(true)
      }
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
    }, [])

    const handleUploadClick = useCallback(() => {
      if (!disabled) {
        fileInputRef.current?.click()
      }
    }, [disabled])

    const handleRemove = useCallback(() => {
      if (!disabled) {
        setPreview(null)
        onChange?.(null, null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }, [disabled, onChange])

    // Sync with external value changes
    React.useEffect(() => {
      setPreview(value || null)
    }, [value])

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-4", className)}
        {...props}
      >
        {/* Avatar Display */}
        <div
          className={cn(
            "relative group cursor-pointer transition-all duration-200",
            sizeClasses[size],
            isDragging && "scale-105",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
        >
          <Avatar className={cn("w-full h-full border-2 border-dashed border-gray-300 transition-colors", {
            "border-blue-500": isDragging,
            "border-gray-200": disabled
          })}>
            {preview ? (
              <AvatarImage src={preview} alt="Avatar preview" className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gray-50">
                <User className="h-1/2 w-1/2 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>

          {/* Overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center",
            disabled && "hidden"
          )}>
            <Upload className="h-6 w-6 text-white" />
          </div>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        {/* Upload/Remove Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled || isLoading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploadText}
          </Button>

          {preview && showRemove && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isLoading}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              {removeText}
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Helper Text */}
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Drag and drop an image or click to upload. Max size: {maxSize}MB
        </p>
      </div>
    )
  }
)

AvatarUpload.displayName = "AvatarUpload"

export { AvatarUpload }
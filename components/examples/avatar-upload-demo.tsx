"use client"

import React, { useState } from "react"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AvatarUploadDemo() {
  const [avatar1, setAvatar1] = useState<string | null>(null)
  const [avatar2, setAvatar2] = useState<string | null>(null)
  const [avatar3, setAvatar3] = useState<string | null>(null)
  const [avatar4, setAvatar4] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAvatarChange = (file: File | null, url: string | null) => {
    setAvatar1(url)
    setUploadedFile(file)
    setError(null)
    
    if (file) {
      console.log("File uploaded:", {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type
      })
    }
  }

  const handleAvatarError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const resetAll = () => {
    setAvatar1(null)
    setAvatar2(null)
    setAvatar3(null)
    setAvatar4(null)
    setUploadedFile(null)
    setError(null)
  }

  const setDefaultAvatar = () => {
    const defaultUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    setAvatar2(defaultUrl)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Avatar Upload Component</h1>
        <p className="text-muted-foreground">
          A flexible avatar upload component with drag & drop, preview, and validation
        </p>
      </div>

      {/* Basic Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Usage</CardTitle>
          <CardDescription>
            Upload an avatar with default settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AvatarUpload
            value={avatar1 ?? ''}
            onChange={handleAvatarChange}
            error={error ??''}
          />
          
          {uploadedFile && (
            <div className="text-center space-y-2">
              <Badge variant="secondary">
                {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)}MB)
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Different Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Different Sizes</CardTitle>
          <CardDescription>
            Avatar upload in various sizes: small, medium, large, and extra large
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
            <div className="text-center space-y-2">
              <AvatarUpload
                size="sm"
                value={avatar2 ?? ''}
                onChange={(file, url) => setAvatar2(url)}
                uploadText="Small"
                showRemove={false}
              />
              <p className="text-sm text-muted-foreground">Small (64px)</p>
            </div>
            
            <div className="text-center space-y-2">
              <AvatarUpload
                size="md"
                value={avatar2??''}
                onChange={(file, url) => setAvatar2(url)}
                uploadText="Medium"
                showRemove={false}
              />
              <p className="text-sm text-muted-foreground">Medium (80px)</p>
            </div>
            
            <div className="text-center space-y-2">
              <AvatarUpload
                size="lg"
                value={avatar2??''}
                onChange={(file, url) => setAvatar2(url)}
                uploadText="Large"
                showRemove={false}
              />
              <p className="text-sm text-muted-foreground">Large (96px)</p>
            </div>
            
            <div className="text-center space-y-2">
              <AvatarUpload
                size="xl"
                value={avatar2??''}
                onChange={(file, url) => setAvatar2(url)}
                uploadText="X-Large"
                showRemove={false}
              />
              <p className="text-sm text-muted-foreground">X-Large (128px)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
          <CardDescription>
            Custom file size limits, file types, and disabled state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Custom Settings</h4>
              <AvatarUpload
                value={avatar3 ?? ''}
                onChange={(file, url) => setAvatar3(url)}
                maxSize={2}
                accept="image/jpeg,image/png"
                uploadText="JPG/PNG Only"
                removeText="Clear"
                size="lg"
              />
              <p className="text-sm text-muted-foreground">
                Max 2MB, JPG/PNG only
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Disabled State</h4>
              <AvatarUpload
                value={avatar4 ?? ''}
                onChange={(file, url) => setAvatar4(url)}
                disabled={true}
                size="lg"
              />
              <p className="text-sm text-muted-foreground">
                Upload disabled
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={setDefaultAvatar} variant="outline">
              Set Default Avatar
            </Button>
            <Button onClick={resetAll} variant="outline">
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import { AvatarUpload } from "@/components/ui/avatar-upload"

function MyComponent() {
  const [avatar, setAvatar] = useState<string | null>(null)
  
  const handleAvatarChange = (file: File | null, url: string | null) => {
    setAvatar(url)
    if (file) {
      // Upload file to your server
      uploadToServer(file)
    }
  }
  
  return (
    <AvatarUpload
      value={avatar}
      onChange={handleAvatarChange}
      maxSize={5}
      size="lg"
    />
  )
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

export default AvatarUploadDemo
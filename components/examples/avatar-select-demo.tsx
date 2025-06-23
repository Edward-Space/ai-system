"use client"

import * as React from "react"
import { AvatarSelect, type AvatarOption } from "@/components/ui/avatar-select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Danh sách avatar mẫu
const avatarOptions: AvatarOption[] = [
  {
    id: "avatar-1",
    src: "https://github.com/shadcn.png",
    alt: "Shadcn",
    fallback: "SH"
  },
  {
    id: "avatar-2",
    src: "https://github.com/vercel.png",
    alt: "Vercel",
    fallback: "VE"
  },
  {
    id: "avatar-3",
    src: "https://github.com/nextjs.png",
    alt: "Next.js",
    fallback: "NX"
  },
  {
    id: "avatar-4",
    src: "https://github.com/react.png",
    alt: "React",
    fallback: "RE"
  },
  {
    id: "avatar-5",
    src: "https://github.com/tailwindcss.png",
    alt: "Tailwind CSS",
    fallback: "TW"
  },
  {
    id: "avatar-6",
    src: "https://github.com/typescript.png",
    alt: "TypeScript",
    fallback: "TS"
  }
]

// Avatar người dùng mẫu
const userAvatars: AvatarOption[] = [
  {
    id: "user-1",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    fallback: "JD"
  },
  {
    id: "user-2",
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    alt: "Jane Smith",
    fallback: "JS"
  },
  {
    id: "user-3",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    alt: "Mike Johnson",
    fallback: "MJ"
  },
  {
    id: "user-4",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    alt: "Sarah Wilson",
    fallback: "SW"
  }
]

export function AvatarSelectDemo() {
  const [selectedBrand, setSelectedBrand] = React.useState<string>("")
  const [selectedUser, setSelectedUser] = React.useState<string>("")
  const [selectedProfile, setSelectedProfile] = React.useState<string>("user-1")

  const handleRandomSelect = () => {
    const randomBrand = avatarOptions[Math.floor(Math.random() * avatarOptions.length)]
    const randomUser = userAvatars[Math.floor(Math.random() * userAvatars.length)]
    setSelectedBrand(randomBrand.id)
    setSelectedUser(randomUser.id)
  }

  const handleReset = () => {
    setSelectedBrand("")
    setSelectedUser("")
    setSelectedProfile("user-1")
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Avatar Select Demo</h1>
        <p className="text-muted-foreground">
          Component chọn avatar với animation và UI đẹp mắt
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Brand Avatars
              <Badge variant="secondary">Basic</Badge>
            </CardTitle>
            <CardDescription>
              Chọn avatar thương hiệu với size medium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarSelect
              options={avatarOptions}
              value={selectedBrand}
              onValueChange={setSelectedBrand}
              placeholder="Chọn thương hiệu..."
              size="md"
            />
            {selectedBrand && (
              <div className="text-sm text-muted-foreground">
                Đã chọn: <Badge variant="outline">{selectedBrand}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Avatars */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👥 User Avatars
              <Badge variant="secondary">Large</Badge>
            </CardTitle>
            <CardDescription>
              Chọn avatar người dùng với size lớn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarSelect
              options={userAvatars}
              value={selectedUser}
              onValueChange={setSelectedUser}
              placeholder="Chọn người dùng..."
              size="lg"
            />
            {selectedUser && (
              <div className="text-sm text-muted-foreground">
                Đã chọn: <Badge variant="outline">{selectedUser}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Avatar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚙️ Profile Avatar
              <Badge variant="secondary">Small</Badge>
            </CardTitle>
            <CardDescription>
              Avatar profile với size nhỏ và giá trị mặc định
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarSelect
              options={userAvatars}
              value={selectedProfile}
              onValueChange={setSelectedProfile}
              placeholder="Chọn avatar profile..."
              size="sm"
            />
            <div className="text-sm text-muted-foreground">
              Profile: <Badge variant="outline">{selectedProfile}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Disabled State */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚫 Disabled State
              <Badge variant="destructive">Disabled</Badge>
            </CardTitle>
            <CardDescription>
              Component trong trạng thái disabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarSelect
              options={avatarOptions}
              value="avatar-1"
              placeholder="Không thể chọn..."
              disabled
              size="md"
            />
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>🎮 Controls</CardTitle>
          <CardDescription>
            Điều khiển demo và xem kết quả
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleRandomSelect} variant="default">
              🎲 Chọn ngẫu nhiên
            </Button>
            <Button onClick={handleReset} variant="outline">
              🔄 Reset tất cả
            </Button>
          </div>

          {/* Results */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">📊 Kết quả hiện tại:</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand Avatar:</span>
                <Badge variant={selectedBrand ? "default" : "secondary"}>
                  {selectedBrand || "Chưa chọn"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Avatar:</span>
                <Badge variant={selectedUser ? "default" : "secondary"}>
                  {selectedUser || "Chưa chọn"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profile Avatar:</span>
                <Badge variant="default">
                  {selectedProfile}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>✨ Tính năng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">🎨</Badge>
              <span className="text-sm">3 kích thước: sm, md, lg</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">⚡</Badge>
              <span className="text-sm">Animation mượt mà</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">🎯</Badge>
              <span className="text-sm">Click outside để đóng</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">♿</Badge>
              <span className="text-sm">Hỗ trợ accessibility</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">🔧</Badge>
              <span className="text-sm">Tùy chỉnh dễ dàng</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">🚫</Badge>
              <span className="text-sm">Hỗ trợ disabled state</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
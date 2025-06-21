"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"

export interface AvatarOption {
  id: string
  src: string
  alt: string
  fallback?: string
}

interface AvatarSelectProps {
  options: AvatarOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16"
}

const AvatarSelectComponent = React.forwardRef<
  HTMLButtonElement,
  AvatarSelectProps
>((
  {
    options,
    value,
    onValueChange,
    placeholder = "Chọn avatar...",
    className,
    disabled = false,
    size = "md",
    ...props
  },
  ref
) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState<AvatarOption | null>(
    value ? options.find(option => option.id === value) || null : null
  )

  // Đồng bộ selectedOption với value từ props
  React.useEffect(() => {
    const option = value ? options.find(option => option.id === value) || null : null
    setSelectedOption(option)
  }, [value, options])

  // Handle click outside để đóng dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('[data-avatar-select]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = React.useCallback((option: AvatarOption) => {
    setSelectedOption(option)
    onValueChange?.(option.id)
    setIsOpen(false)
  }, [onValueChange])

  const handleToggle = React.useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev)
    }
  }, [disabled])

  return (
    <div className="relative" data-avatar-select>
      <Button
        ref={ref}
        variant="outline"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex items-center justify-between gap-2 h-auto p-3",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {selectedOption ? (
            <>
              <Avatar className={cn(sizeClasses[size])}>
                <AvatarImage 
                  src={selectedOption.src} 
                  alt={selectedOption.alt}
                />
                <AvatarFallback>
                  {selectedOption.fallback || selectedOption.alt.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {selectedOption.alt}
              </span>
            </>
          ) : (
            <>
              <div className={cn(
                "flex items-center justify-center rounded-full bg-muted",
                sizeClasses[size]
              )}>
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
            </>
          )}
        </div>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-2 bg-popover text-popover-foreground rounded-md border shadow-lg",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          <div className="max-h-60 overflow-auto p-2">
            <div className="grid grid-cols-1 gap-1">
              {options.map((option, index) => {
                const isSelected = selectedOption?.id === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex items-center gap-3 w-full p-3 rounded-md text-left transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      isSelected && "bg-accent text-accent-foreground",
                      "animate-in slide-in-from-top-1 duration-200"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <Avatar className={cn(sizeClasses[size])}>
                      <AvatarImage 
                        src={option.src} 
                        alt={option.alt}
                      />
                      <AvatarFallback>
                        {option.fallback || option.alt.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {option.alt}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

AvatarSelectComponent.displayName = "AvatarSelect"

// Wrap với React.memo để tránh re-render không cần thiết
export const AvatarSelect = React.memo(AvatarSelectComponent)
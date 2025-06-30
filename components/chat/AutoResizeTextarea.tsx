"use client";
import React, { useEffect, useRef, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
/* ------------------------------------------------------------------------------------ */
interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
/* ------------------------------------------------------------------------------------ */
const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>((props, ref) => {
  /* ------------------------------------------------------------------------------------ */
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = (ref || innerRef) as React.RefObject<HTMLTextAreaElement>;
  /* ------------------------------------------------------------------------------------ */
  // Debounce the height adjustment to improve performance
  const autoHeigh = React.useCallback(() => {
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"; // Reset lại chiều cao ban đầu
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Áp dụng chiều cao mới theo scrollHeight
        }
      });
    }
  }, [textareaRef]);
  /* ------------------------------------------------------------------------------------ */
  // Cập nhật chiều cao khi props.value thay đổi (cho chế độ controlled)
  useEffect(() => {
    autoHeigh();
  }, [props.value, autoHeigh]);
  /* ------------------------------------------------------------------------------------ */
  // Xử lý sự kiện keydown để giữ lại format
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cho phép Tab để thêm khoảng trắng thay vì chuyển focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      // Thêm 2 spaces thay cho tab
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      textarea.value = newValue;
      
      // Đặt lại vị trí cursor
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      
      // Trigger onChange event để cập nhật state
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
      
      // Cập nhật chiều cao
      autoHeigh();
    }
    
    // Gọi onKeyDown từ props nếu có
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  return (
    <Textarea
      {...props}
      ref={textareaRef}
      onKeyDown={handleKeyDown}
      style={{
        whiteSpace: 'pre-wrap', // Giữ lại xuống hàng và khoảng trắng
        ...props.style
      }}
      className={`hide-scrollbar max-h-[100px] rounded-none border-none shadow-none px-3 focus-visible:ring-transparent flex-1 min-h-[54px] py-4 focus-visible:ring-0 focus-visible:ring-offset-0 ${
        props.className || ""
      }`}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export default AutoResizeTextarea;

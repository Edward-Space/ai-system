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
  return (
    <Textarea
      {...props}
      ref={textareaRef}
      className={`hide-scrollbar max-h-[100px] rounded-none border border-transparent px-0 focus-visible:ring-transparent ${
        props.className || ""
      }`}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export default AutoResizeTextarea;

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
// Import types from @types/dom-speech-recognition
/// <reference types="dom-speech-recognition" />

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function SpeechToText({
  onTranscript,
  disabled = false,
  className,
}: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Kiểm tra xem trình duyệt có hỗ trợ Speech Recognition không
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setIsSupported(true);
      
      // Tạo instance của SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Cấu hình Speech Recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "vi-VN"; // Tiếng Việt
      
      // Xử lý kết quả nhận dạng
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };
      
      // Xử lý lỗi
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      
      // Xử lý khi kết thúc
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Không hiển thị nút nếu trình duyệt không hỗ trợ
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={cn(
        "transition-all duration-200 [&_svg:not([class*='size-'])]:size-5",
        isListening
          ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 animate-pulse"
          : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800",
        className
      )}
      title={isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
    >
      {isListening ? (
        <Square className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
}
interface FormData {
    prompt: string;
  }
  
  interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }
  
  interface StreamingState {
    isStreaming: boolean;
    isError: boolean;
    errorMessage: string;
  }

  

  export type {FormData,Message,StreamingState}
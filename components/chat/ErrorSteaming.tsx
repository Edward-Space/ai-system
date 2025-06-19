import { StreamingState } from "@/model/chat"


export const ErrorStreaming = ({streamingState}:{streamingState:StreamingState}) =>{


    return (
        <div className="mb-8 max-w-5xl mx-auto p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
        <div className="font-medium mb-1 flex items-center">
          <span>Lỗi:</span>
        </div>
        <p>
          {streamingState.errorMessage ||
            "Đã xảy ra lỗi khi kết nối với API"}
        </p>
      </div>
    )
}
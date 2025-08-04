import { IBot } from "../bot";

interface FormData {
  prompt: string;
}

interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  files?: {
    name: string;
    url: string;
    type: 'image' | 'file';
    size?: number;
  }[];
}

interface StreamingState {
  isStreaming: boolean;
  isError: boolean;
  errorMessage: string;
}

interface IPayloadSendChat {
  prompt: string;
  system_prompt?: string;
  type?: "dashboard" | "testing" | undefined;
  bot: IBot | undefined;
  bot_id: string | undefined;
  generative_model: string;
  session_id: string | undefined;
}


interface IHistoryChatItem {
  key: string;
  title: string;
  bot_id?: string;
  history?: IHistoryChatItem[];
}

export type { FormData, IMessage, StreamingState, IHistoryChatItem };

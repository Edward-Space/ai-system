import { IKnowledge } from "../knowledge";

interface ILlmParameters {
  max_token: number;
  temperature: number;
  top_k: number;
  top_p: number;
}

interface IKnowledgeParameters {
  search_type: string;
  source_chunks: number;
}

interface ICategory {
  id: string;
  name: string;
  description: string;
  create_at: string;
  update_at: string;
}

interface IBot {
  id: string;
  name: string;
  active_models: {
    model_id: string;
    model_name: string;
  }[];
  embedding_model: string;
  categories: ICategory[];
  knowledges: IKnowledge[];
  description: string;
  system_prompt: string;
  llm_parameters: ILlmParameters;
  knowledge_parameters: IKnowledgeParameters;
  avatar: string;
  create_at: string;
  update_at: string;
}
interface CreateBotProps {
  open: boolean;
  onCancel: () => void;
//   onOk: (values: BotFormValues) => void;
//   data?: BotFormValues;
}

interface ICategory {
  id: string;
  name: string;
  description: string;
  create_at: string;
  update_at: string;
}

export type { IBot, ICategory ,CreateBotProps};

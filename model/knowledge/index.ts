interface IKnowledge {
  id: string;
  name: string;
  description: string;
  type: string;
  team_id: string;
  team: IKnowledgeTeam[];
  data_sources: any[];
  create_at: string;
  update_at: string;
}

interface IKnowledgeTeam {
  id: string;
  active: boolean;
  api_key: string;
  company_id: string;
  name: string;
  description: string;
  create_at: string;
  update_at: string;
}

interface IUploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "error";
  progress: number;
  file_id?: string;
  file_url?: string;
  localFile?: File;
}

interface ISegmentPreview {
  id: string;
  content: string;
  metadata?: any;
}
interface IDataSources {
  id: string;
  create_at: string;
  update_at: string;
  knowledge_id: string;
  type: string;
  chunks: any[];
  status: string;
  chunking_strategy: string;
  local: {
    file_name: string;
    file_size: number;
    mime_type: string;
    path: string;
    upload_date: string;
  };
}

interface IDetailKnowledge {
  id: string;
  create_at: string;
  update_at: string;
  name: string;
  description: string;
  type: string;
  team_id: string;
  data_sources: IDataSources[];
}
export type {
  IKnowledge,
  IKnowledgeTeam,
  IUploadFile,
  ISegmentPreview,
  IDetailKnowledge,
  IDataSources,
};

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
  export type { IKnowledge, IKnowledgeTeam };
  
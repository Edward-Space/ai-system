interface IModel {
    model_id: string;
    model_name: string;
    provider?: string;
    categories?: string[];
    model_param?: string;
    reasoning?: boolean;
    type_support?: string[];
  }
  interface IOption {
    label: string;
    value: string;
    description?: string;
    className?: string;
    options?: IOption[];
    position?: 'right' | 'left';
  }
  export type { IModel,IOption };
  
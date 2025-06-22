import { IModel } from "@/model/model";
import { create } from "zustand";

interface ISelectModel {
  selectedModel: IModel | null;
  setSelectedModel: (model: IModel) => void;
}
export const useSelectModel = create<ISelectModel>((set) => ({
  selectedModel: null,
  setSelectedModel: (model: IModel) => set({ selectedModel: model }),
}));

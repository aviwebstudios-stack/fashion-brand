import { create } from "zustand";

interface ContentState {
  content: Record<string, string>;
  setContent: (content: Record<string, string>) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  content: {},
  setContent: (content) => set({ content }),
}));

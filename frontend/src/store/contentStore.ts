import { create } from "zustand";

interface ContentState {
  content: Record<string, string>;
  /** True once the content request has finished, whether it succeeded or failed. */
  ready: boolean;
  setContent: (content: Record<string, string>) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  content: {},
  ready: false,
  setContent: (content) => set({ content, ready: true }),
}));

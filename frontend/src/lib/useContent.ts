import { useContentStore } from "../store/contentStore";

export function useContent(key: string, fallback: string): string {
  const value = useContentStore((s) => s.content?.[key]);
  return value ?? fallback;
}

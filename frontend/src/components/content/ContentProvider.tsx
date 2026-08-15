import { useEffect, type ReactNode } from "react";
import api from "../../lib/api";
import { useContentStore } from "../../store/contentStore";

export default function ContentProvider({ children }: { children: ReactNode }) {
  const setContent = useContentStore((s) => s.setContent);

  useEffect(() => {
    api
      .get("/settings/content")
      .then((res) => setContent(res.data.data))
      .catch(() => setContent({}));
  }, []);

  return <>{children}</>;
}
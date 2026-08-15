import { useEffect, type ReactNode } from "react";
import api from "../../lib/api";
import { applyTheme } from "../../lib/applyTheme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    api
      .get("/settings/theme")
      .then((res) => applyTheme(res.data.data))
      .catch(() => {
        // fall back silently to the CSS defaults already baked into index.css
      });
  }, []);

  return <>{children}</>;
}
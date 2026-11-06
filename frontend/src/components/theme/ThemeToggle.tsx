import { Moon, Sun } from "lucide-react";
import { toggleThemeMode, useThemeMode } from "../../lib/themeMode";

interface ThemeToggleProps {
  className?: string;
  size?: number;
  /** Show a text label next to the icon (used in the mobile menu). */
  withLabel?: boolean;
}

export default function ThemeToggle({ className = "", size = 18, withLabel = false }: ThemeToggleProps) {
  const mode = useThemeMode();
  const next = mode === "dark" ? "light" : "dark";
  const label = `Switch to ${next} mode`;

  return (
    <button
      type="button"
      onClick={toggleThemeMode}
      aria-label={withLabel ? undefined : label}
      title={label}
      className={className}
    >
      {mode === "dark" ? <Sun size={size} aria-hidden="true" /> : <Moon size={size} aria-hidden="true" />}
      {withLabel && <span>{next === "dark" ? "Dark mode" : "Light mode"}</span>}
    </button>
  );
}

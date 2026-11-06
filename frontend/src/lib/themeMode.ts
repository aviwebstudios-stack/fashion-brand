import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";

/** Must match the key read by the inline script in index.html. */
export const THEME_STORAGE_KEY = "fb_theme";

const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function readSaved(): ThemeMode | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function current(): ThemeMode {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

const listeners = new Set<() => void>();

function syncThemeColor(mode: ThemeMode) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode === "dark" ? "#1a1814" : "#3d4636");
}

function apply(mode: ThemeMode, animate: boolean) {
  const root = document.documentElement;
  if (root.dataset.theme === mode) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && !reduceMotion) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 250);
  }
  root.dataset.theme = mode;
  syncThemeColor(mode);
  listeners.forEach((l) => l());
}

export function setThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  apply(mode, true);
}

export function toggleThemeMode() {
  setThemeMode(current() === "dark" ? "light" : "dark");
}

// Follow the system setting until the visitor picks a mode themselves.
if (typeof window !== "undefined") {
  syncThemeColor(current());
  media().addEventListener("change", (e) => {
    if (!readSaved()) apply(e.matches ? "dark" : "light", true);
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, current, () => "light");
}

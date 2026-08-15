import { HEADING_FONTS, BODY_FONTS } from "./themeFonts";

function loadGoogleFont(googleFamily: string) {
  const linkId = `google-font-${googleFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(linkId)) return;
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${googleFamily.replace(
    /\s+/g,
    "+"
  )}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export interface ThemeData {
  colors?: { primary?: string; accent?: string; background?: string; text?: string };
  fonts?: { heading?: string; body?: string };
}

export function applyTheme(theme: ThemeData) {
  const root = document.documentElement;

  if (theme.colors) {
    if (theme.colors.primary) root.style.setProperty("--color-brand-primary", theme.colors.primary);
    if (theme.colors.accent) root.style.setProperty("--color-brand-accent", theme.colors.accent);
    if (theme.colors.background) root.style.setProperty("--color-brand-bg", theme.colors.background);
    if (theme.colors.text) root.style.setProperty("--color-brand-text", theme.colors.text);
  }

  if (theme.fonts) {
    const headingFont = HEADING_FONTS.find((f) => f.name === theme.fonts?.heading);
    const bodyFont = BODY_FONTS.find((f) => f.name === theme.fonts?.body);

    if (headingFont) {
      loadGoogleFont(headingFont.googleFamily);
      root.style.setProperty("--font-heading", `"${headingFont.name}", serif`);
    }
    if (bodyFont) {
      loadGoogleFont(bodyFont.googleFamily);
      root.style.setProperty("--font-body", `"${bodyFont.name}", sans-serif`);
    }
  }
}
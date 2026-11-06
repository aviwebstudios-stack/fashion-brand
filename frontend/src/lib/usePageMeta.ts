import { useEffect } from "react";

export const SITE_URL = "https://fashion-brand-liard.vercel.app";
export const SITE_NAME = "Favy Atelier";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Favy Atelier makes bridal gowns, bespoke pieces and ready-to-wear in Nigeria. Shop online or book a consultation.";

interface PageMeta {
  /** Full title, or a short page name that gets " | Favy Atelier" added. */
  title: string;
  description?: string;
  /** Absolute URL of the share image. Defaults to /og-image.jpg. */
  image?: string;
  /** Keep private pages (account, checkout, admin) out of search results. */
  noindex?: boolean;
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function usePageMeta({ title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, noindex = false }: PageMeta) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${window.location.pathname}`;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    setCanonical(url);
  }, [title, description, image, noindex]);
}

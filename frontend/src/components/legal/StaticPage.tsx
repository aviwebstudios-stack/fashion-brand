import type { ReactNode } from "react";
import { usePageMeta } from "../../lib/usePageMeta";

export const legalStyles = {
  heading: "mt-8 font-heading text-xl text-brand-text",
  paragraph: "mt-4 text-sm leading-relaxed text-brand-text/75",
};

interface StaticPageProps {
  title: string;
  /** Meta description for search results and link previews. */
  description: string;
  children: ReactNode;
}

export default function StaticPage({ title, description, children }: StaticPageProps) {
  usePageMeta({ title, description });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-heading text-3xl text-brand-text">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

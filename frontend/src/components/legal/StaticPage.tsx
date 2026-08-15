import type { ReactNode } from "react";

export const legalStyles = {
  heading: "mt-8 font-heading text-xl text-brand-text",
  paragraph: "mt-4 text-sm leading-relaxed text-brand-text/75",
};

export default function StaticPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-heading text-3xl text-brand-text">{title}</h1>
      <div className="mt-10">{children}</div>
    </div>
  );
}
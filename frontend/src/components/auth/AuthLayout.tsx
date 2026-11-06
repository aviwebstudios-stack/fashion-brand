import type { ReactNode } from "react";
import { usePageMeta } from "../../lib/usePageMeta";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  usePageMeta({ title, noindex: true });
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-brand-bg px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-brand-text">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-brand-text/70">{subtitle}</p>}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
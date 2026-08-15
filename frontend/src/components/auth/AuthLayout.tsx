import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#faf8f3] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#2b2b26]">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-[#2b2b26]/70">{subtitle}</p>}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
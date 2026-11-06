import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 6;

/**
 * The wrapper itself never moves. When it scrolls into view, every
 * `.reveal-item` inside it fades up once, staggered in document order.
 * Motion is defined in index.css and is skipped for prefers-reduced-motion.
 */
export default function Reveal({ children, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.querySelectorAll<HTMLElement>(".reveal-item").forEach((item, i) => {
          item.style.setProperty("--reveal-delay", `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
        });
        el.dataset.revealed = "true";
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}

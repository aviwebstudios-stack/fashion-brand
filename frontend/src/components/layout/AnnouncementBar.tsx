import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-brand-primary text-[#f4f1e8]">
      <div className="mx-auto flex max-w-7xl items-center justify-center overflow-x-auto px-8 py-2 sm:px-10 sm:py-2.5">
        <div className="flex items-center gap-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.05em] sm:gap-2 sm:text-xs sm:tracking-[0.12em]">
          <span>Complimentary shipping on orders above ₦150,000</span>
          <span className="text-brand-accent">|</span>
          <span>New collection in store now</span>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#f4f1e8]/70 transition hover:bg-white/10 hover:text-[#f4f1e8] sm:right-3"
      >
        <X size={12} className="sm:hidden" />
        <X size={14} className="hidden sm:block" />
      </button>
    </div>
  );
}

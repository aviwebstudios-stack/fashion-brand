import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { usePanelStore } from "../../store/panelStore";
import AnnouncementBar from "./AnnouncementBar";

const NAV_LINKS = [
  { label: "Shop RTW", to: "/shop/rtw" },
  { label: "Bridals", to: "/shop/bridals" },
  { label: "Bespoke", to: "/shop/bespoke" },
  { label: "Fashion Academy", to: "/academy" },
  { label: "Book a Consultation", to: "/consultations" },
  { label: "Shop Sales", to: "/shop/sales" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const cartCount = usePanelStore((s) => s.cartCount);
  const toggleCart = usePanelStore((s) => s.toggleCart);
  const toggleDashboard = usePanelStore((s) => s.toggleDashboard);
  const toggleSearch = usePanelStore((s) => s.toggleSearch);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty("--navbar-height", `${el.offsetHeight}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobileMenuOpen]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <AnnouncementBar />

      <div className="border-b border-[#e5e1d8] bg-brand-bg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="p-1 text-brand-text md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="mx-auto md:mx-0 text-center leading-none md:flex-1 md:text-center">
            <span className="block font-heading text-lg tracking-[0.15em] text-brand-text">
              FAVY
            </span>
            <span className="block font-heading text-[11px] tracking-[0.3em] text-brand-accent">
              ATELIER
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button onClick={toggleSearch} aria-label="Search" className="text-brand-text transition hover:text-brand-accent">
              <Search size={18} />
            </button>

            <button
              onClick={toggleCart}
              aria-label="Open cart"
              className="relative text-brand-text transition hover:text-brand-accent"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={toggleDashboard}
                aria-label="Account"
                className="text-brand-text transition hover:text-brand-accent"
              >
                <User size={18} />
              </button>
            ) : (
              <Link to="/login" aria-label="Account" className="text-brand-text transition hover:text-brand-accent">
                <User size={18} />
              </Link>
            )}
          </div>
        </div>

        <nav className="hidden justify-center border-t border-[#e5e1d8] md:flex">
          <ul className="flex items-center gap-12 py-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `group relative inline-block text-sm uppercase tracking-[0.08em] transition-colors ${
                      isActive ? "text-brand-text" : "text-brand-text/80 hover:text-brand-text"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-[1.5px] w-full origin-left bg-brand-accent transition-transform duration-300 ease-out ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {isMobileMenuOpen && (
          <nav className="border-t border-[#e5e1d8] md:hidden">
            <ul className="flex flex-col gap-4 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-sm uppercase tracking-[0.08em] ${
                        isActive ? "text-brand-text underline underline-offset-4" : "text-brand-text/80"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
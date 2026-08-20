import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  CalendarCheck,
  Users,
  Palette,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAdminAuthStore } from "../../store/adminAuthStore";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: ShoppingBag },
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
  { label: "Bookings", to: "/admin/bookings", icon: CalendarCheck },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Inquiries", to: "/admin/inquiries", icon: MessageSquare },
  { label: "Theme", to: "/admin/theme", icon: Palette },
  { label: "Content", to: "/admin/content", icon: FileText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const adminLogout = useAdminAuthStore((s) => s.adminLogout);
  const adminUser = useAdminAuthStore((s) => s.adminUser);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#faf8f3]">
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-[#2b2b26]/10 bg-brand-primary px-4 py-3 max-[865px]:flex min-[866px]:hidden">
        <button onClick={() => setIsMobileSidebarOpen(true)} aria-label="Open menu" className="text-[#f4f1e8]">
          <Menu size={22} />
        </button>
        <span className="font-serif text-sm tracking-[0.1em] text-[#f4f1e8]">
          FAVY <span className="text-[#c9a227]">ADMIN</span>
        </span>
        <div className="w-[22px]" />
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 min-[866px]:hidden" onClick={closeMobileSidebar} />
      )}

      <aside
        className={`z-50 flex w-64 shrink-0 flex-col bg-brand-primary transition-transform duration-300 max-[865px]:fixed max-[865px]:inset-y-0 max-[865px]:left-0 min-[866px]:static min-[866px]:w-60 min-[866px]:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "max-[865px]:-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <span className="font-serif text-lg tracking-[0.1em] text-[#f4f1e8]">FAVY</span>
            <span className="ml-1 text-xs tracking-[0.2em] text-[#c9a227]">ADMIN</span>
          </div>
          <button onClick={closeMobileSidebar} aria-label="Close menu" className="text-[#f4f1e8] min-[866px]:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-[#f4f1e8]/10 text-[#f4f1e8]" : "text-[#f4f1e8]/70 hover:bg-[#f4f1e8]/5 hover:text-[#f4f1e8]"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#f4f1e8]/10 px-3 py-4">
          {adminUser && <p className="mb-2 truncate px-3 text-xs text-[#f4f1e8]/50">{adminUser.email}</p>}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-[#f4f1e8]/70 transition hover:bg-[#f4f1e8]/5 hover:text-[#f4f1e8]"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden max-[865px]:pt-14">
        <Outlet />
      </main>
    </div>
  );
}

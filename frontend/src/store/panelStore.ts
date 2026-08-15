import { create } from "zustand";

interface PanelState {
  cartCount: number;
  isCartOpen: boolean;
  isMenuOpen: boolean;
  isDashboardOpen: boolean;
  isSearchOpen: boolean;
  setCartCount: (count: number) => void;
  toggleCart: () => void;
  toggleMenu: () => void;
  toggleDashboard: () => void;
  closeDashboard: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  closeAll: () => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  cartCount: 0,
  isCartOpen: false,
  isMenuOpen: false,
  isDashboardOpen: false,
  isSearchOpen: false,

  setCartCount: (count) => set({ cartCount: count }),
  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
      isMenuOpen: false,
      isDashboardOpen: false,
      isSearchOpen: false,
    })),
  toggleMenu: () =>
    set((state) => ({
      isMenuOpen: !state.isMenuOpen,
      isCartOpen: false,
      isDashboardOpen: false,
      isSearchOpen: false,
    })),
  toggleDashboard: () =>
    set((state) => ({
      isDashboardOpen: !state.isDashboardOpen,
      isCartOpen: false,
      isMenuOpen: false,
      isSearchOpen: false,
    })),
  closeDashboard: () => set({ isDashboardOpen: false }),
  toggleSearch: () =>
    set((state) => ({
      isSearchOpen: !state.isSearchOpen,
      isCartOpen: false,
      isMenuOpen: false,
      isDashboardOpen: false,
    })),
  closeSearch: () => set({ isSearchOpen: false }),
  closeAll: () =>
    set({ isCartOpen: false, isMenuOpen: false, isDashboardOpen: false, isSearchOpen: false }),
}));
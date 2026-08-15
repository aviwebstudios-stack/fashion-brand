import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";
import { usePanelStore } from "../../store/panelStore";

interface CartItem {
  id: string;
  quantity: number;
  size: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
    isAvailable: boolean;
  };
}

interface Cart {
  items: CartItem[];
  total: number;
}

export default function CartPanel() {
  const isOpen = usePanelStore((s) => s.isCartOpen);
  const toggleCart = usePanelStore((s) => s.toggleCart);
  const setCartCount = usePanelStore((s) => s.setCartCount);

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = () => {
    api
      .get("/cart")
      .then((res) => {
        const data = res.data.data;
        setCart(data);
        setCartCount(data.items?.length || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchCart();
    }
  }, [isOpen]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(itemId);
    try {
      const res = await api.patch(`/cart/${itemId}`, { quantity: newQuantity });
      setCart(res.data.data);
      setCartCount(res.data.data.items?.length || 0);
    } catch {
      // silently fail
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdatingId(itemId);
    try {
      const res = await api.delete(`/cart/${itemId}`);
      setCart(res.data.data);
      setCartCount(res.data.data.items?.length || 0);
    } catch {
      // silently fail
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[90] transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={toggleCart} />

      <div
        className={`absolute right-0 top-0 flex h-full w-full flex-col bg-brand-bg shadow-xl transition-transform duration-300 sm:w-[40%] sm:min-w-[420px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-text/10 px-6 py-5">
          <h2 className="font-heading text-xl tracking-[0.05em] text-brand-text">Your Bag</h2>
          <button
            onClick={toggleCart}
            aria-label="Close"
            className="rounded-full p-1.5 text-brand-text/60 transition hover:bg-black/5 hover:text-brand-text"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <p className="text-sm text-brand-text/60">Loading...</p>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-brand-text/70">Your bag is empty.</p>
              <button onClick={toggleCart} className="mt-4 text-sm text-brand-accent hover:underline">
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#e5e1d8]">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-text">{item.product.name}</p>
                    {item.size && (
                      <p className="mt-0.5 text-xs text-brand-text/60">Size: {item.size}</p>
                    )}
                    <p className="mt-1 text-sm text-brand-text/80">
                      {formatNaira(item.product.price)}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-brand-text/20">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updatingId === item.id || item.quantity <= 1}
                          className="px-2 py-1 text-sm text-brand-text disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm text-brand-text">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingId === item.id || item.quantity >= item.product.stock}
                          className="px-2 py-1 text-sm text-brand-text disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={updatingId === item.id}
                        className="text-xs text-brand-text/50 underline hover:text-brand-text"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-brand-text/10 px-6 py-5">
            <div className="flex items-center justify-between text-sm text-brand-text">
              <span>Subtotal</span>
              <span className="font-medium">{formatNaira(cart.total)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={toggleCart}
              className="mt-4 block w-full bg-brand-primary py-3 text-center text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
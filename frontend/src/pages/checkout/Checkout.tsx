import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";

interface CartItem {
  id: string;
  quantity: number;
  size: string | null;
  product: {
    name: string;
    price: number;
    images: string[];
  };
}

interface Cart {
  items: CartItem[];
  total: number;
}

export default function Checkout() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/cart")
      .then((res) => setCart(res.data.data))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setPlacing(true);
    try {
      const orderRes = await api.post("/orders", { deliveryAddress });
      const orderId = orderRes.data.data.id;

      const paymentRes = await api.post(`/payments/order/${orderId}`);
      const { authorizationUrl } = paymentRes.data.data;

      window.location.href = authorizationUrl;
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  if (loading) {
    return <p className="px-6 py-20 text-center text-sm text-brand-text/60">Loading...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-sm text-brand-text/70">Your bag is empty.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-brand-accent hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-center font-heading text-3xl text-brand-text">Checkout</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.15em] text-brand-accent">Order Summary</h2>
          <ul className="mt-4 space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#e5e1d8]">
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-text">{item.product.name}</p>
                  <p className="text-xs text-brand-text/60">
                    Qty {item.quantity}
                    {item.size && ` · Size ${item.size}`}
                  </p>
                </div>
                <p className="text-sm text-brand-text/80">
                  {formatNaira(item.product.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-brand-text/15 pt-4 text-sm font-medium text-brand-text">
            <span>Total</span>
            <span>{formatNaira(cart.total)}</span>
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.15em] text-brand-accent">Delivery Address</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <p className="border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <textarea
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              rows={4}
              placeholder="Street address, city, state"
              className="w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
            />

            <button
              type="submit"
              disabled={placing}
              className="w-full bg-brand-primary py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
            >
              {placing ? "Redirecting to payment..." : "Proceed to Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
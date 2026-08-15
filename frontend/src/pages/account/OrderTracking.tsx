import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";

interface StatusHistoryEntry {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  size: string | null;
  price: number;
  product: { id: string; name: string; images: string[] };
}

interface Order {
  id: string;
  total: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
}

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/my-orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="px-6 py-20 text-center text-sm text-brand-text/60">Loading...</p>;
  }

  if (!order) {
    return <p className="px-6 py-20 text-center text-sm text-brand-text/60">Order not found.</p>;
  }

  const timeline = [...order.statusHistory].reverse();

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <Link to="/account/orders" className="text-sm text-brand-accent hover:underline">
        ← Back to my orders
      </Link>

      <h1 className="mt-4 font-heading text-2xl text-brand-text">
        Order #{order.id.slice(0, 8).toUpperCase()}
      </h1>
      <p className="mt-1 text-sm text-brand-text/60">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 border border-brand-text/10 p-5">
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#e5e1d8]">
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
              <p className="text-sm text-brand-text/70">{formatNaira(item.price)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-brand-text/10 pt-3 text-sm font-medium text-brand-text">
          <span>Total</span>
          <span>{formatNaira(order.total)}</span>
        </div>
        <p className="mt-3 text-xs text-brand-text/60">
          Delivering to: {order.deliveryAddress}
        </p>
      </div>

      <h2 className="mt-10 text-xs uppercase tracking-[0.1em] text-brand-accent">
        Tracking Status
      </h2>
      <div className="mt-4 space-y-0">
        {timeline.map((entry, i) => (
          <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
            {i !== timeline.length - 1 && (
              <div className="absolute left-[5px] top-3 h-full w-px bg-brand-text/15" />
            )}
            <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full bg-brand-primary" />
            <div>
              <p className="text-sm font-medium text-brand-text">
                {entry.note || entry.status}
              </p>
              <p className="mt-1 text-xs text-brand-text/50">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
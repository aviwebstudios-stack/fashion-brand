import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";

interface Order {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { id: string; product: { name: string; images: string[] } }[];
}

function statusColor(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-brand-accent/15 text-[#8a6d1a]";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "SHIPPED":
    case "PROCESSING":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-center font-heading text-3xl text-brand-text">My Orders</h1>

      {loading ? (
        <p className="mt-10 text-center text-sm text-brand-text/60">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-sm text-brand-text/70">You haven't placed any orders yet.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-brand-accent hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/account/orders/${order.id}`}
                className="flex items-center justify-between border border-brand-text/10 p-5 transition hover:border-brand-text/30"
              >
                <div>
                  <p className="text-sm font-medium text-brand-text">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-brand-text/60">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-brand-text/80">{formatNaira(order.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
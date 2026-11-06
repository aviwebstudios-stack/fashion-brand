import { useEffect, useState } from "react";
import adminApi from "../../lib/adminApi";
import { formatNaira } from "../../lib/format";

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
  paymentStatus: string;
  deliveryAddress: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  items: OrderItem[];
}

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function statusColor(status: string) {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return "bg-brand-accent/15 text-brand-gold";
    case "CANCELLED":
      return "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300";
    case "PROCESSING":
    case "SHIPPED":
      return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300";
    default:
      return "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200";
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [refundingOrder, setRefundingOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [refundAmount, setRefundAmount] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refundSuccess, setRefundSuccess] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    adminApi
      .get("/orders")
      .then((res) => setOrders(res.data.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await adminApi.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch {
      alert("Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openRefundModal = (order: Order) => {
    setRefundingOrder(order);
    setRefundAmount(String(order.total));
    setRefundNote(`Refund for order #${order.id.slice(0, 8).toUpperCase()}`);
    setRefundError("");
    setRefundSuccess(false);
  };

  const handleIssueRefund = async () => {
    if (!refundingOrder) return;
    const amount = parseFloat(refundAmount);
    if (!amount || amount <= 0) {
      setRefundError("Please enter a valid amount.");
      return;
    }

    setRefunding(true);
    setRefundError("");
    try {
      await adminApi.post("/wallet/admin/refund", {
        userId: refundingOrder.user.id,
        amount,
        description: refundNote,
      });
      setRefundSuccess(true);
    } catch (err: any) {
      setRefundError(err.response?.data?.message || "Could not issue refund. Please try again.");
    } finally {
      setRefunding(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-brand-text">Orders</h1>

      {loading ? (
        <p className="mt-8 text-sm text-brand-text/70">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-brand-text/70">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-brand-text/10 bg-brand-surface">
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr className="border-b border-brand-text/10 text-left text-xs uppercase tracking-[0.05em] text-brand-text/70">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-brand-text/10">
                  <td className="px-4 py-3">
                    <p className="text-brand-text">{order.user.name}</p>
                    <p className="text-xs text-brand-text/70">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-text/70">{order.items.length}</td>
                  <td className="px-4 py-3 text-brand-text/70">{formatNaira(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${statusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="border border-brand-text/20 px-2 py-1.5 text-xs focus:border-brand-accent focus:outline-none"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-text/70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="mr-3 text-xs text-brand-gold underline"
                    >
                      View
                    </button>
                    {order.paymentStatus === "PAID" && (
                      <button
                        onClick={() => openRefundModal(order)}
                        className="text-xs text-red-600 dark:text-red-400 underline"
                      >
                        Issue Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewingOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto bg-brand-surface p-6 dark:ring-1 dark:ring-brand-line"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-brand-text">Order Details</h2>
            <p className="mt-1 text-xs text-brand-text/70">{viewingOrder.id}</p>

            <div className="mt-4 border-t border-brand-text/10 pt-4">
              <p className="text-xs uppercase tracking-[0.1em] text-brand-text/70">Customer</p>
              <p className="mt-1 text-sm text-brand-text">{viewingOrder.user.name}</p>
              <p className="text-sm text-brand-text/70">{viewingOrder.user.email}</p>
            </div>

            <div className="mt-4 border-t border-brand-text/10 pt-4">
              <p className="text-xs uppercase tracking-[0.1em] text-brand-text/70">
                Delivery Address
              </p>
              <p className="mt-1 text-sm text-brand-text/80">{viewingOrder.deliveryAddress}</p>
            </div>

            <div className="mt-4 border-t border-brand-text/10 pt-4">
              <p className="text-xs uppercase tracking-[0.1em] text-brand-text/70">Items</p>
              <ul className="mt-2 space-y-3">
                {viewingOrder.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-10 shrink-0 overflow-hidden bg-brand-muted">
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
                      <p className="text-xs text-brand-text/70">
                        Qty {item.quantity}
                        {item.size && ` · Size ${item.size}`}
                      </p>
                    </div>
                    <p className="text-sm text-brand-text/70">{formatNaira(item.price)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-brand-text/10 pt-4 text-sm font-medium text-brand-text">
              <span>Total</span>
              <span>{formatNaira(viewingOrder.total)}</span>
            </div>

            <button
              onClick={() => setViewingOrder(null)}
              className="mt-5 w-full border border-brand-text/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {refundingOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setRefundingOrder(null)}
        >
          <div
            className="w-full max-w-sm bg-brand-surface p-6 dark:ring-1 dark:ring-brand-line"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-brand-text">Issue Refund</h2>
            <p className="mt-1 text-xs text-brand-text/70">
              Refunding to {refundingOrder.user.name}'s wallet
            </p>

            {refundSuccess ? (
              <div className="mt-6">
                <p className="border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-text">
                  Refund issued successfully.
                </p>
                <button
                  onClick={() => setRefundingOrder(null)}
                  className="mt-4 w-full border border-brand-text/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {refundError && <p className="text-sm text-red-600 dark:text-red-400">{refundError}</p>}

                <div>
                  <label className="text-xs text-brand-text/70">Amount (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="mt-1 w-full border border-brand-text/20 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-brand-text/70">Note</label>
                  <textarea
                    value={refundNote}
                    onChange={(e) => setRefundNote(e.target.value)}
                    rows={2}
                    className="mt-1 w-full border border-brand-text/20 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setRefundingOrder(null)}
                    className="flex-1 border border-brand-text/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleIssueRefund}
                    disabled={refunding}
                    className="flex-1 bg-brand-primary py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-cream disabled:opacity-60"
                  >
                    {refunding ? "Issuing..." : "Issue Refund"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

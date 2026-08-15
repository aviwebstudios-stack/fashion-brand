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
      return "bg-[#c9a227]/15 text-[#8a6d1a]";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "PROCESSING":
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
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
      <h1 className="font-serif text-2xl text-[#2b2b26]">Orders</h1>

      {loading ? (
        <p className="mt-8 text-sm text-[#2b2b26]/60">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-[#2b2b26]/60">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-[#2b2b26]/10 bg-white">
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr className="border-b border-[#2b2b26]/10 text-left text-xs uppercase tracking-[0.05em] text-[#2b2b26]/60">
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
                <tr key={order.id} className="border-b border-[#2b2b26]/10">
                  <td className="px-4 py-3">
                    <p className="text-[#2b2b26]">{order.user.name}</p>
                    <p className="text-xs text-[#2b2b26]/50">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">{order.items.length}</td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">{formatNaira(order.total)}</td>
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
                      className="border border-[#2b2b26]/20 px-2 py-1.5 text-xs focus:border-[#c9a227] focus:outline-none"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#2b2b26]/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="mr-3 text-xs text-[#c9a227] underline"
                    >
                      View
                    </button>
                    {order.paymentStatus === "PAID" && (
                      <button
                        onClick={() => openRefundModal(order)}
                        className="text-xs text-red-600 underline"
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
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-[#2b2b26]">Order Details</h2>
            <p className="mt-1 text-xs text-[#2b2b26]/50">{viewingOrder.id}</p>

            <div className="mt-4 border-t border-[#2b2b26]/10 pt-4">
              <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">Customer</p>
              <p className="mt-1 text-sm text-[#2b2b26]">{viewingOrder.user.name}</p>
              <p className="text-sm text-[#2b2b26]/70">{viewingOrder.user.email}</p>
            </div>

            <div className="mt-4 border-t border-[#2b2b26]/10 pt-4">
              <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">
                Delivery Address
              </p>
              <p className="mt-1 text-sm text-[#2b2b26]/80">{viewingOrder.deliveryAddress}</p>
            </div>

            <div className="mt-4 border-t border-[#2b2b26]/10 pt-4">
              <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">Items</p>
              <ul className="mt-2 space-y-3">
                {viewingOrder.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-10 shrink-0 overflow-hidden bg-[#e5e1d8]">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#2b2b26]">{item.product.name}</p>
                      <p className="text-xs text-[#2b2b26]/60">
                        Qty {item.quantity}
                        {item.size && ` · Size ${item.size}`}
                      </p>
                    </div>
                    <p className="text-sm text-[#2b2b26]/70">{formatNaira(item.price)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#2b2b26]/10 pt-4 text-sm font-medium text-[#2b2b26]">
              <span>Total</span>
              <span>{formatNaira(viewingOrder.total)}</span>
            </div>

            <button
              onClick={() => setViewingOrder(null)}
              className="mt-5 w-full border border-[#2b2b26]/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#2b2b26]"
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
            className="w-full max-w-sm bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-[#2b2b26]">Issue Refund</h2>
            <p className="mt-1 text-xs text-[#2b2b26]/60">
              Refunding to {refundingOrder.user.name}'s wallet
            </p>

            {refundSuccess ? (
              <div className="mt-6">
                <p className="border border-[#c9a227]/40 bg-[#c9a227]/10 px-4 py-3 text-sm text-[#2b2b26]">
                  Refund issued successfully.
                </p>
                <button
                  onClick={() => setRefundingOrder(null)}
                  className="mt-4 w-full border border-[#2b2b26]/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#2b2b26]"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {refundError && <p className="text-sm text-red-600">{refundError}</p>}

                <div>
                  <label className="text-xs text-[#2b2b26]/60">Amount (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="mt-1 w-full border border-[#2b2b26]/20 px-3 py-2 text-sm focus:border-[#c9a227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#2b2b26]/60">Note</label>
                  <textarea
                    value={refundNote}
                    onChange={(e) => setRefundNote(e.target.value)}
                    rows={2}
                    className="mt-1 w-full border border-[#2b2b26]/20 px-3 py-2 text-sm focus:border-[#c9a227] focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setRefundingOrder(null)}
                    className="flex-1 border border-[#2b2b26]/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#2b2b26]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleIssueRefund}
                    disabled={refunding}
                    className="flex-1 bg-[#3d4636] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#f4f1e8] disabled:opacity-60"
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

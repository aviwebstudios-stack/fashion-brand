import { useEffect, useState } from "react";
import adminApi from "../../lib/adminApi";
import { formatNaira } from "../../lib/format";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  user: { id: string; name: string; email: string };
  service: { name: string };
}

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"];

function statusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "bg-brand-accent/15 text-brand-gold";
    case "CANCELLED":
    case "NO_SHOW":
      return "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300";
    default:
      return "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200";
  }
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [refundingBooking, setRefundingBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [refundAmount, setRefundAmount] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refundSuccess, setRefundSuccess] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    adminApi
      .get("/bookings")
      .then((res) => setBookings(res.data.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    try {
      await adminApi.patch(`/bookings/${bookingId}/status`, { status });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
    } catch {
      alert("Could not update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openRefundModal = (booking: Booking) => {
    setRefundingBooking(booking);
    setRefundAmount(String(booking.total));
    setRefundNote(`Refund for cancelled booking - ${booking.service.name}`);
    setRefundError("");
    setRefundSuccess(false);
  };

  const handleIssueRefund = async () => {
    if (!refundingBooking) return;
    const amount = parseFloat(refundAmount);
    if (!amount || amount <= 0) {
      setRefundError("Please enter a valid amount.");
      return;
    }

    setRefunding(true);
    setRefundError("");
    try {
      await adminApi.post("/wallet/admin/refund", {
        userId: refundingBooking.user.id,
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
      <h1 className="font-serif text-2xl text-brand-text">Bookings</h1>

      {loading ? (
        <p className="mt-8 text-sm text-brand-text/70">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="mt-8 text-sm text-brand-text/70">No bookings yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-brand-text/10 bg-brand-surface">
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr className="border-b border-brand-text/10 text-left text-xs uppercase tracking-[0.05em] text-brand-text/70">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-brand-text/10">
                  <td className="px-4 py-3">
                    <p className="text-brand-text">{booking.user.name}</p>
                    <p className="text-xs text-brand-text/70">{booking.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-text/70">{booking.service.name}</td>
                  <td className="px-4 py-3 text-brand-text/70">
                    {new Date(booking.date).toLocaleDateString()} · {booking.startTime}
                  </td>
                  <td className="px-4 py-3 text-brand-text/70">{formatNaira(booking.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${statusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      disabled={updatingId === booking.id}
                      className="border border-brand-text/20 px-2 py-1.5 text-xs focus:border-brand-accent focus:outline-none"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setViewingBooking(booking)}
                      className="mr-3 text-xs text-brand-gold underline"
                    >
                      View
                    </button>
                    {booking.paymentStatus === "PAID" && (
                      <button
                        onClick={() => openRefundModal(booking)}
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

      {viewingBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingBooking(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto bg-brand-surface p-6 dark:ring-1 dark:ring-brand-line"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-brand-text">Booking Details</h2>
            <p className="mt-1 text-xs text-brand-text/70">{viewingBooking.id}</p>

            <div className="mt-4 space-y-3 border-t border-brand-text/10 pt-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-brand-text/70">Customer</p>
                <p className="mt-1 text-brand-text">{viewingBooking.user.name}</p>
                <p className="text-brand-text/70">{viewingBooking.user.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-brand-text/70">Service</p>
                <p className="mt-1 text-brand-text">{viewingBooking.service.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-brand-text/70">
                  Date & Time
                </p>
                <p className="mt-1 text-brand-text">
                  {new Date(viewingBooking.date).toLocaleDateString()} · {viewingBooking.startTime}{" "}
                  to {viewingBooking.endTime}
                </p>
              </div>
              {viewingBooking.notes && (
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-brand-text/70">Notes</p>
                  <p className="mt-1 text-brand-text/80">{viewingBooking.notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-brand-text/10 pt-3 font-medium">
                <span>Total</span>
                <span>{formatNaira(viewingBooking.total)}</span>
              </div>
            </div>

            <button
              onClick={() => setViewingBooking(null)}
              className="mt-5 w-full border border-brand-text/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {refundingBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setRefundingBooking(null)}
        >
          <div
            className="w-full max-w-sm bg-brand-surface p-6 dark:ring-1 dark:ring-brand-line"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-brand-text">Issue Refund</h2>
            <p className="mt-1 text-xs text-brand-text/70">
              Refunding to {refundingBooking.user.name}'s wallet
            </p>

            {refundSuccess ? (
              <div className="mt-6">
                <p className="border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-text">
                  Refund issued successfully.
                </p>
                <button
                  onClick={() => setRefundingBooking(null)}
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
                    onClick={() => setRefundingBooking(null)}
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

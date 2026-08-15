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
      return "bg-[#c9a227]/15 text-[#8a6d1a]";
    case "CANCELLED":
    case "NO_SHOW":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
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
      <h1 className="font-serif text-2xl text-[#2b2b26]">Bookings</h1>

      {loading ? (
        <p className="mt-8 text-sm text-[#2b2b26]/60">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="mt-8 text-sm text-[#2b2b26]/60">No bookings yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-[#2b2b26]/10 bg-white">
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr className="border-b border-[#2b2b26]/10 text-left text-xs uppercase tracking-[0.05em] text-[#2b2b26]/60">
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
                <tr key={booking.id} className="border-b border-[#2b2b26]/10">
                  <td className="px-4 py-3">
                    <p className="text-[#2b2b26]">{booking.user.name}</p>
                    <p className="text-xs text-[#2b2b26]/50">{booking.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">{booking.service.name}</td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">
                    {new Date(booking.date).toLocaleDateString()} · {booking.startTime}
                  </td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">{formatNaira(booking.total)}</td>
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
                      className="border border-[#2b2b26]/20 px-2 py-1.5 text-xs focus:border-[#c9a227] focus:outline-none"
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
                      className="mr-3 text-xs text-[#c9a227] underline"
                    >
                      View
                    </button>
                    {booking.paymentStatus === "PAID" && (
                      <button
                        onClick={() => openRefundModal(booking)}
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

      {viewingBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingBooking(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-[#2b2b26]">Booking Details</h2>
            <p className="mt-1 text-xs text-[#2b2b26]/50">{viewingBooking.id}</p>

            <div className="mt-4 space-y-3 border-t border-[#2b2b26]/10 pt-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">Customer</p>
                <p className="mt-1 text-[#2b2b26]">{viewingBooking.user.name}</p>
                <p className="text-[#2b2b26]/70">{viewingBooking.user.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">Service</p>
                <p className="mt-1 text-[#2b2b26]">{viewingBooking.service.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">
                  Date & Time
                </p>
                <p className="mt-1 text-[#2b2b26]">
                  {new Date(viewingBooking.date).toLocaleDateString()} · {viewingBooking.startTime}{" "}
                  – {viewingBooking.endTime}
                </p>
              </div>
              {viewingBooking.notes && (
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">Notes</p>
                  <p className="mt-1 text-[#2b2b26]/80">{viewingBooking.notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[#2b2b26]/10 pt-3 font-medium">
                <span>Total</span>
                <span>{formatNaira(viewingBooking.total)}</span>
              </div>
            </div>

            <button
              onClick={() => setViewingBooking(null)}
              className="mt-5 w-full border border-[#2b2b26]/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#2b2b26]"
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
            className="w-full max-w-sm bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-[#2b2b26]">Issue Refund</h2>
            <p className="mt-1 text-xs text-[#2b2b26]/60">
              Refunding to {refundingBooking.user.name}'s wallet
            </p>

            {refundSuccess ? (
              <div className="mt-6">
                <p className="border border-[#c9a227]/40 bg-[#c9a227]/10 px-4 py-3 text-sm text-[#2b2b26]">
                  Refund issued successfully.
                </p>
                <button
                  onClick={() => setRefundingBooking(null)}
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
                    onClick={() => setRefundingBooking(null)}
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  service: { name: string };
}

function statusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "bg-brand-accent/15 text-[#8a6d1a]";
    case "CANCELLED":
    case "NO_SHOW":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/my-bookings")
      .then((res) => setBookings(res.data.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-center font-heading text-3xl text-brand-text">My Bookings</h1>

      {loading ? (
        <p className="mt-10 text-center text-sm text-brand-text/60">Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-sm text-brand-text/70">You haven't booked a consultation yet.</p>
          <Link
            to="/consultations"
            className="mt-4 inline-block text-sm text-brand-accent hover:underline"
          >
            Book a consultation
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <Link
                to={`/account/bookings/${booking.id}`}
                className="flex items-center justify-between border border-brand-text/10 p-5 transition hover:border-brand-text/30"
              >
                <div>
                  <p className="text-sm font-medium text-brand-text">{booking.service.name}</p>
                  <p className="mt-1 text-xs text-brand-text/60">
                    {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${statusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className="text-sm text-brand-text/80">{formatNaira(booking.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
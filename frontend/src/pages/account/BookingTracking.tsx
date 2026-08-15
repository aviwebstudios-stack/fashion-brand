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

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  status: string;
  total: number;
  createdAt: string;
  service: { name: string; description: string };
  statusHistory: StatusHistoryEntry[];
}

export default function BookingTracking() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/bookings/my-bookings/${id}`)
      .then((res) => setBooking(res.data.data))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="px-6 py-20 text-center text-sm text-brand-text/60">Loading...</p>;
  }

  if (!booking) {
    return <p className="px-6 py-20 text-center text-sm text-brand-text/60">Booking not found.</p>;
  }

  const timeline = [...booking.statusHistory].reverse();

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <Link to="/account/bookings" className="text-sm text-brand-accent hover:underline">
        ← Back to my bookings
      </Link>

      <h1 className="mt-4 font-heading text-2xl text-brand-text">{booking.service.name}</h1>
      <p className="mt-1 text-sm text-brand-text/60">
        Booked on {new Date(booking.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 border border-brand-text/10 p-5">
        <p className="text-sm text-brand-text">
          <span className="font-medium">Date & Time:</span>{" "}
          {new Date(booking.date).toLocaleDateString()} · {booking.startTime} – {booking.endTime}
        </p>
        {booking.notes && (
          <p className="mt-2 text-sm text-brand-text/80">
            <span className="font-medium">Notes:</span> {booking.notes}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-brand-text/10 pt-3 text-sm font-medium text-brand-text">
          <span>Total</span>
          <span>{formatNaira(booking.total)}</span>
        </div>
      </div>

      <h2 className="mt-10 text-xs uppercase tracking-[0.1em] text-brand-accent">
        Booking Status
      </h2>
      <div className="mt-4 space-y-0">
        {timeline.map((entry, i) => (
          <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
            {i !== timeline.length - 1 && (
              <div className="absolute left-[5px] top-3 h-full w-px bg-brand-text/15" />
            )}
            <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full bg-brand-primary" />
            <div>
              <p className="text-sm font-medium text-brand-text">{entry.note || entry.status}</p>
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
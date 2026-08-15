import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

interface AccountViewProps {
  onOpenMeasurements: () => void;
  onClose: () => void;
}

interface Profile {
  name: string;
  email: string;
  phone: string | null;
}

export default function AccountView({ onOpenMeasurements, onClose }: AccountViewProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/users/me"),
      api.get("/orders/my-orders"),
      api.get("/bookings/my-bookings"),
    ])
      .then(([profileRes, ordersRes, bookingsRes]) => {
        setProfile(profileRes.data.data);
        setOrderCount(ordersRes.data.data.length);
        setBookingCount(bookingsRes.data.data.length);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleViewOrders = () => {
    onClose();
    navigate("/account/orders");
  };

  const handleViewBookings = () => {
    onClose();
    navigate("/account/bookings");
  };

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-5">
        <button onClick={onClose} className="text-sm text-brand-text/70 hover:text-brand-text">
          Return to Store
        </button>
        <button onClick={handleLogout} className="text-sm text-brand-text/70 hover:text-brand-text">
          Log out
        </button>
      </div>

      <h1 className="text-center font-heading text-2xl tracking-[0.1em] text-brand-text">
        MY ACCOUNT
      </h1>

      <div className="mt-10 px-6">
        {loading ? (
          <p className="text-sm text-brand-text/60">Loading...</p>
        ) : profile ? (
          <>
            <p className="font-heading text-lg uppercase tracking-wide text-brand-text">
              {profile.name}
            </p>
            <p className="mt-1 text-sm text-brand-text/70">{profile.email}</p>
            {profile.phone && <p className="mt-1 text-sm text-brand-text/70">{profile.phone}</p>}

            <div className="mt-8 space-y-2">
              {orderCount === 0 ? (
                <p className="text-sm text-brand-text/70">You haven't placed any orders yet.</p>
              ) : (
                <button
                  onClick={handleViewOrders}
                  className="block text-sm text-brand-accent hover:underline"
                >
                  View my orders ({orderCount})
                </button>
              )}

              {bookingCount === 0 ? (
                <p className="text-sm text-brand-text/70">
                  You haven't booked a consultation yet.
                </p>
              ) : (
                <button
                  onClick={handleViewBookings}
                  className="block text-sm text-brand-accent hover:underline"
                >
                  View my bookings ({bookingCount})
                </button>
              )}
            </div>

            <button
              onClick={onOpenMeasurements}
              className="mt-8 w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
            >
              My Measurements
            </button>
          </>
        ) : (
          <p className="text-sm text-red-600">Could not load your account. Please try again.</p>
        )}
      </div>
    </div>
  );
}
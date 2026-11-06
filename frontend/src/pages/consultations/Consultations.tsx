import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";
import { useAuthStore } from "../../store/authStore";
import { useContent } from "../../lib/useContent";
import Reveal from "../../components/common/Reveal";
import { ContentImage, ContentVideo } from "../../components/content/ContentMedia";
import { usePageMeta } from "../../lib/usePageMeta";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Consultations() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  usePageMeta({
    title: "Consultations",
    description: "Book a one-on-one consultation with Favy Atelier for a bespoke or bridal piece. Bespoke starts at ₦150,000. Pick a service and time and pay online.",
  });

  const heroTitle = useContent("consultations.hero.title", "Favy Consultation Services");
  const heroSubtitle = useContent("consultations.hero.subtitle", "Plan your piece with our team before we make it.");
  const heroBody = useContent("consultations.hero.body", "Every bespoke and bridal piece starts here. We talk through the design, fabric and fit with you, then make the piece for your event or your wedding day.");

  const brideTitle = useContent("consultations.bride.title", "Favy Bride");
  const bridePronunciation = useContent("consultations.bride.subtitle", "noun /fay-vee brahyd/");
  const brideBody = useContent("consultations.bride.body", "Favy Bride is our bridal line. Each gown is handmade and cut to your measurements, with traditional beadwork on a modern shape.");

  const galleryTitle = useContent("consultations.gallery.title", "Real Favy Brides");
  const GALLERY_IMAGES = [1, 2, 3, 4].map((n) => ({
    key: `consultations.gallery.image${n}`,
    file: `consultations-real-brides-${n}.webp`,
  }));

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/bookings/services").then((res) => setServices(res.data.data)).catch(() => setServices([])).finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (!selectedServiceId || !date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSelectedTime("");
    api
      .get(`/bookings/services/${selectedServiceId}/slots`, { params: { date } })
      .then((res) => setSlots(res.data.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedServiceId, date]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!selectedServiceId || !selectedTime) {
      setError("Please select a service and time slot.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const bookingRes = await api.post("/bookings", { serviceId: selectedServiceId, date, startTime: selectedTime, notes: notes || undefined });
      const bookingId = bookingRes.data.data.id;
      const paymentRes = await api.post(`/payments/booking/${bookingId}`);
      window.location.href = paymentRes.data.data.authorizationUrl;
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div>
      <Reveal className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div className="max-w-sm">
            <h1 className="reveal-item font-heading text-3xl text-brand-text">{heroTitle}</h1>
            <p className="reveal-item mt-4 text-sm font-medium text-brand-text">{heroSubtitle}</p>
            <p className="reveal-item mt-4 text-sm leading-relaxed text-brand-text/70">{heroBody}</p>
            <p className="reveal-item mt-4 text-sm font-medium leading-relaxed text-brand-text">
              Bespoke pieces start at ₦150,000. Fully hand-beaded designs start at ₦850,000.
            </p>
          </div>

          <div className="flex items-end justify-center gap-4 sm:gap-6">
            {[
              { key: "consultations.hero.womanImage", file: "consultations-favy-woman.webp", label: "Favy Woman" },
              { key: "consultations.hero.brideImage", file: "consultations-favy-bride.webp", label: "Favy Bride" },
            ].map((item) => (
              <div key={item.key} className="reveal-item w-1/2">
                <ContentImage
                  contentKey={item.key}
                  file={item.file}
                  alt={item.label}
                  eager
                  className="aspect-[3/4] rounded-t-full bg-[#e5e1d8]"
                />
                <p className="mt-3 bg-brand-primary py-2.5 text-center text-xs uppercase tracking-[0.15em] text-[#f4f1e8]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-7xl px-6 pb-16 pt-4 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <ContentImage
            contentKey="consultations.bride.tallImage"
            file="consultations-bride-definition.webp"
            alt="A Favy Atelier bride"
            className="reveal-item aspect-[3/5] rounded-t-full bg-[#e5e1d8]"
          />

          <div>
            <h2 className="reveal-item font-heading text-2xl text-brand-text">{brideTitle}</h2>
            <p className="reveal-item mt-2 text-sm italic text-brand-text/60">{bridePronunciation}</p>
            <p className="reveal-item mt-4 max-w-md text-sm leading-relaxed text-brand-text/70">{brideBody}</p>
            <Link
              to="/shop/bridals"
              className="reveal-item mt-6 inline-block bg-brand-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
            >
              Shop Bridals
            </Link>
          </div>
        </div>
      </Reveal>

      <ContentVideo contentKey="consultations.bridal.video" file="consultations-bridal-video" className="aspect-[4/5] w-full bg-black sm:aspect-video" />

      <Reveal className="bg-brand-bg py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="reveal-item font-heading text-2xl text-brand-text">{galleryTitle}</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <ContentImage
                key={img.key}
                contentKey={img.key}
                file={img.file}
                alt={`Favy Atelier bride, photo ${i + 1}`}
                className="reveal-item aspect-[3/4] bg-[#e5e1d8]"
              />
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <Reveal>
          <h2 className="reveal-item font-heading text-2xl text-brand-text">Book a Consultation</h2>
          <p className="reveal-item mt-2 text-sm text-brand-text/70">Pick a service and a time, then pay online to confirm your slot.</p>
        </Reveal>

        {loadingServices ? (
          <p className="mt-8 text-sm text-brand-text/60">Loading consultation services...</p>
        ) : services.length === 0 ? (
          <p className="mt-8 text-sm text-brand-text/70">
            No consultation services are open for booking right now. <Link to="/contact" className="underline underline-offset-2">Contact us</Link> and we'll find a time.
          </p>
        ) : (
          <div className="mt-10 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-brand-text">Select a Service</p>
              <div className="mt-3 space-y-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`w-full border p-4 text-left transition ${
                      selectedServiceId === service.id ? "border-brand-primary bg-brand-primary/5" : "border-brand-text/20 hover:border-brand-text/40"
                    }`}
                  >
                    <p className="text-sm font-medium text-brand-text">{service.name}</p>
                    <p className="mt-1 text-xs text-brand-text/60">{service.duration} min · {formatNaira(service.price)}</p>
                    <p className="mt-2 text-xs leading-relaxed text-brand-text/70">{service.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedServiceId && (
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-brand-text">Select a Date</p>
                <input
                  type="date"
                  min={todayISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-3 w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
                />
              </div>
            )}

            {selectedServiceId && date && (
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-brand-text">Available Time Slots</p>
                {loadingSlots ? (
                  <p className="mt-3 text-sm text-brand-text/60">Checking available times...</p>
                ) : slots.length === 0 ? (
                  <p className="mt-3 text-sm text-brand-text/60">No slots available on this date. Please choose another date.</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`border px-4 py-2 text-sm transition ${
                          selectedTime === slot ? "border-brand-primary bg-brand-primary text-[#f4f1e8]" : "border-brand-text/25 text-brand-text hover:border-brand-text"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTime && (
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-brand-text">Notes (optional)</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Tell us about the occasion or style you have in mind"
                  className="mt-3 w-full border border-brand-text/20 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/50 focus:border-brand-accent focus:outline-none"
                />
              </div>
            )}

            {error && (
              <p className="border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
            )}

            {selectedTime && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-brand-primary py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Redirecting to payment..." : `Confirm & Pay ${selectedService ? formatNaira(selectedService.price) : ""}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";
import { useAuthStore } from "../../store/authStore";
import { useContent } from "../../lib/useContent";
import Reveal from "../../components/common/Reveal";

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

  const heroTitle = useContent("consultations.hero.title", "Favy Consultation Services");
  const heroSubtitle = useContent("consultations.hero.subtitle", "Elevate your style with a personalized Favy Atelier experience");
  const heroBody = useContent("consultations.hero.body", "At Favy Atelier, we believe every garment should reflect your unique style and elegance. Our personalized consultations ensure your piece is meticulously crafted to perfection — whether for a special event or your wedding day.");
  const womanImage = useContent("consultations.hero.womanImage", "https://picsum.photos/seed/favy-woman/600/800");
  const brideImage = useContent("consultations.hero.brideImage", "https://picsum.photos/seed/favy-bride/600/800");
  const tallBrideImage = useContent("consultations.bride.tallImage", "https://picsum.photos/seed/favy-bride-tall/700/1100");
  const bridalVideo = useContent("consultations.bridal.video", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");

  const brideTitle = useContent("consultations.bride.title", "Favy Bride");
  const bridePronunciation = useContent("consultations.bride.subtitle", "noun /fay-vee brahyd/");
  const brideBody = useContent("consultations.bride.body", "Welcome to Favy Bride, where your wedding dreams come to life. Our bridal collection masterfully blends traditional artistry with modern elegance, featuring handcrafted gowns made from luxurious fabrics. Each dress is meticulously tailored to reflect your unique beauty and style, ensuring you feel extraordinary on your special day.");

  const galleryTitle = useContent("consultations.gallery.title", "Real Favy Brides");
  const galleryImage1 = useContent("consultations.gallery.image1", "https://picsum.photos/seed/real-bride-1/500/600");
  const galleryImage2 = useContent("consultations.gallery.image2", "https://picsum.photos/seed/real-bride-2/500/600");
  const galleryImage3 = useContent("consultations.gallery.image3", "https://picsum.photos/seed/real-bride-3/500/600");
  const galleryImage4 = useContent("consultations.gallery.image4", "https://picsum.photos/seed/real-bride-4/500/600");
  const GALLERY_IMAGES = [galleryImage1, galleryImage2, galleryImage3, galleryImage4];

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
      <Reveal>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div className="mx-auto max-w-sm md:mx-0">
              <h1 className="font-heading text-3xl text-brand-text">{heroTitle}</h1>
              <p className="mt-4 text-sm font-medium text-brand-text">{heroSubtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-brand-text/70">{heroBody}</p>
              <p className="mt-4 text-sm leading-relaxed text-brand-text/70">
                <span className="font-medium text-brand-text">
                  Please note that bespoke pieces start at ₦150,000, with fully hand-beaded designs beginning at ₦850,000.
                </span>
              </p>
            </div>

            <div className="flex items-end justify-center gap-6">
              <div className="w-1/2">
                <div className="aspect-[3/4] overflow-hidden rounded-t-full bg-[#e5e1d8]">
                  <img src={womanImage} alt="Favy Woman" className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 bg-brand-primary py-2.5 text-center text-xs uppercase tracking-[0.15em] text-[#f4f1e8]">Favy Woman</p>
              </div>
              <div className="w-1/2">
                <div className="aspect-[3/4] overflow-hidden rounded-t-full bg-[#e5e1d8]">
                  <img src={brideImage} alt="Favy Bride" className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 bg-brand-primary py-2.5 text-center text-xs uppercase tracking-[0.15em] text-[#f4f1e8]">Favy Bride</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div className="aspect-[3/5] overflow-hidden rounded-t-full bg-[#e5e1d8]">
              <img src={tallBrideImage} alt="Favy Bride" className="h-full w-full object-cover" />
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-text">{brideTitle}</h2>
              <p className="mt-2 text-sm italic text-brand-text/60">{bridePronunciation}</p>
              <p className="mt-4 text-sm leading-relaxed text-brand-text/70">{brideBody}</p>
              <Link
                to="/shop/bridals"
                className="mt-6 inline-block bg-brand-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
              >
                Shop Bridals
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="aspect-video w-full bg-black">
        <video src={bridalVideo} autoPlay loop muted playsInline className="h-full w-full object-cover" />
      </div>

      <div className="bg-brand-bg py-16">
        <Reveal>
          <h2 className="text-center font-heading text-2xl text-brand-text">{galleryTitle}</h2>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-4">
          {GALLERY_IMAGES.map((src, i) => (
            <Reveal key={src} delay={i * 80}>
              <div className="aspect-[3/4] overflow-hidden bg-[#e5e1d8]">
                <img src={src} alt="Real Favy bride" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <Reveal>
          <h2 className="text-center font-heading text-2xl text-brand-text">Book a Consultation</h2>
        </Reveal>

        {loadingServices ? (
          <p className="mt-8 text-center text-sm text-brand-text/60">Loading services...</p>
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
                  <p className="mt-3 text-sm text-brand-text/60">Loading...</p>
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

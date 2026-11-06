import { useEffect, useState } from "react";
import adminApi from "../../lib/adminApi";

interface FieldConfig {
  key: string;
  label: string;
  fallback: string;
  multiline?: boolean;
}

interface FieldGroup {
  group: string;
  fields: FieldConfig[];
}

interface MediaFieldConfig {
  key: string;
  file: string;
  label: string;
  type: "image" | "video";
  fallback: string;
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    group: "Home Page",
    fields: [
      { key: "home.hero.tagline", label: "Hero tagline", fallback: "Haute couture and ready-to-wear for the contemporary African woman." },
      { key: "home.hero.cta", label: "Hero button text", fallback: "Shop Ready-to-Wear" },
      { key: "home.banner.rtw.subtitle", label: "Ready-to-Wear banner subtitle", fallback: "Everyday pieces, ready to order in your size." },
      { key: "home.banner.bridals.subtitle", label: "Bridals banner subtitle", fallback: "Gowns that tell your story, on the day it matters most." },
      { key: "home.banner.bespoke.subtitle", label: "Bespoke banner subtitle", fallback: "Made to your measurements, for the occasion you have in mind." },
      { key: "home.banner.sales.subtitle", label: "Sales banner subtitle", fallback: "Final pieces at reduced prices. Once they sell, they're gone." },
      { key: "home.cta.title", label: "Consultation CTA heading", fallback: "Something made just for you" },
      { key: "home.cta.subtitle", label: "Consultation CTA subtitle", fallback: "Book a one-on-one consultation and we'll design a piece around your measurements and your occasion.", multiline: true },
    ],
  },
  {
    group: "Footer",
    fields: [
      { key: "footer.tagline", label: "Footer tagline", fallback: "Haute couture and ready-to-wear for the contemporary African woman. Made with love on Lagos Island.", multiline: true },
    ],
  },
  {
    group: "Consultations Page",
    fields: [
      { key: "consultations.hero.title", label: "Hero heading", fallback: "Favy Consultation Services" },
      { key: "consultations.hero.subtitle", label: "Hero subtitle", fallback: "Plan your piece with our team before we make it." },
      { key: "consultations.hero.body", label: "Hero body paragraph", fallback: "Every bespoke and bridal piece starts here. We talk through the design, fabric and fit with you, then make the piece for your event or your wedding day.", multiline: true },
      { key: "consultations.bride.title", label: "Bride section heading", fallback: "Favy Bride" },
      { key: "consultations.bride.subtitle", label: "Bride section pronunciation line", fallback: "noun /fay-vee brahyd/" },
      { key: "consultations.bride.body", label: "Bride section body paragraph", fallback: "Favy Bride is our bridal line. Each gown is handmade and cut to your measurements, with traditional beadwork on a modern shape.", multiline: true },
      { key: "consultations.gallery.title", label: "Real Brides gallery heading", fallback: "Real Favy Brides" },
    ],
  },
  {
    group: "Academy: Hero",
    fields: [
      { key: "academy.hero.title", label: "Hero headline", fallback: "Design Your Future in Fashion" },
      { key: "academy.hero.subtitle", label: "Hero subheadline", fallback: "Learn from industry masters. Build your collection." },
      { key: "academy.hero.cta1", label: "Primary button text", fallback: "View Programs" },
      { key: "academy.hero.cta2", label: "Secondary button text", fallback: "Book a Tour" },
    ],
  },
  {
    group: "Academy: Stats Bar",
    fields: [
      { key: "academy.stats.stat1.number", label: "Stat 1 number", fallback: "94%" },
      { key: "academy.stats.stat1.label", label: "Stat 1 label", fallback: "Employment Rate" },
      { key: "academy.stats.stat2.number", label: "Stat 2 number", fallback: "50+" },
      { key: "academy.stats.stat2.label", label: "Stat 2 label", fallback: "Industry Partners" },
      { key: "academy.stats.stat3.number", label: "Stat 3 number", fallback: "12" },
      { key: "academy.stats.stat3.label", label: "Stat 3 label", fallback: "Runways" },
    ],
  },
  {
    group: "Academy: Program 1",
    fields: [
      { key: "academy.program1.name", label: "Name", fallback: "Fashion Design & Masters" },
      { key: "academy.program1.duration", label: "Duration", fallback: "3 Years · Full Time" },
      { key: "academy.program1.price", label: "Price", fallback: "₦2,800,000" },
      { key: "academy.program1.description", label: "Description", fallback: "A comprehensive degree covering design theory, garment construction, and portfolio development.", multiline: true },
      { key: "academy.program1.category", label: "Category (type exactly: degree or short)", fallback: "degree" },
    ],
  },
  {
    group: "Academy: Program 2",
    fields: [
      { key: "academy.program2.name", label: "Name", fallback: "Fashion Marketing & Brand" },
      { key: "academy.program2.duration", label: "Duration", fallback: "2 Years · Full Time" },
      { key: "academy.program2.price", label: "Price", fallback: "₦1,900,000" },
      { key: "academy.program2.description", label: "Description", fallback: "Learn branding, retail strategy, and the business of building a fashion label.", multiline: true },
      { key: "academy.program2.category", label: "Category (type exactly: degree or short)", fallback: "degree" },
    ],
  },
  {
    group: "Academy: Program 3",
    fields: [
      { key: "academy.program3.name", label: "Name", fallback: "Pattern Cutting & Garment Construction" },
      { key: "academy.program3.duration", label: "Duration", fallback: "8 weeks" },
      { key: "academy.program3.price", label: "Price", fallback: "₦280,000" },
      { key: "academy.program3.description", label: "Description", fallback: "Master pattern drafting, fabric behavior, and precision construction from sketch to finished piece.", multiline: true },
      { key: "academy.program3.category", label: "Category (type exactly: degree or short)", fallback: "short" },
    ],
  },
  {
    group: "Academy: Program 4",
    fields: [
      { key: "academy.program4.name", label: "Name", fallback: "Bridal Couture Techniques" },
      { key: "academy.program4.duration", label: "Duration", fallback: "6 weeks" },
      { key: "academy.program4.price", label: "Price", fallback: "₦350,000" },
      { key: "academy.program4.description", label: "Description", fallback: "A hands-on deep dive into corsetry, beading, and structured bridal silhouettes.", multiline: true },
      { key: "academy.program4.category", label: "Category (type exactly: degree or short)", fallback: "short" },
    ],
  },
  {
    group: "Academy: Program 5",
    fields: [
      { key: "academy.program5.name", label: "Name", fallback: "Fashion Business & Entrepreneurship" },
      { key: "academy.program5.duration", label: "Duration", fallback: "4 weeks" },
      { key: "academy.program5.price", label: "Price", fallback: "₦150,000" },
      { key: "academy.program5.description", label: "Description", fallback: "Build the business behind the brand: pricing, sourcing and growing a label in Nigeria.", multiline: true },
      { key: "academy.program5.category", label: "Category (type exactly: degree or short)", fallback: "short" },
    ],
  },
  {
    group: "Academy: Student Showcase",
    fields: [
      { key: "academy.showcase.title", label: "Section heading", fallback: "Student Showcase" },
      { key: "academy.showcase.caption1", label: "Showcase image 1 caption", fallback: "Collection 2026" },
      { key: "academy.showcase.caption2", label: "Showcase image 2 caption", fallback: "Concept Phase" },
      { key: "academy.showcase.caption3", label: "Showcase image 3 caption", fallback: "Final Runway Look" },
    ],
  },
  {
    group: "Academy: Campus & Facilities",
    fields: [
      { key: "academy.facilities.title", label: "Section heading", fallback: "Campus & Facilities" },
      { key: "academy.facilities.intro", label: "Section intro line", fallback: "Industry-standard tools from day one." },
      { key: "academy.facilities.point1", label: "Facility point 1", fallback: "Mac Labs with CLO 3D software" },
      { key: "academy.facilities.point2", label: "Facility point 2", fallback: "Industrial sewing & pattern tables" },
      { key: "academy.facilities.point3", label: "Facility point 3", fallback: "Fully equipped fabric library" },
    ],
  },
  {
    group: "Academy: Admissions",
    fields: [
      { key: "academy.admissions.title", label: "Section heading", fallback: "Admissions Process" },
      { key: "academy.admissions.step1", label: "Step 1", fallback: "Choose Program" },
      { key: "academy.admissions.step2", label: "Step 2", fallback: "Submit Portfolio" },
      { key: "academy.admissions.step3", label: "Step 3", fallback: "Interview" },
      { key: "academy.admissions.cta", label: "Button text", fallback: "Request the Admissions Guide" },
    ],
  },
  {
    group: "Academy: Testimonial & Press",
    fields: [
      { key: "academy.testimonial.quote", label: "Testimonial quote", fallback: "The mentorship here helped me launch my label right away.", multiline: true },
      { key: "academy.testimonial.author", label: "Testimonial author", fallback: "Sarah J., Class of '25" },
      { key: "academy.press.label1", label: "Press mention 1", fallback: "VOGUE" },
      { key: "academy.press.label2", label: "Press mention 2", fallback: "BUSINESS OF FASHION" },
      { key: "academy.press.label3", label: "Press mention 3", fallback: "WWD MAGAZINE" },
    ],
  },
];

const MEDIA_FIELDS: MediaFieldConfig[] = [
  { key: "home.hero.video", file: "home-hero", label: "Home hero background video", type: "video", fallback: "/media-originals/home-hero.mp4" },
  { key: "home.banner.rtw.image", file: "home-ready-to-wear", label: "Home: Ready-to-Wear banner image", type: "image", fallback: "/media-originals/home-ready-to-wear.webp" },
  { key: "home.banner.bridals.image", file: "home-bridals", label: "Home: Bridals banner image", type: "image", fallback: "/media-originals/home-bridals.webp" },
  { key: "home.banner.bespoke.image", file: "home-bespoke", label: "Home: Bespoke banner image", type: "image", fallback: "/media-originals/home-bespoke.webp" },
  { key: "home.banner.sales.image", file: "home-sales", label: "Home: Sales banner image", type: "image", fallback: "/media-originals/home-sales.webp" },
  { key: "consultations.hero.womanImage", file: "consultations-favy-woman", label: "Consultations: Favy Woman photo", type: "image", fallback: "/media-originals/consultations-favy-woman.webp" },
  { key: "consultations.hero.brideImage", file: "consultations-favy-bride", label: "Consultations: Favy Bride photo", type: "image", fallback: "/media-originals/consultations-favy-bride.webp" },
  { key: "consultations.bride.tallImage", file: "consultations-bride-definition", label: "Consultations: Bride definition photo", type: "image", fallback: "/media-originals/consultations-bride-definition.webp" },
  { key: "consultations.bridal.video", file: "consultations-bridal-video", label: "Consultations: Bridal video", type: "video", fallback: "/media-originals/consultations-bridal-video.mp4" },
  { key: "consultations.gallery.image1", file: "consultations-real-brides-1", label: "Consultations: Real Brides gallery photo 1", type: "image", fallback: "/media-originals/consultations-real-brides-1.webp" },
  { key: "consultations.gallery.image2", file: "consultations-real-brides-2", label: "Consultations: Real Brides gallery photo 2", type: "image", fallback: "/media-originals/consultations-real-brides-2.webp" },
  { key: "consultations.gallery.image3", file: "consultations-real-brides-3", label: "Consultations: Real Brides gallery photo 3", type: "image", fallback: "/media-originals/consultations-real-brides-3.webp" },
  { key: "consultations.gallery.image4", file: "consultations-real-brides-4", label: "Consultations: Real Brides gallery photo 4", type: "image", fallback: "/media-originals/consultations-real-brides-4.webp" },
  { key: "academy.hero.video", file: "academy-hero", label: "Academy: Hero background video", type: "video", fallback: "/media-originals/academy-hero.mp4" },
  { key: "academy.program1.image", file: "academy-program-1", label: "Academy: Program 1 photo", type: "image", fallback: "/media-originals/academy-program-1.webp" },
  { key: "academy.program2.image", file: "academy-program-2", label: "Academy: Program 2 photo", type: "image", fallback: "/media-originals/academy-program-2.webp" },
  { key: "academy.program3.image", file: "academy-program-3", label: "Academy: Program 3 photo", type: "image", fallback: "/media-originals/academy-program-3.webp" },
  { key: "academy.program4.image", file: "academy-program-4", label: "Academy: Program 4 photo", type: "image", fallback: "/media-originals/academy-program-4.webp" },
  { key: "academy.program5.image", file: "academy-program-5", label: "Academy: Program 5 photo", type: "image", fallback: "/media-originals/academy-program-5.webp" },
  { key: "academy.showcase.image1", file: "academy-showcase-1-lookbook", label: "Academy: Showcase photo 1 (lookbook)", type: "image", fallback: "/media-originals/academy-showcase-1-lookbook.webp" },
  { key: "academy.showcase.image2", file: "academy-showcase-2-concept", label: "Academy: Showcase photo 2 (sketch/concept)", type: "image", fallback: "/media-originals/academy-showcase-2-concept.webp" },
  { key: "academy.showcase.image3", file: "academy-showcase-3-final-look", label: "Academy: Showcase photo 3 (final look)", type: "image", fallback: "/media-originals/academy-showcase-3-final-look.webp" },
  { key: "academy.facilities.image", file: "academy-facilities", label: "Academy: Facilities/lab photo", type: "image", fallback: "/media-originals/academy-facilities.webp" },
];

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .get("/settings/content")
      .then((res) => {
        const saved = res.data.data;
        const initial: Record<string, string> = {};
        FIELD_GROUPS.forEach((group) => {
          group.fields.forEach((field) => {
            initial[field.key] = saved[field.key] ?? field.fallback;
          });
        });
        MEDIA_FIELDS.forEach((field) => {
          initial[field.key] = saved[field.key] ?? field.fallback;
        });
        setValues(initial);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await adminApi.patch("/settings/content", values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Could not save content. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("media", file);
      const uploadRes = await adminApi.post("/settings/content/upload-media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = uploadRes.data.data.url;
      await adminApi.patch("/settings/content", { [key]: url });
      setValues((prev) => ({ ...prev, [key]: url }));
    } catch (err: any) {
      setUploadError(err.response?.data?.message || "Could not upload media. Please try again.");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleMediaDownload = async (field: MediaFieldConfig) => {
    const url = values[field.key];
    if (!url) return;
    const ext = url.split("?")[0].match(/\.([a-z0-9]+)$/i)?.[1] ?? (field.type === "video" ? "mp4" : "jpg");
    setDownloadingKey(field.key);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blobUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${field.file}.${ext}`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank", "noopener");
    } finally {
      setDownloadingKey(null);
    }
  };

  if (loading) {
    return <p className="px-8 py-10 text-sm text-brand-text/70">Loading content...</p>;
  }

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-brand-text">Site Content</h1>
      <p className="mt-1 text-sm text-brand-text/70">Edit the text and media shown across the site.</p>

      <div className="mt-8 max-w-2xl space-y-10">
        {FIELD_GROUPS.map((group) => (
          <div key={group.group}>
            <h2 className="text-xs uppercase tracking-[0.1em] text-brand-gold">{group.group}</h2>
            <div className="mt-4 space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-brand-text">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                      className="mt-1 w-full border border-brand-text/20 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="mt-1 w-full border border-brand-text/20 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {saved && (
          <p className="border border-brand-accent/40 bg-brand-accent/10 px-4 py-2.5 text-sm text-brand-text">
            Content saved and applied.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-cream transition hover:bg-brand-primary/90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Text Content"}
        </button>

        <div className="border-t border-brand-text/10 pt-10">
          <h2 className="text-xs uppercase tracking-[0.1em] text-brand-gold">Images & Video</h2>
          <p className="mt-2 text-xs text-brand-text/70">
            Uploading replaces the current file straight away. You don't need to save.
          </p>

          {uploadError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{uploadError}</p>}

          <div className="mt-5 space-y-6">
            {MEDIA_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center gap-4 border border-brand-text/10 p-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-brand-muted">
                  {field.type === "video" ? (
                    <video src={values[field.key]} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={values[field.key]} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm text-brand-text">{field.label}</p>
                    <button
                      type="button"
                      onClick={() => handleMediaDownload(field)}
                      disabled={!values[field.key] || downloadingKey === field.key}
                      className="shrink-0 text-xs text-brand-gold underline underline-offset-2 hover:text-brand-text disabled:opacity-60"
                    >
                      {downloadingKey === field.key ? "Downloading..." : "Download"}
                    </button>
                  </div>
                  <input
                    type="file"
                    accept={field.type === "video" ? "video/*" : "image/*"}
                    disabled={uploadingKey === field.key}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMediaUpload(field.key, file);
                    }}
                    className="mt-2 w-full text-xs"
                  />
                  {uploadingKey === field.key && (
                    <p className="mt-1 text-xs text-brand-gold">Uploading...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

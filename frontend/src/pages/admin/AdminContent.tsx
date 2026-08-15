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
  label: string;
  type: "image" | "video";
  fallback: string;
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    group: "Home Page",
    fields: [
      {
        key: "home.hero.tagline",
        label: "Hero tagline",
        fallback: "Haute couture and ready-to-wear for the contemporary African woman.",
      },
      { key: "home.hero.cta", label: "Hero button text", fallback: "Explore the Collection" },
      {
        key: "home.banner.rtw.subtitle",
        label: "Ready-to-Wear banner subtitle",
        fallback: "Effortless elegance for everyday wear.",
      },
      {
        key: "home.banner.bridals.subtitle",
        label: "Bridals banner subtitle",
        fallback: "Gowns that tell your story, on the day it matters most.",
      },
      {
        key: "home.banner.bespoke.subtitle",
        label: "Bespoke banner subtitle",
        fallback: "Tailored exclusively to your shape, taste, and occasion.",
      },
      {
        key: "home.banner.sales.subtitle",
        label: "Sales banner subtitle",
        fallback: "Limited pieces at final prices, while they last.",
      },
      {
        key: "home.cta.title",
        label: "Consultation CTA heading",
        fallback: "Something made just for you",
      },
      {
        key: "home.cta.subtitle",
        label: "Consultation CTA subtitle",
        fallback:
          "Book a one-on-one consultation with our team to design a piece as unique as you are.",
        multiline: true,
      },
    ],
  },
  {
    group: "Footer",
    fields: [
      {
        key: "footer.tagline",
        label: "Footer tagline",
        fallback:
          "Haute couture and ready-to-wear for the contemporary African woman. Made with love on Lagos Island.",
        multiline: true,
      },
    ],
  },
  {
    group: "Consultations Page",
    fields: [
      { key: "consultations.hero.title", label: "Hero heading", fallback: "Favy Consultation Services" },
      {
        key: "consultations.hero.subtitle",
        label: "Hero subtitle",
        fallback: "Elevate your style with a personalized Favy Atelier experience",
      },
      {
        key: "consultations.hero.body",
        label: "Hero body paragraph",
        fallback:
          "At Favy Atelier, we believe every garment should reflect your unique style and elegance. Our personalized consultations ensure your piece is meticulously crafted to perfection — whether for a special event or your wedding day.",
        multiline: true,
      },
    ],
  },
  {
    group: "Fashion Academy Page",
    fields: [
      { key: "academy.hero.title", label: "Hero heading", fallback: "Favy Fashion Academy" },
      {
        key: "academy.hero.subtitle",
        label: "Hero subtitle",
        fallback:
          "Learn the craft behind Favy Atelier. Our academy offers hands-on, small-group programs for aspiring designers, tailors, and fashion entrepreneurs — taught by the same team that builds our collections.",
        multiline: true,
      },
    ],
  },
];

const MEDIA_FIELDS: MediaFieldConfig[] = [
  {
    key: "home.hero.video",
    label: "Home hero background video",
    type: "video",
    fallback: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    key: "home.banner.rtw.image",
    label: "Home — Ready-to-Wear banner image",
    type: "image",
    fallback: "https://picsum.photos/seed/home-rtw/1200/1200",
  },
  {
    key: "home.banner.bridals.image",
    label: "Home — Bridals banner image",
    type: "image",
    fallback: "https://picsum.photos/seed/home-bridals/1200/1200",
  },
  {
    key: "home.banner.bespoke.image",
    label: "Home — Bespoke banner image",
    type: "image",
    fallback: "https://picsum.photos/seed/home-bespoke/1200/1200",
  },
  {
    key: "home.banner.sales.image",
    label: "Home — Sales banner image",
    type: "image",
    fallback: "https://picsum.photos/seed/home-sales/1200/1200",
  },
  {
    key: "consultations.hero.womanImage",
    label: "Consultations — Favy Woman photo",
    type: "image",
    fallback: "https://picsum.photos/seed/favy-woman/600/800",
  },
  {
    key: "consultations.hero.brideImage",
    label: "Consultations — Favy Bride photo",
    type: "image",
    fallback: "https://picsum.photos/seed/favy-bride/600/800",
  },
  {
    key: "consultations.bride.tallImage",
    label: "Consultations — Bride definition photo",
    type: "image",
    fallback: "https://picsum.photos/seed/favy-bride-tall/700/1100",
  },
  {
    key: "consultations.bridal.video",
    label: "Consultations — Bridal video",
    type: "video",
    fallback: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

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

  if (loading) {
    return <p className="px-8 py-10 text-sm text-[#2b2b26]/60">Loading content...</p>;
  }

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-[#2b2b26]">Site Content</h1>
      <p className="mt-1 text-sm text-[#2b2b26]/60">
        Edit the text and media shown across the site.
      </p>

      <div className="mt-8 max-w-2xl space-y-10">
        {FIELD_GROUPS.map((group) => (
          <div key={group.group}>
            <h2 className="text-xs uppercase tracking-[0.1em] text-[#c9a227]">{group.group}</h2>
            <div className="mt-4 space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-[#2b2b26]">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                      className="mt-1 w-full border border-[#2b2b26]/20 px-3 py-2 text-sm focus:border-[#c9a227] focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="mt-1 w-full border border-[#2b2b26]/20 px-3 py-2 text-sm focus:border-[#c9a227] focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {saved && (
          <p className="border border-[#c9a227]/40 bg-[#c9a227]/10 px-4 py-2.5 text-sm text-[#2b2b26]">
            Content saved and applied.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#3d4636] py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:bg-[#3d4636]/90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Text Content"}
        </button>

        <div className="border-t border-[#2b2b26]/10 pt-10">
          <h2 className="text-xs uppercase tracking-[0.1em] text-[#c9a227]">Images & Video</h2>
          <p className="mt-2 text-xs text-[#2b2b26]/60">
            Uploading replaces the current file immediately — no separate save needed.
          </p>

          {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}

          <div className="mt-5 space-y-6">
            {MEDIA_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center gap-4 border border-[#2b2b26]/10 p-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-[#e5e1d8]">
                  {field.type === "video" ? (
                    <video src={values[field.key]} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={values[field.key]} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#2b2b26]">{field.label}</p>
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
                    <p className="mt-1 text-xs text-[#c9a227]">Uploading...</p>
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

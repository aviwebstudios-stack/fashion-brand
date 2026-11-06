import { useEffect, useState } from "react";
import adminApi from "../../lib/adminApi";
import { applyTheme } from "../../lib/applyTheme";
import { HEADING_FONTS, BODY_FONTS } from "../../lib/themeFonts";

interface Theme {
  colors: { primary: string; accent: string; background: string; text: string };
  fonts: { heading: string; body: string };
}

export default function AdminTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi
      .get("/settings/theme")
      .then((res) => setTheme(res.data.data))
      .catch(() => setTheme(null))
      .finally(() => setLoading(false));
  }, []);

  const updateColor = (key: keyof Theme["colors"], value: string) => {
    if (!theme) return;
    setTheme({ ...theme, colors: { ...theme.colors, [key]: value } });
  };

  const updateFont = (key: keyof Theme["fonts"], value: string) => {
    if (!theme) return;
    setTheme({ ...theme, fonts: { ...theme.fonts, [key]: value } });
  };

  const handleSave = async () => {
    if (!theme) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminApi.patch("/settings/theme", theme);
      applyTheme(res.data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Could not save theme. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="px-8 py-10 text-sm text-brand-text/70">Loading theme...</p>;
  }

  if (!theme) {
    return <p className="px-8 py-10 text-sm text-red-600 dark:text-red-400">Could not load theme settings.</p>;
  }

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-brand-text">Site Theme</h1>
      <p className="mt-1 text-sm text-brand-text/70">
        Changes apply across the entire site immediately after saving. Primary and accent are used in light and dark mode. Dark mode uses its own background and text colours.
      </p>

      <div className="mt-8 max-w-lg space-y-8">
        <div>
          <h2 className="text-xs uppercase tracking-[0.1em] text-brand-text/70">Colors</h2>
          <div className="mt-4 space-y-4">
            {(
              [
                ["primary", "Primary (buttons, headers)"],
                ["accent", "Accent (highlights, links)"],
                ["background", "Background (light mode)"],
                ["text", "Text (light mode)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-brand-text">{label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.colors[key]}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="h-9 w-9 cursor-pointer border border-brand-text/20"
                  />
                  <input
                    type="text"
                    value={theme.colors[key]}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="w-24 border border-brand-text/20 px-2 py-1.5 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.1em] text-brand-text/70">Fonts</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-brand-text">Heading Font</label>
              <select
                value={theme.fonts.heading}
                onChange={(e) => updateFont("heading", e.target.value)}
                className="mt-1 w-full border border-brand-text/20 px-3 py-2 text-sm"
              >
                {HEADING_FONTS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-brand-text">Body Font</label>
              <select
                value={theme.fonts.body}
                onChange={(e) => updateFont("body", e.target.value)}
                className="mt-1 w-full border border-brand-text/20 px-3 py-2 text-sm"
              >
                {BODY_FONTS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {saved && (
          <p className="border border-brand-accent/40 bg-brand-accent/10 px-4 py-2.5 text-sm text-brand-text">
            Theme saved and applied.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-cream transition hover:bg-brand-primary/90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Theme"}
        </button>
      </div>
    </div>
  );
}
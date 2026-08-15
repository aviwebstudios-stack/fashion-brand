import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Settings, BarChart3, Megaphone } from "lucide-react";
import {
  getCookiePreferences,
  saveCookiePreferences,
  type CookiePreferences,
} from "../../components/marketing/CookieConsentBanner";

const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export default function CookiePreferencesPage() {
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getCookiePreferences();
    if (existing) setPrefs(existing);
  }, []);

  const toggle = (key: "functional" | "analytics" | "marketing") => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    saveCookiePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.15em] text-brand-accent">Legal</p>
      <h1 className="mt-2 font-heading text-3xl text-brand-text">Cookie Preferences</h1>
      <p className="mt-3 text-sm text-brand-text/70">
        Control how we use cookies on this site. Essential cookies stay on so the site works.
      </p>

      <div className="mt-10 space-y-4">
        <div className="border border-brand-text/10 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Shield size={18} className="mt-0.5 text-brand-accent" />
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-brand-text">
                  Essential Cookies
                  <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.05em] text-[#8a6d1a]">
                    Always Active
                  </span>
                </p>
                <p className="mt-1 text-sm text-brand-text/70">
                  Necessary for the site to function and cannot be disabled. Includes your login
                  session, cart contents, and CSRF protection.
                </p>
              </div>
            </div>
            <div className="mt-1 h-6 w-11 shrink-0 rounded-full bg-brand-text/20 opacity-60" />
          </div>
        </div>

        <div className="border border-brand-text/10 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Settings size={18} className="mt-0.5 text-brand-accent" />
              <div>
                <p className="text-sm font-medium text-brand-text">Functional Cookies</p>
                <p className="mt-1 text-sm text-brand-text/70">
                  Remember preferences like whether you've dismissed the newsletter popup.
                </p>
              </div>
            </div>
            <button
              onClick={() => toggle("functional")}
              className={`mt-1 h-6 w-11 shrink-0 rounded-full transition ${
                prefs.functional ? "bg-brand-accent" : "bg-brand-text/20"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition ${
                  prefs.functional ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border border-brand-text/10 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <BarChart3 size={18} className="mt-0.5 text-brand-accent" />
              <div>
                <p className="text-sm font-medium text-brand-text">Analytics Cookies</p>
                <p className="mt-1 text-sm text-brand-text/70">
                  Would help us understand how visitors use the site.{" "}
                  <em>Currently not active on this website.</em>
                </p>
              </div>
            </div>
            <button
              onClick={() => toggle("analytics")}
              className={`mt-1 h-6 w-11 shrink-0 rounded-full transition ${
                prefs.analytics ? "bg-brand-accent" : "bg-brand-text/20"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition ${
                  prefs.analytics ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border border-brand-text/10 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Megaphone size={18} className="mt-0.5 text-brand-accent" />
              <div>
                <p className="text-sm font-medium text-brand-text">Marketing Cookies</p>
                <p className="mt-1 text-sm text-brand-text/70">
                  Would be used to deliver relevant advertisements.{" "}
                  <em>Favy Atelier does not currently run advertising campaigns.</em>
                </p>
              </div>
            </div>
            <button
              onClick={() => toggle("marketing")}
              className={`mt-1 h-6 w-11 shrink-0 rounded-full transition ${
                prefs.marketing ? "bg-brand-accent" : "bg-brand-text/20"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition ${
                  prefs.marketing ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <p className="mt-6 border border-brand-accent/40 bg-brand-accent/10 px-4 py-2.5 text-sm text-brand-text">
          Preferences saved.
        </p>
      )}

      <button
        onClick={handleSave}
        className="mt-6 w-full bg-brand-accent py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-text transition hover:opacity-90"
      >
        Save Preferences
      </button>

      <p className="mt-6 text-center text-sm text-brand-text/60">
        For more information about how we use your data, please read our{" "}
        <Link to="/privacy-policy" className="text-brand-accent underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

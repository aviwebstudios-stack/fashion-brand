import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export interface CookiePreferences {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "fb_cookie_preferences";

export function getCookiePreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCookiePreferences(prefs: CookiePreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export default function CookieConsentBanner() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookiePreferences()) setVisible(true);
  }, []);

  const acceptAll = () => {
    saveCookiePreferences({ essential: true, functional: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const declineNonEssential = () => {
    saveCookiePreferences({ essential: true, functional: false, analytics: false, marketing: false });
    setVisible(false);
  };

  const openPreferences = () => {
    setVisible(false);
    navigate("/cookie-preferences");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] border-t border-brand-text/10 bg-brand-bg px-6 py-5 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl">🍪</span>
          <div>
            <p className="text-sm font-medium text-brand-text">We use cookies</p>
            <p className="mt-1 text-sm text-brand-text/70">
              We use cookies to improve your experience, remember your preferences, and ensure our
              website works correctly.{" "}
              <Link to="/privacy-policy" className="text-brand-accent underline">
                Read our Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            onClick={openPreferences}
            className="border border-brand-text/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
          >
            Cookie Preferences
          </button>
          <button
            onClick={declineNonEssential}
            className="border border-brand-text/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
          >
            Decline Non-Essential
          </button>
          <button
            onClick={acceptAll}
            className="bg-brand-accent px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

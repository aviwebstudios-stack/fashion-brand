import { useEffect, useState } from "react";
import { usePageMeta } from "../../lib/usePageMeta";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../lib/api";
import { usePanelStore } from "../../store/panelStore";

type Status = "verifying" | "success" | "failed";

export default function PaymentVerify() {
  usePageMeta({ title: "Payment", noindex: true });
  const [searchParams] = useSearchParams();
  const setCartCount = usePanelStore((s) => s.setCartCount);
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found.");
      return;
    }

    api
      .get(`/payments/verify/${reference}`)
      .then(() => {
        setStatus("success");
        setCartCount(0);
      })
      .catch((err) => {
        setStatus("failed");
        setMessage(err.response?.data?.message || "Payment verification failed.");
      });
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      {status === "verifying" && (
        <p className="text-sm text-brand-text/70">Verifying your payment...</p>
      )}

      {status === "success" && (
        <>
          <h1 className="font-heading text-2xl text-brand-text">Payment Successful</h1>
          <p className="mt-3 text-sm text-brand-text/70">
            Thank you. Your order is placed and we've emailed you a confirmation.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-brand-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-cream transition hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="font-heading text-2xl text-brand-text">Payment Verification Failed</h1>
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{message}</p>
          <Link to="/" className="mt-8 inline-block text-sm text-brand-gold hover:underline">
            Return to homepage
          </Link>
        </>
      )}
    </div>
  );
}
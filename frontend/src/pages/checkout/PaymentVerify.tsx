import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../lib/api";
import { usePanelStore } from "../../store/panelStore";

type Status = "verifying" | "success" | "failed";

export default function PaymentVerify() {
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
            Thank you — your order has been placed and a confirmation email is on its way.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-brand-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="font-heading text-2xl text-brand-text">Payment Verification Failed</h1>
          <p className="mt-3 text-sm text-red-600">{message}</p>
          <Link to="/" className="mt-8 inline-block text-sm text-brand-accent hover:underline">
            Return to homepage
          </Link>
        </>
      )}
    </div>
  );
}
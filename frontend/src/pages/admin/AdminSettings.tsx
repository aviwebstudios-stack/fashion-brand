import { useEffect, useState } from "react";
import adminApi from "../../lib/adminApi";

export default function AdminSettings() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [waitingForConfirm, setWaitingForConfirm] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = () => {
    adminApi
      .get("/settings/telegram/status")
      .then((res) => setConnected(res.data.data.connected))
      .catch(() => setConnected(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnect = async () => {
    setError("");
    try {
      const res = await adminApi.get("/settings/telegram/connect-link");
      window.open(res.data.data.url, "_blank");
      setWaitingForConfirm(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not generate connect link.");
    }
  };

  const handleCheckConnection = async () => {
    setChecking(true);
    setError("");
    try {
      const res = await adminApi.get("/settings/telegram/check-connection");
      if (res.data.data.connected) {
        setConnected(true);
        setWaitingForConfirm(false);
      } else {
        setError("Not confirmed yet. Make sure you sent the message in Telegram, then try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not check connection.");
    } finally {
      setChecking(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await adminApi.post("/settings/telegram/disconnect");
      setConnected(false);
      setWaitingForConfirm(false);
    } catch {
      setError("Could not disconnect. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl text-[#2b2b26]">Admin Settings</h1>

      <div className="mt-10 border border-[#2b2b26]/10 p-6">
        <h2 className="font-serif text-lg text-[#2b2b26]">Telegram Notifications</h2>
        <p className="mt-2 text-sm text-[#2b2b26]/70">
          Connect Telegram to receive instant notifications for new orders, bookings, contact
          messages, and academy inquiries.
        </p>

        {connected === null ? (
          <p className="mt-4 text-sm text-[#2b2b26]/60">Checking status...</p>
        ) : connected ? (
          <div className="mt-5 flex items-center justify-between border border-[#c9a227]/40 bg-[#c9a227]/10 px-4 py-3">
            <span className="text-sm font-medium text-[#2b2b26]">✅ Connected</span>
            <button
              onClick={handleDisconnect}
              className="text-xs text-red-600 underline hover:no-underline"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}

            {!waitingForConfirm ? (
              <button
                onClick={handleConnect}
                className="w-full bg-[#3d4636] py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:bg-[#3d4636]/90"
              >
                Connect Telegram
              </button>
            ) : (
              <>
                <p className="text-sm text-[#2b2b26]/70">
                  A Telegram tab should have opened — send the pre-filled message to the bot,
                  then click below.
                </p>
                <button
                  onClick={handleCheckConnection}
                  disabled={checking}
                  className="w-full bg-[#3d4636] py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:bg-[#3d4636]/90 disabled:opacity-60"
                >
                  {checking ? "Checking..." : "I've messaged the bot — check now"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
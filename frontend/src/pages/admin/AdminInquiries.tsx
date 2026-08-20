import { useEffect, useState } from "react";
import adminApi from "../../lib/adminApi";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface AcademyInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  program: string;
  createdAt: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  interests: string[];
  subscribed: boolean;
  createdAt: string;
}

type Tab = "contact" | "academy" | "newsletter";

export default function AdminInquiries() {
  const [tab, setTab] = useState<Tab>("contact");
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [academyInquiries, setAcademyInquiries] = useState<AcademyInquiry[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.get("/inquiries/admin/contact"),
      adminApi.get("/inquiries/admin/academy"),
      adminApi.get("/inquiries/admin/newsletter"),
    ])
      .then(([contactRes, academyRes, newsletterRes]) => {
        setContactMessages(contactRes.data.data);
        setAcademyInquiries(academyRes.data.data);
        setSubscribers(newsletterRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "contact", label: "Contact Messages", count: contactMessages.length },
    { key: "academy", label: "Academy Interest", count: academyInquiries.length },
    { key: "newsletter", label: "Newsletter Subscribers", count: subscribers.filter((s) => s.subscribed).length },
  ];

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-[#2b2b26]">Inquiries</h1>

      <div className="mt-6 flex gap-2 border-b border-[#2b2b26]/10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`border-b-2 px-4 py-2.5 text-sm transition ${
              tab === t.key ? "border-[#3d4636] text-[#2b2b26]" : "border-transparent text-[#2b2b26]/50"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-[#2b2b26]/60">Loading...</p>
      ) : (
        <div className="mt-6">
          {tab === "contact" && (
            contactMessages.length === 0 ? (
              <p className="text-sm text-[#2b2b26]/60">No contact messages yet.</p>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((m) => (
                  <div key={m.id} className="border border-[#2b2b26]/10 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#2b2b26]">{m.name}</p>
                      <p className="text-xs text-[#2b2b26]/50">{new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="mt-1 text-xs text-[#2b2b26]/60">{m.email}</p>
                    <p className="mt-3 text-sm text-[#2b2b26]/80">{m.message}</p>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "academy" && (
            academyInquiries.length === 0 ? (
              <p className="text-sm text-[#2b2b26]/60">No academy inquiries yet.</p>
            ) : (
              <div className="overflow-x-auto border border-[#2b2b26]/10 bg-white">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b border-[#2b2b26]/10 text-left text-xs uppercase tracking-[0.05em] text-[#2b2b26]/60">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Program</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academyInquiries.map((a) => (
                      <tr key={a.id} className="border-b border-[#2b2b26]/10">
                        <td className="px-4 py-3 text-[#2b2b26]">{a.name}</td>
                        <td className="px-4 py-3 text-[#2b2b26]/70">{a.email}</td>
                        <td className="px-4 py-3 text-[#2b2b26]/70">{a.phone || "—"}</td>
                        <td className="px-4 py-3 text-[#2b2b26]/70">{a.program}</td>
                        <td className="px-4 py-3 text-xs text-[#2b2b26]/60">{new Date(a.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {tab === "newsletter" && (
            subscribers.length === 0 ? (
              <p className="text-sm text-[#2b2b26]/60">No newsletter subscribers yet.</p>
            ) : (
              <div className="overflow-x-auto border border-[#2b2b26]/10 bg-white">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b border-[#2b2b26]/10 text-left text-xs uppercase tracking-[0.05em] text-[#2b2b26]/60">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Interests</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-b border-[#2b2b26]/10">
                        <td className="px-4 py-3 text-[#2b2b26]">
                          {s.firstName ? `${s.firstName} ${s.lastName || ""}`.trim() : "—"}
                        </td>
                        <td className="px-4 py-3 text-[#2b2b26]/70">{s.email}</td>
                        <td className="px-4 py-3 text-[#2b2b26]/70">
                          {s.interests?.length ? s.interests.join(", ") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs ${
                            s.subscribed ? "bg-[#c9a227]/15 text-[#8a6d1a]" : "bg-gray-100 text-gray-600"
                          }`}>
                            {s.subscribed ? "Subscribed" : "Unsubscribed"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#2b2b26]/60">{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

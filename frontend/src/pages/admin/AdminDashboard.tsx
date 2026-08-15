import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import adminApi from "../../lib/adminApi";
import { formatNaira } from "../../lib/format";

interface DashboardData {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalBookings: number;
    totalProducts: number;
    pendingOrders: number;
    pendingBookings: number;
    totalRevenue: number;
  };
  lowStockProducts: { id: string; name: string; stock: number }[];
  recentOrders: {
    id: string;
    total: number;
    status: string;
    user: { name: string; email: string };
  }[];
  recentBookings: {
    id: string;
    total: number;
    status: string;
    user: { name: string; email: string };
    service: { name: string };
  }[];
}

interface RevenuePoint {
  month: string;
  revenue: number;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[#2b2b26]/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl text-[#2b2b26]">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.get("/admin/dashboard"), adminApi.get("/admin/revenue")])
      .then(([dashRes, revRes]) => {
        setData(dashRes.data.data);
        setRevenue(revRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="px-8 py-10 text-sm text-[#2b2b26]/60">
        Loading dashboard...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="px-8 py-10 text-sm text-red-600">
        Could not load dashboard data.
      </p>
    );
  }

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-[#2b2b26]">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatNaira(data.stats.totalRevenue)}
        />
        <StatCard label="Total Orders" value={data.stats.totalOrders} />
        <StatCard label="Total Bookings" value={data.stats.totalBookings} />
        <StatCard label="Total Products" value={data.stats.totalProducts} />
        <StatCard label="Total Customers" value={data.stats.totalUsers} />
        <StatCard label="Pending Orders" value={data.stats.pendingOrders} />
        <StatCard label="Pending Bookings" value={data.stats.pendingBookings} />
        <StatCard
          label="Low Stock Items"
          value={data.lowStockProducts.length}
        />
      </div>

      {revenue.length > 0 && (
        <div className="mt-8 border border-[#2b2b26]/10 bg-white p-5">
          <h2 className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">
            Revenue by Month
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#2b2b26" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#2b2b26" }} />
                <Tooltip
                  formatter={(value: any) => formatNaira(Number(value))}
                />{" "}
                <Bar dataKey="revenue" fill="#3d4636" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {data.lowStockProducts.length > 0 && (
          <div className="border border-[#2b2b26]/10 bg-white p-5">
            <h2 className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">
              Low Stock Alert
            </h2>
            <ul className="mt-3 divide-y divide-[#2b2b26]/10">
              {data.lowStockProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <Link
                    to="/admin/products"
                    className="text-[#2b2b26] hover:underline"
                  >
                    {p.name}
                  </Link>
                  <span className="text-red-600">{p.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border border-[#2b2b26]/10 bg-white p-5">
          <h2 className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">
            Recent Orders
          </h2>
          <ul className="mt-3 divide-y divide-[#2b2b26]/10">
            {data.recentOrders.map((o) => (
              <li key={o.id} className="py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#2b2b26]">{o.user.name}</span>
                  <span className="text-[#2b2b26]/70">
                    {formatNaira(o.total)}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-[0.05em] text-[#c9a227]">
                  {o.status}
                </span>
              </li>
            ))}
            {data.recentOrders.length === 0 && (
              <p className="py-2 text-sm text-[#2b2b26]/60">No orders yet.</p>
            )}
          </ul>
        </div>

        <div className="border border-[#2b2b26]/10 bg-white p-5 lg:col-span-2">
          <h2 className="text-xs uppercase tracking-[0.1em] text-[#2b2b26]/60">
            Recent Bookings
          </h2>
          <ul className="mt-3 divide-y divide-[#2b2b26]/10">
            {data.recentBookings.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div>
                  <span className="text-[#2b2b26]">{b.user.name}</span>
                  <span className="ml-2 text-[#2b2b26]/60">
                    {b.service.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#2b2b26]/70">
                    {formatNaira(b.total)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.05em] text-[#c9a227]">
                    {b.status}
                  </span>
                </div>
              </li>
            ))}
            {data.recentBookings.length === 0 && (
              <p className="py-2 text-sm text-[#2b2b26]/60">No bookings yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import adminApi from "../../lib/adminApi";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    adminApi
      .get("/users")
      .then((res) => setUsers(res.data.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspend = async (user: User) => {
    if (!confirm(`Suspend ${user.name}? They won't be able to log in until reactivated.`)) return;
    setBusyId(user.id);
    try {
      await adminApi.patch(`/users/${user.id}/suspend`);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: false } : u)));
    } catch {
      alert("Could not suspend user.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (user: User) => {
    setBusyId(user.id);
    try {
      await adminApi.patch(`/users/${user.id}/reactivate`);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: true } : u)));
    } catch {
      alert("Could not reactivate user.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return;
    setBusyId(user.id);
    try {
      await adminApi.delete(`/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      alert("Could not delete user.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-[#2b2b26]">Users</h1>

      {loading ? (
        <p className="mt-8 text-sm text-[#2b2b26]/60">Loading...</p>
      ) : users.length === 0 ? (
        <p className="mt-8 text-sm text-[#2b2b26]/60">No users found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-[#2b2b26]/10 bg-white">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[#2b2b26]/10 text-left text-xs uppercase tracking-[0.05em] text-[#2b2b26]/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#2b2b26]/10">
                  <td className="px-4 py-3 text-[#2b2b26]">{user.name}</td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">{user.email}</td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">{user.phone || "—"}</td>
                  <td className="px-4 py-3 text-[#2b2b26]/70">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        user.isActive
                          ? "bg-[#c9a227]/15 text-[#8a6d1a]"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Suspended"}
                    </span>
                    {!user.isVerified && (
                      <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#2b2b26]/60">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <button
                        onClick={() => handleSuspend(user)}
                        disabled={busyId === user.id}
                        className="mr-3 text-xs text-[#c9a227] underline disabled:opacity-50"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(user)}
                        disabled={busyId === user.id}
                        className="mr-3 text-xs text-[#c9a227] underline disabled:opacity-50"
                      >
                        Reactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={busyId === user.id}
                      className="text-xs text-red-600 underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

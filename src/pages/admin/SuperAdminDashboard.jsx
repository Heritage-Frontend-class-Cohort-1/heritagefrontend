import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  deepNavy: "#0D2B52",
  gold: "#C9A96E",
  goldLight: "#FEF9EE",
};

const BASE_URL = "https://backend-heritage-7.onrender.com/api/users";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17l2-7 4 4 3-8 3 8 4-4 2 7H3z" />
  </svg>
);
const BanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);
const UnlockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 018 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const formatDateTime = (date) =>
  date ? new Date(date).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const getInitials = (name) =>
  name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

const activityLabel = (log) => {
  if (log.type === "attendance") return `Marked attendance — ${log.serviceType}`;
  if (log.type === "member_created") return `Added member — ${log.memberName} (${log.category})`;
  if (log.type === "member_edited") return `Edited member — ${log.memberName}`;
  return "Unknown activity";
};

const activityColor = (type) => {
  if (type === "attendance") return { bg: "#EFF6FF", text: "#1D4ED8", label: "Attendance" };
  if (type === "member_created") return { bg: "#F0FDF4", text: "#15803D", label: "Member Added" };
  if (type === "member_edited") return { bg: "#FEF9EE", text: "#92400E", label: "Member Edited" };
  return { bg: "#F3F4F6", text: "#6B7280", label: "Activity" };
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium"
      style={{ backgroundColor: type === "success" ? "#16a34a" : "#dc2626", animation: "slideUp 0.3s ease-out" }}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
};

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ title, description, confirmLabel, confirmColor, onConfirm, onCancel, loading, emoji }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onCancel}>
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
      <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl"
        style={{ backgroundColor: confirmColor === "#16a34a" ? "#f0fdf4" : confirmColor === "#dc2626" ? "#fef2f2" : "#FEF9EE" }}>
        {emoji}
      </div>
      <h3 className="text-xl font-bold text-center mb-2" style={{ color: colors.deepNavy }}>{title}</h3>
      <p className="text-gray-500 text-sm text-center mb-6">{description}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-lg font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button
          onClick={onConfirm} disabled={loading}
          className="flex-1 py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2"
          style={{ backgroundColor: confirmColor, opacity: loading ? 0.7 : 1 }}
        >
          {loading && <span className="w-4 h-4 rounded-full animate-spin" style={{ border: "2px solid white", borderTopColor: "transparent" }} />}
          {loading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl p-5 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ emoji, title, subtitle }) => (
  <div className="text-center py-16">
    <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: colors.goldLight }}>
      {emoji}
    </div>
    <h3 className="text-lg font-semibold mb-1" style={{ color: colors.deepNavy }}>{title}</h3>
    <p className="text-gray-400 text-sm">{subtitle}</p>
  </div>
);

// ─── TAB 1: Pending Admins ────────────────────────────────────────────────────
const PendingTab = ({ token, onToast }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await window.fetch(`${BASE_URL}/pending-admins`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to load"); return; }
      setAdmins(Array.isArray(data) ? data : data.admins || []);
    } catch { setError("Could not connect to the server."); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAction = async () => {
    if (!confirm) return;
    const { admin, action } = confirm;
    setActionLoading(true);
    try {
      const res = await window.fetch(`${BASE_URL}/${admin._id}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { onToast(data.message || "Action failed", "error"); return; }
      setAdmins((prev) => prev.filter((a) => a._id !== admin._id));
      onToast(action === "approve" ? `${admin.name} has been approved!` : `${admin.name} has been rejected and deleted.`, "success");
    } catch { onToast("Failed to connect to the server.", "error"); }
    finally { setActionLoading(false); setConfirm(null); }
  };

  return (
    <>
      {confirm && (
        <ConfirmModal
          title={confirm.action === "approve" ? "Approve Admin?" : "Reject Admin?"}
          description={confirm.action === "approve"
            ? `Approve ${confirm.admin.name}? They will gain full admin access.`
            : `Reject ${confirm.admin.name}? Their account will be permanently deleted.`}
          confirmLabel={confirm.action === "approve" ? "Yes, Approve" : "Yes, Reject"}
          confirmColor={confirm.action === "approve" ? "#16a34a" : "#dc2626"}
          emoji={confirm.action === "approve" ? "✅" : "🗑️"}
          onConfirm={handleAction}
          onCancel={() => setConfirm(null)}
          loading={actionLoading}
        />
      )}

      <div className="flex justify-end mb-4">
        <button onClick={fetch} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition hover:bg-white"
          style={{ borderColor: "#e5e7eb", color: colors.deepNavy }}>
          <span className={loading ? "animate-spin" : ""}><RefreshIcon /></span>
          Refresh
        </button>
      </div>

      {loading && <Skeleton />}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={fetch} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: colors.deepNavy }}>Try Again</button>
        </div>
      )}
      {!loading && !error && admins.length === 0 && <EmptyState emoji="🎉" title="All caught up!" subtitle="No pending admin approvals at the moment." />}
      {!loading && !error && admins.length > 0 && (
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: colors.deepNavy }}>
                {getInitials(admin.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{admin.name}</p>
                <p className="text-sm text-gray-400 truncate">{admin.email}</p>
                <p className="text-xs text-gray-300 mt-0.5">Requested: {formatDate(admin.createdAt)}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                Pending
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setConfirm({ admin, action: "approve" })} title="Approve"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition" style={{ backgroundColor: "#16a34a" }}>
                  <CheckIcon />
                </button>
                <button onClick={() => setConfirm({ admin, action: "reject" })} title="Reject"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition" style={{ backgroundColor: "#dc2626" }}>
                  <XIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// ─── TAB 2: Active Admins ─────────────────────────────────────────────────────
const ActiveAdminsTab = ({ token, onToast }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await window.fetch(`${BASE_URL}/active-admins`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to load"); return; }
      setAdmins(Array.isArray(data) ? data : data.admins || []);
    } catch { setError("Could not connect to the server."); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleAction = async () => {
    if (!confirm) return;
    const { admin, action } = confirm;
    setActionLoading(true);
    try {
      const res = await window.fetch(`${BASE_URL}/${admin._id}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { onToast(data.message || "Action failed", "error"); return; }
      // Update local state
      if (action === "deactivate") {
        setAdmins((prev) => prev.map((a) => a._id === admin._id ? { ...a, status: "suspended" } : a));
        onToast(`${admin.name} has been suspended.`, "success");
      } else {
        setAdmins((prev) => prev.map((a) => a._id === admin._id ? { ...a, status: "active" } : a));
        onToast(`${admin.name} has been reactivated.`, "success");
      }
    } catch { onToast("Failed to connect to the server.", "error"); }
    finally { setActionLoading(false); setConfirm(null); }
  };

  return (
    <>
      {confirm && (
        <ConfirmModal
          title={confirm.action === "deactivate" ? "Suspend Admin?" : "Reactivate Admin?"}
          description={confirm.action === "deactivate"
            ? `Suspend ${confirm.admin.name}? They will not be able to log in until reactivated.`
            : `Reactivate ${confirm.admin.name}? They will be able to log in again.`}
          confirmLabel={confirm.action === "deactivate" ? "Yes, Suspend" : "Yes, Reactivate"}
          confirmColor={confirm.action === "deactivate" ? "#dc2626" : "#16a34a"}
          emoji={confirm.action === "deactivate" ? "🚫" : "✅"}
          onConfirm={handleAction}
          onCancel={() => setConfirm(null)}
          loading={actionLoading}
        />
      )}

      <div className="flex justify-end mb-4">
        <button onClick={fetchAdmins} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition hover:bg-white"
          style={{ borderColor: "#e5e7eb", color: colors.deepNavy }}>
          <span className={loading ? "animate-spin" : ""}><RefreshIcon /></span>
          Refresh
        </button>
      </div>

      {loading && <Skeleton />}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={fetchAdmins} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: colors.deepNavy }}>Try Again</button>
        </div>
      )}
      {!loading && !error && admins.length === 0 && <EmptyState emoji="👥" title="No active admins yet" subtitle="Approved admins will appear here." />}
      {!loading && !error && admins.length > 0 && (
        <div className="space-y-3">
          {admins.map((admin) => {
            const isSuspended = admin.status === "suspended";
            return (
              <div key={admin._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: isSuspended ? "#9CA3AF" : colors.deepNavy }}>
                  {getInitials(admin.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{admin.name}</p>
                  <p className="text-sm text-gray-400 truncate">{admin.email}</p>
                  <p className="text-xs text-gray-300 mt-0.5">Approved: {formatDate(admin.createdAt)}</p>
                </div>
                {/* Status pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: isSuspended ? "#FEF2F2" : "#F0FDF4", color: isSuspended ? "#DC2626" : "#15803D" }}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${isSuspended ? "bg-red-500" : "bg-green-500"}`} />
                  {isSuspended ? "Suspended" : "Active"}
                </div>
                {/* Action button */}
                <div className="flex-shrink-0">
                  {isSuspended ? (
                    <button onClick={() => setConfirm({ admin, action: "reactivate" })} title="Reactivate"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition"
                      style={{ backgroundColor: "#16a34a" }}>
                      <UnlockIcon /> Reactivate
                    </button>
                  ) : (
                    <button onClick={() => setConfirm({ admin, action: "deactivate" })} title="Suspend"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition"
                      style={{ backgroundColor: "#dc2626" }}>
                      <BanIcon /> Suspend
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

// ─── TAB 3: Activity Log ──────────────────────────────────────────────────────
const ActivityLogTab = ({ token }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchLogs = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await window.fetch(`${BASE_URL}/activity-log`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to load"); return; }
      setLogs(data.logs || []);
    } catch { setError("Could not connect to the server."); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "attendance", label: "Attendance" },
            { key: "member_created", label: "Members Added" },
            { key: "member_edited", label: "Members Edited" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              style={{
                backgroundColor: filter === f.key ? colors.deepNavy : "#F3F4F6",
                color: filter === f.key ? "white" : "#6B7280",
              }}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={fetchLogs} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition hover:bg-white"
          style={{ borderColor: "#e5e7eb", color: colors.deepNavy }}>
          <span className={loading ? "animate-spin" : ""}><RefreshIcon /></span>
          Refresh
        </button>
      </div>

      {loading && <Skeleton />}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load activity log</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={fetchLogs} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: colors.deepNavy }}>Try Again</button>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState emoji="📋" title="No activity yet" subtitle="Activity will appear here once admins start using the system." />
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((log, i) => {
            const { bg, text, label } = activityColor(log.type);
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
                {/* Admin avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: colors.deepNavy }}>
                  {getInitials(log.adminName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-gray-800 text-sm">{log.adminName}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: bg, color: text }}>{label}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{activityLabel(log)}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{formatDateTime(log.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const superAdminName = localStorage.getItem("superAdminName") || "Super Admin";
  const token = localStorage.getItem("superAdminToken");

  useEffect(() => {
    if (!token) navigate("/superadmin/login");
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdminName");
    localStorage.removeItem("superAdminEmail");
    navigate("/superadmin/login");
  };

  const tabs = [
    { key: "pending",  label: "Pending Approvals" },
    { key: "active",   label: "Active Admins" },
    { key: "activity", label: "Activity Log" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F7F4" }}>
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 shadow-sm" style={{ backgroundColor: colors.deepNavy }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.gold, color: colors.deepNavy }}>
              <CrownIcon />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Heritage Church</p>
              <p className="text-xs leading-tight" style={{ color: colors.gold }}>Super Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm hidden sm:block">
              Welcome, <span className="text-white font-medium">{superAdminName}</span>
            </span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-white/60 hover:text-white transition text-sm">
              <LogoutIcon />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Tab Bar ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 sm:px-6 py-4 text-sm font-semibold transition border-b-2 whitespace-nowrap"
                style={{
                  borderColor: activeTab === tab.key ? colors.deepNavy : "transparent",
                  color: activeTab === tab.key ? colors.deepNavy : "#9CA3AF",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: colors.deepNavy }}>
            {tabs.find((t) => t.key === activeTab)?.label}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {activeTab === "pending"  && "Review and manage admin access requests"}
            {activeTab === "active"   && "View and manage all approved admins"}
            {activeTab === "activity" && "See what each admin has been doing"}
          </p>
        </div>

        {activeTab === "pending"  && <PendingTab token={token} onToast={(msg, type) => setToast({ message: msg, type })} />}
        {activeTab === "active"   && <ActiveAdminsTab token={token} onToast={(msg, type) => setToast({ message: msg, type })} />}
        {activeTab === "activity" && <ActivityLogTab token={token} />}
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;
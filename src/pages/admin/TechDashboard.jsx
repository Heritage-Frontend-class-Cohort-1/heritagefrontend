// pages/admin/TechCohortDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Clock, CheckCircle, XCircle, Search, ChevronRight, Laptop, Laptop2
} from "lucide-react";

const API_BASE = "https://backend-heritage-7.onrender.com/api/tech-applications";

const statusColors = {
  pending:  { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  reviewed: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  accepted: { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
  rejected: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
};

const TechCohortDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  // FIX: login stores the token under "adminToken", not "token"
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let result = applications;
    if (activeFilter !== "all") {
      result = result.filter((a) => a.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.parish.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [applications, activeFilter, search]);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    // FIX: bail early with a clear message if there's no token,
    // instead of silently sending "Bearer null" to the API
    if (!token) {
      setError("You are not logged in. Please log in again.");
      setLoading(false);
      navigate("/admin/login"); // adjust to your actual login route
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // FIX: handle expired/invalid token explicitly so the user
      // gets sent back to login instead of seeing a blank dashboard
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminEmail");
        setError("Your session has expired. Please log in again.");
        navigate("/admin/login"); // adjust to your actual login route
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch applications");
      setApplications(data.applications);
      setFiltered(data.applications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filters = ["all", "pending", "reviewed", "accepted", "rejected"];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Trebuchet MS', sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0B1B3F 0%, #1E3A5F 100%)",
        padding: "36px 40px",
      }}>
        <p style={{ color: "#FCD34D", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
          Lords Heritage Tech Space
        </p>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0 }}>
          Cohort Applications Dashboard
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "14px", margin: "6px 0 0" }}>
          Review, manage and update applicant statuses
        </p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Applications", value: stats.total, icon: Users, bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
            { label: "Pending Review", value: stats.pending, icon: Clock, bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle, bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: "16px", padding: "24px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#FFFFFF", border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={s.color} />
                </div>
                <div>
                  <p style={{ color: s.color, fontSize: "28px", fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ color: "#64748B", fontSize: "13px", margin: "4px 0 0" }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search by name, email, phone, parish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                border: "1.5px solid #E2E8F0",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#0B1B3F",
                background: "#FFFFFF",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  border: "1.5px solid",
                  borderColor: activeFilter === f ? "#2563EB" : "#E2E8F0",
                  background: activeFilter === f ? "#2563EB" : "#FFFFFF",
                  color: activeFilter === f ? "#FFFFFF" : "#64748B",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "10px", padding: "12px 16px", color: "#B91C1C", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8", fontSize: "16px" }}>
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8", fontSize: "16px" }}>
            No applications found.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((app) => {
              const sc = statusColors[app.status] || statusColors.pending;
              return (
                <div
                  key={app._id}
                  onClick={() => navigate(`/Admin/cohort/${app._id}`)}
                  style={{
                    background: "#FFFFFF",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: "16px",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(11,27,63,0.10)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Photo */}
                  {app.photoUrl ? (
                    <img
                      src={app.photoUrl}
                      alt={app.fullName}
                      style={{ width: "52px", height: "52px", borderRadius: "12px", objectFit: "cover", border: "1.5px solid #E2E8F0", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "#EFF6FF", border: "1.5px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Users size={22} color="#2563EB" />
                    </div>
                  )}

                  {/* Main info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <p style={{ color: "#0B1B3F", fontSize: "16px", fontWeight: 700, margin: 0 }}>{app.fullName}</p>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: "100px", padding: "2px 10px", fontSize: "11px", fontWeight: 700, textTransform: "capitalize" }}>
                        {app.status}
                      </span>
                    </div>
                    <p style={{ color: "#64748B", fontSize: "13px", margin: "4px 0 0" }}>
                      {app.email} &nbsp;·&nbsp; {app.phone} &nbsp;·&nbsp; Age {app.age} &nbsp;·&nbsp; {app.parish}
                    </p>
                  </div>

                  {/* Laptop badge */}
                  <div style={{
                    background: app.hasLaptop === "yes" ? "#ECFDF5" : app.hasLaptop === "shared" ? "#FFF7ED" : "#FEF2F2",
                    color: app.hasLaptop === "yes" ? "#065F46" : app.hasLaptop === "shared" ? "#C2410C" : "#B91C1C",
                    border: `1px solid ${app.hasLaptop === "yes" ? "#A7F3D0" : app.hasLaptop === "shared" ? "#FED7AA" : "#FECACA"}`,
                    borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, flexShrink: 0,
                    display: "flex", alignItems: "center", gap: "5px"
                  }}>
                    <Laptop size={13} />
                    {app.hasLaptop === "yes" ? "Has laptop" : app.hasLaptop === "shared" ? "Shared" : "No laptop"}
                  </div>

                  {/* Date */}
                  <p style={{ color: "#94A3B8", fontSize: "12px", flexShrink: 0 }}>
                    {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>

                  <ChevronRight size={18} color="#CBD5E1" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechCohortDashboard;
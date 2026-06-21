// pages/admin/TechApplicantDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Phone, Mail, MapPin, Church, Laptop,
  Code, Calendar, CheckCircle, XCircle, Clock, Trash2, Save, AlertCircle
} from "lucide-react";

const API_BASE = "https://backend-heritage-7.onrender.com/api/tech-applications";

const statusOptions = [
  { value: "pending",  label: "Pending",  icon: Clock,         color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA" },
  { value: "reviewed", label: "Reviewed", icon: CheckCircle,   color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  { value: "accepted", label: "Accepted", icon: CheckCircle,   color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
  { value: "rejected", label: "Rejected", icon: XCircle,       color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA" },
];

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 0", borderBottom: "1px solid #F1F5F9" }}>
    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={16} color="#2563EB" />
    </div>
    <div>
      <p style={{ color: "#94A3B8", fontSize: "12px", fontFamily: "'Trebuchet MS', sans-serif", margin: 0 }}>{label}</p>
      <p style={{ color: "#0B1B3F", fontSize: "15px", fontWeight: 600, fontFamily: "'Trebuchet MS', sans-serif", margin: "2px 0 0" }}>{value || "—"}</p>
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "16px", padding: "24px 28px", marginBottom: "20px" }}>
    <p style={{ color: "#2563EB", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 800, fontFamily: "'Trebuchet MS', sans-serif", margin: "0 0 4px" }}>
      {title}
    </p>
    <div style={{ height: "1px", background: "#E2E8F0", marginBottom: "12px" }} />
    {children}
  </div>
);

const TechApplicantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // FIX: login stores the token under "adminToken", not "token"
  const token = localStorage.getItem("adminToken");

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  // FIX: shared helper to handle expired/invalid tokens consistently
  // across fetch, save, and delete
  const handleAuthFailure = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login"); // adjust to your actual login route
  };

  const fetchApplication = async () => {
    setLoading(true);
    setError("");

    // FIX: bail early instead of sending "Bearer null"
    if (!token) {
      setError("You are not logged in. Please log in again.");
      setLoading(false);
      handleAuthFailure();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        handleAuthFailure();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch application");
      setApp(data.application);
      setSelectedStatus(data.application.status);
      setAdminNote(data.application.adminNote || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`${API_BASE}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedStatus, adminNote }),
      });

      if (res.status === 401) {
        setSaveMsg("Your session has expired. Please log in again.");
        handleAuthFailure();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setApp(data.application);
      setSaveMsg("Changes saved successfully.");
    } catch (err) {
      setSaveMsg(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setSaveMsg("Your session has expired. Please log in again.");
        handleAuthFailure();
        return;
      }

      if (!res.ok) throw new Error("Failed to delete application.");
      navigate("/Admin/cohort");
    } catch (err) {
      setSaveMsg(err.message);
      setDeleting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontFamily: "'Trebuchet MS', sans-serif", fontSize: "16px" }}>
      Loading applicant...
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", color: "#B91C1C", fontFamily: "'Trebuchet MS', sans-serif", fontSize: "16px" }}>
      {error}
    </div>
  );

  const currentStatus = statusOptions.find((s) => s.value === app.status) || statusOptions[0];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Trebuchet MS', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0B1B3F 0%, #1E3A5F 100%)", padding: "28px 40px", display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          onClick={() => navigate("/Admin/cohort")}
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "8px 14px", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontFamily: "'Trebuchet MS', sans-serif" }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <p style={{ color: "#FCD34D", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, margin: 0 }}>Applicant Detail</p>
          <h1 style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 700, margin: "4px 0 0" }}>{app.fullName}</h1>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }} className="detail-grid">

        {/* LEFT — applicant info */}
        <div>

          {/* Photo + name card */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "16px", padding: "28px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
            {app.photoUrl ? (
              <img src={app.photoUrl} alt={app.fullName} style={{ width: "88px", height: "88px", borderRadius: "16px", objectFit: "cover", border: "2px solid #E2E8F0", flexShrink: 0 }} />
            ) : (
              <div style={{ width: "88px", height: "88px", borderRadius: "16px", background: "#EFF6FF", border: "2px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User size={36} color="#2563EB" />
              </div>
            )}
            <div>
              <h2 style={{ color: "#0B1B3F", fontSize: "22px", fontWeight: 700, margin: 0 }}>{app.fullName}</h2>
              <p style={{ color: "#64748B", fontSize: "14px", margin: "4px 0" }}>Age {app.age} &nbsp;·&nbsp; {app.gender === "male" ? "Male" : "Female"}</p>
              <span style={{
                background: currentStatus.bg, color: currentStatus.color,
                border: `1px solid ${currentStatus.border}`,
                borderRadius: "100px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, textTransform: "capitalize"
              }}>
                {app.status}
              </span>
            </div>
          </div>

          <SectionCard title="Contact Information">
            <InfoRow icon={Mail} label="Email" value={app.email} />
            <InfoRow icon={Phone} label="Phone" value={app.phone} />
            <InfoRow icon={User} label="Parent / Guardian" value={app.guardianName} />
            <InfoRow icon={Phone} label="Guardian Phone" value={app.guardianPhone} />
            <InfoRow icon={MapPin} label="Home Address" value={app.address} />
          </SectionCard>

          <SectionCard title="Church Information">
            <InfoRow icon={Church} label="Parish" value={app.parish} />
            <InfoRow icon={User} label="Membership Status" value={{
              member: "Member of this parish",
              "other-parish": "Member of another RCCG parish",
              "other-church": "Attends a different church",
              "not-attending": "Does not attend a church",
            }[app.membershipStatus] || app.membershipStatus} />
          </SectionCard>

          <SectionCard title="Program Readiness">
            <InfoRow icon={Laptop} label="Laptop Access" value={{
              yes: "Has own laptop",
              shared: "Shared / family laptop",
              no: "No laptop access",
            }[app.hasLaptop] || app.hasLaptop} />
            <InfoRow icon={Code} label="Prior Tech Knowledge" value={app.priorTechKnowledge || "None stated"} />
            <InfoRow icon={Calendar} label="Availability" value={app.availability} />
            <InfoRow icon={User} label="How They Heard" value={{
              flyer: "Flyer / poster",
              "church-announcement": "Church announcement",
              "friend-family": "Friend or family",
              "social-media": "Social media",
              "church-website": "Church website",
              other: "Other",
            }[app.howHeard] || app.howHeard} />
          </SectionCard>

          <SectionCard title="Applicant's Statement">
            <div style={{ marginBottom: "12px" }}>
              <p style={{ color: "#94A3B8", fontSize: "12px", margin: "0 0 4px" }}>Why they want to join</p>
              <p style={{ color: "#334155", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>{app.reason || "Not provided"}</p>
            </div>
            <div style={{ paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
              <p style={{ color: "#94A3B8", fontSize: "12px", margin: "0 0 4px" }}>Aim after the program</p>
              <p style={{ color: "#334155", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>{app.aim || "Not provided"}</p>
            </div>
          </SectionCard>

          {/* Consent */}
          <div style={{ background: app.consent ? "#ECFDF5" : "#FEF2F2", border: `1.5px solid ${app.consent ? "#A7F3D0" : "#FECACA"}`, borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
            {app.consent
              ? <CheckCircle size={18} color="#059669" />
              : <AlertCircle size={18} color="#DC2626" />}
            <p style={{ color: app.consent ? "#065F46" : "#B91C1C", fontSize: "14px", fontWeight: 600, margin: 0 }}>
              {app.consent ? "Applicant confirmed 3-month commitment" : "Commitment not confirmed"}
            </p>
          </div>

          <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "16px" }}>
            Applied on {new Date(app.createdAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* RIGHT — admin actions */}
        <div style={{ position: "sticky", top: "24px", alignSelf: "start" }}>

          {/* Status update */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
            <p style={{ color: "#0B1B3F", fontSize: "15px", fontWeight: 700, margin: "0 0 16px" }}>Update Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {statusOptions.map((s) => {
                const Icon = s.icon;
                const active = selectedStatus === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setSelectedStatus(s.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "12px 14px", borderRadius: "10px",
                      border: `1.5px solid ${active ? s.border : "#E2E8F0"}`,
                      background: active ? s.bg : "#F8FAFC",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <Icon size={15} color={active ? s.color : "#94A3B8"} />
                    <span style={{ color: active ? s.color : "#64748B", fontSize: "14px", fontWeight: active ? 700 : 500 }}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Admin note */}
            <p style={{ color: "#0B1B3F", fontSize: "14px", fontWeight: 700, margin: "0 0 8px" }}>Admin Note</p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note about this applicant (optional)"
              rows={4}
              style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "10px 12px", fontSize: "14px", color: "#334155", resize: "vertical", boxSizing: "border-box", fontFamily: "'Trebuchet MS', sans-serif" }}
            />

            {saveMsg && (
              <p style={{ fontSize: "13px", color: saveMsg.includes("success") ? "#065F46" : "#B91C1C", margin: "10px 0 0" }}>
                {saveMsg}
              </p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ width: "100%", marginTop: "14px", background: saving ? "#93C5FD" : "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "10px", padding: "13px", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "'Trebuchet MS', sans-serif" }}
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Delete */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid #FECACA", borderRadius: "16px", padding: "20px" }}>
            <p style={{ color: "#0B1B3F", fontSize: "14px", fontWeight: 700, margin: "0 0 6px" }}>Delete Application</p>
            <p style={{ color: "#94A3B8", fontSize: "13px", margin: "0 0 14px", lineHeight: 1.5 }}>This action is permanent and cannot be undone.</p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{ width: "100%", background: "#FEF2F2", color: "#B91C1C", border: "1.5px solid #FECACA", borderRadius: "10px", padding: "11px", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "'Trebuchet MS', sans-serif" }}
              >
                <Trash2 size={15} /> Delete
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ color: "#B91C1C", fontSize: "13px", fontWeight: 600, margin: 0 }}>Are you sure?</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ flex: 1, background: "#DC2626", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'Trebuchet MS', sans-serif" }}
                  >
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{ flex: 1, background: "#F1F5F9", color: "#475569", border: "none", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'Trebuchet MS', sans-serif" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default TechApplicantDetail;
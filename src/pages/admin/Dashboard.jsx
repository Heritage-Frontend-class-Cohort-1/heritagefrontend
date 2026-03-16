import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const colors = {
  deepNavy: "#0B1B3F",
  navy2: "#142A5A",
  gold: "#FFD700",
  gold2: "#FFC200",
  cream: "#FFF8ED",
  soft: "#F4F6FB",
};

const API_URL = import.meta.env.VITE_API_URL || "https://backend-heritage-10.onrender.com";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SERVICE_TYPES = ["Sunday Service","Tuesday Service","Thursday Service","Special Service"];

// ─────────────────────────────────────────
// ERROR 1 FIXED: These were outside the component — moved here as module-level constants
// ─────────────────────────────────────────
const daysSince = (date) => {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const STAGE_CONFIG = {
  none:         { label: "Not Started",  color: "#94a3b8", bg: "#f1f5f9", step: 0 },
  welcome_sent: { label: "Welcome Sent", color: "#2563EB", bg: "#EFF6FF", step: 1 },
  week1_sent:   { label: "Week 1 Done",  color: "#D97706", bg: "#FFFBEB", step: 2 },
  week2_sent:   { label: "Week 2 Done",  color: "#7C3AED", bg: "#F5F3FF", step: 3 },
  returned:     { label: "Returned ✅",  color: "#16A34A", bg: "#F0FDF4", step: 4 },
  converted:    { label: "Converted 🎉", color: "#15803D", bg: "#DCFCE7", step: 5 },
};

const PIPELINE_STEPS = [
  { key: "none",         label: "Added" },
  { key: "welcome_sent", label: "Welcome SMS" },
  { key: "week1_sent",   label: "Week 1" },
  { key: "week2_sent",   label: "Week 2" },
  { key: "returned",     label: "Returned" },
];

// ─────────────────────────────────────────
// ERROR 2 FIXED: btnStyle was defined inside JSX — moved here as a proper function
// ─────────────────────────────────────────
const btnStyle = (bg, color) => ({
  width: "100%", padding: "9px 0", borderRadius: 9,
  fontWeight: 700, fontSize: 13, border: "none",
  cursor: "pointer", background: bg, color,
  transition: "opacity 0.15s",
});

/* ─────────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────────── */
const Spinner = ({ size = 18, color = "#fff" }) => (
  <>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <div style={{
      width: size, height: size,
      border: `2.5px solid ${color}40`,
      borderTop: `2.5px solid ${color}`,
      borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  </>
);

const StatCard = ({ label, value, icon, accent }) => (
  <div style={{
    background: accent ? colors.deepNavy : "#fff",
    color: accent ? "#fff" : colors.deepNavy,
    borderRadius: 16, padding: "20px 24px",
    boxShadow: accent ? "0 8px 32px rgba(11,27,63,0.18)" : "0 2px 12px rgba(11,27,63,0.07)",
    display: "flex", alignItems: "center", gap: 16,
    border: accent ? "none" : "1.5px solid #e8eaf0", minWidth: 0,
  }}>
    <div style={{
      fontSize: 26, background: accent ? "rgba(255,215,0,0.15)" : colors.soft,
      borderRadius: 12, width: 50, height: 50,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, fontFamily: "'Georgia', serif" }}>{value}</div>
    </div>
  </div>
);

const SectionHeader = ({ title, count, subtitle }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.deepNavy, fontFamily: "'Georgia', serif", margin: 0 }}>{title}</h2>
      {count !== undefined && (
        <span style={{ background: colors.gold, color: colors.deepNavy, fontWeight: 800, fontSize: 13, borderRadius: 20, padding: "2px 12px" }}>{count}</span>
      )}
    </div>
    {subtitle && <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>{subtitle}</p>}
  </div>
);

const SearchInput = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", marginBottom: 20 }}>
    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder || "Search…"}
      style={{
        width: "100%", padding: "11px 14px 11px 40px",
        border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14,
        outline: "none", background: colors.soft, color: colors.deepNavy, boxSizing: "border-box",
      }}
      onFocus={e => e.target.style.borderColor = colors.deepNavy}
      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
    />
  </div>
);

const MemberAvatar = ({ member, size = 44 }) => (
  member?.imageUrl
    ? <img src={member.imageUrl} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${colors.gold}`, flexShrink: 0 }} />
    : <div style={{
        width: size, height: size, borderRadius: "50%",
        background: colors.deepNavy, color: colors.gold,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: size * 0.35, flexShrink: 0,
      }}>
        {member?.firstName?.[0]}{member?.lastName?.[0]}
      </div>
);

const CategoryBadge = ({ category }) => {
  const map = {
    "First Timer": { bg: "#FFF7E0", text: "#92400e", dot: "#F59E0B" },
    "New Convert": { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
    "Member":      { bg: "#EEF2FF", text: "#3730A3", dot: "#6366F1" },
  };
  const c = map[category] || map["Member"];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: c.bg, color: c.text, flexShrink: 0 }}>
      <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: c.dot, marginRight: 5, verticalAlign: "middle" }} />
      {category}
    </span>
  );
};

const MemberCard = ({ member, onSendSMS, sending }) => (
  <div
    style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1.5px solid #e8eaf0", boxShadow: "0 2px 8px rgba(11,27,63,0.05)", display: "flex", flexDirection: "column", gap: 10, transition: "box-shadow 0.2s, transform 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(11,27,63,0.13)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(11,27,63,0.05)"; e.currentTarget.style.transform = "none"; }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <MemberAvatar member={member} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: colors.deepNavy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {member.firstName} {member.lastName}
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
          {member.phone || <span style={{ color: "#ef4444" }}>⚠ No phone</span>}
        </div>
      </div>
      <CategoryBadge category={member.category} />
    </div>
    <button
      disabled={!member.phone || sending}
      onClick={() => onSendSMS(member)}
      style={{
        width: "100%", padding: "8px 0", borderRadius: 9, fontWeight: 700, fontSize: 13,
        border: "none", cursor: member.phone && !sending ? "pointer" : "not-allowed",
        background: member.phone && !sending ? colors.deepNavy : "#e2e8f0",
        color: member.phone && !sending ? colors.gold : "#94a3b8",
      }}
    >
      {sending ? "Sending…" : "📱 Send SMS"}
    </button>
  </div>
);

const ProgressBar = ({ value, max, color = colors.deepNavy, height = 8 }) => (
  <div style={{ background: "#e8eaf0", borderRadius: 99, height, overflow: "hidden" }}>
    <div style={{
      width: `${max > 0 ? Math.round((value / max) * 100) : 0}%`,
      background: color, height: "100%", borderRadius: 99,
      transition: "width 0.6s ease",
    }} />
  </div>
);

const LoadingScreen = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.soft }}>
    <div style={{ textAlign: "center" }}>
      <Spinner size={52} color={colors.deepNavy} />
      <p style={{ color: colors.deepNavy, fontWeight: 700, fontSize: 16, marginTop: 16 }}>Loading dashboard…</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   FIRST TIMER CARD
───────────────────────────────────────── */
// ERROR 3 FIXED: FirstTimerCard was defined inside JSX render — moved here as a proper component
const FirstTimerCard = ({ member, onAction, actionLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState(member.followUpNotes || "");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [smsMsg, setSmsMsg] = useState("");
  const [showSmsInput, setShowSmsInput] = useState(null);

  const days      = daysSince(member.firstVisitDate || member.createdAt);
  const stage     = STAGE_CONFIG[member.followUpStage] || STAGE_CONFIG.none;
  const step      = stage.step;
  const urgency   = days === null ? "#94a3b8" : days >= 14 ? "#DC2626" : days >= 7 ? "#D97706" : "#16A34A";
  const isConverted = member.followUpStage === "converted";
  const isReturned  = member.returnedToChurch || member.followUpStage === "returned";

  const handleSendSMS = async (stageKey) => {
    const msg = smsMsg.trim();
    if (!msg) return;
    await onAction(member._id, "sms", { stage: stageKey, message: msg, note: `${stageKey} SMS sent` });
    setSmsMsg("");
    setShowSmsInput(null);
  };

  const handleNote = async () => {
    if (!noteText.trim()) return;
    await onAction(member._id, "note", { note: noteText });
    setShowNoteInput(false);
  };

  return (
    <div
      style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${isConverted ? "#86EFAC" : isReturned ? "#93C5FD" : "#e8eaf0"}`, boxShadow: "0 2px 10px rgba(11,27,63,0.06)", overflow: "hidden", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(11,27,63,0.12)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(11,27,63,0.06)"}
    >
      {/* Top: avatar + info + stage badge */}
      <div style={{ padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <MemberAvatar member={member} size={48} />
          {days !== null && (
            <div style={{ position: "absolute", bottom: -4, right: -4, background: urgency, color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 99, padding: "1px 5px", border: "2px solid #fff", whiteSpace: "nowrap" }}>
              {days}d
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: colors.deepNavy }}>{member.firstName} {member.lastName}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{member.phone || <span style={{ color: "#ef4444" }}>⚠ No phone</span>}</div>
          {member.firstVisitDate && (
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
              First visit: {new Date(member.firstVisitDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: stage.bg, color: stage.color, flexShrink: 0, alignSelf: "flex-start" }}>
          {stage.label}
        </span>
      </div>

      {/* Pipeline progress */}
      <div style={{ padding: "0 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {PIPELINE_STEPS.map((s, i) => {
            const done    = step > i;
            const current = step === i;
            const isLast  = i === PIPELINE_STEPS.length - 1;
            return (
              <div key={s.key} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: done ? colors.deepNavy : current ? stage.bg : "#f1f5f9", color: done ? colors.gold : current ? stage.color : "#94a3b8", border: current ? `2px solid ${stage.color}` : "2px solid transparent", transition: "all 0.3s" }}>
                  {done ? "✓" : i + 1}
                </div>
                {!isLast && <div style={{ flex: 1, height: 3, background: done ? colors.deepNavy : "#e8eaf0", transition: "background 0.3s" }} />}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {PIPELINE_STEPS.map((s, i) => (
            <div key={s.key} style={{ fontSize: 9, fontWeight: 600, color: step >= i ? colors.deepNavy : "#94a3b8", textAlign: "center", flex: i < PIPELINE_STEPS.length - 1 ? 1 : 0 }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Urgency banner */}
      {!isConverted && !isReturned && days !== null && (
        <div style={{ margin: "0 18px 12px", padding: "7px 12px", borderRadius: 8, background: days >= 14 ? "#FEF2F2" : days >= 7 ? "#FFFBEB" : "#F0FDF4", borderLeft: `3px solid ${urgency}`, fontSize: 12, fontWeight: 600, color: days >= 14 ? "#B91C1C" : days >= 7 ? "#92400E" : "#15803D" }}>
          {days >= 14 ? `⚠️ ${days} days since first visit — follow-up overdue!` : days >= 7 ? `⏰ ${days} days since first visit — follow-up due this week` : `✅ ${days} days since first visit — on track`}
        </div>
      )}

      {/* Notes preview */}
      {member.followUpNotes && (
        <div style={{ margin: "0 18px 12px", padding: "8px 12px", background: "#f8fafc", borderRadius: 8, fontSize: 12, color: "#475569", fontStyle: "italic" }}>
          💬 {member.followUpNotes}
        </div>
      )}

      {/* Action buttons */}
      {!isConverted && (
        <div style={{ padding: "0 18px 16px", display: "flex", flexDirection: "column", gap: 8 }}>

          {step < 1 && member.phone && (
            <button disabled={actionLoading} onClick={() => { setSmsMsg(`Hello ${member.firstName}, welcome to Heritage Church! We're so glad you joined us. We'd love to see you again this Sunday. God bless you! 🙏`); setShowSmsInput("welcome"); }} style={btnStyle(colors.deepNavy, colors.gold)}>
              📱 Send Welcome SMS
            </button>
          )}
          {step >= 1 && step < 2 && member.phone && (
            <button disabled={actionLoading} onClick={() => { setSmsMsg(`Hello ${member.firstName}, this is Heritage Church. We'd love to have you join us again this Sunday. You are special to us! God bless you 🙏`); setShowSmsInput("week1"); }} style={btnStyle("#2563EB", "#fff")}>
              📱 Send Week 1 Follow-Up
            </button>
          )}
          {step >= 2 && step < 3 && member.phone && (
            <button disabled={actionLoading} onClick={() => { setSmsMsg(`Hello ${member.firstName}, Heritage Church checking in again! We miss you and would love to see you. Please join us this Sunday 🙏`); setShowSmsInput("week2"); }} style={btnStyle("#7C3AED", "#fff")}>
              📱 Send Week 2 Follow-Up
            </button>
          )}

          {showSmsInput && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <textarea value={smsMsg} onChange={e => setSmsMsg(e.target.value)} rows={3} placeholder="Edit message before sending…"
                style={{ width: "100%", padding: "9px 11px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", color: colors.deepNavy, boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = colors.deepNavy}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              <div style={{ display: "flex", gap: 6 }}>
                <button disabled={actionLoading} onClick={() => handleSendSMS(showSmsInput === "welcome" ? "welcome_sent" : showSmsInput === "week1" ? "week1_sent" : "week2_sent")}
                  style={{ ...btnStyle(colors.deepNavy, colors.gold), flex: 1, padding: "8px 0", fontSize: 12 }}>
                  {actionLoading ? "Sending…" : "✓ Send Now"}
                </button>
                <button onClick={() => setShowSmsInput(null)} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 6 }}>
            {!isReturned && (
              <button disabled={actionLoading} onClick={() => onAction(member._id, "returned")} style={{ ...btnStyle("#0EA5E9", "#fff"), flex: 1, fontSize: 12 }}>
                🏠 Returned
              </button>
            )}
            <button disabled={actionLoading} onClick={() => onAction(member._id, "convert")} style={{ ...btnStyle("#16A34A", "#fff"), flex: 1, fontSize: 12 }}>
              ✝️ Convert
            </button>
          </div>

          {!showNoteInput ? (
            <button onClick={() => setShowNoteInput(true)} style={{ ...btnStyle("#fff", "#475569"), border: "1.5px solid #e2e8f0", fontSize: 12 }}>
              📝 Add Note
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={2} placeholder="Write a note about this person…"
                style={{ width: "100%", padding: "9px 11px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = colors.deepNavy}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              <div style={{ display: "flex", gap: 6 }}>
                <button disabled={actionLoading} onClick={handleNote} style={{ ...btnStyle(colors.deepNavy, colors.gold), flex: 1, padding: "8px 0", fontSize: 12 }}>
                  {actionLoading ? "Saving…" : "Save Note"}
                </button>
                <button onClick={() => setShowNoteInput(false)} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isConverted && (
        <div style={{ margin: "0 18px 16px", padding: "12px 16px", background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 10, textAlign: "center", fontWeight: 700, color: "#15803D", fontSize: 13 }}>
          🎉 Converted to New Convert!
        </div>
      )}

      {/* History toggle */}
      {member.followUpHistory?.length > 0 && (
        <div style={{ borderTop: "1px solid #f1f5f9" }}>
          <button onClick={() => setExpanded(!expanded)} style={{ width: "100%", padding: "10px 18px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 700, color: "#64748b" }}>
            <span>📋 Follow-up history ({member.followUpHistory.length})</span>
            <span>{expanded ? "▲" : "▼"}</span>
          </button>
          {expanded && (
            <div style={{ padding: "0 18px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              {[...member.followUpHistory].reverse().map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", background: "#f8fafc", borderRadius: 8 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{h.smsSent ? "📱" : "📝"}</span>
                  <div>
                    <div style={{ fontSize: 12, color: colors.deepNavy, fontWeight: 600 }}>{h.note}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                      {new Date(h.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   SESSION DETAIL MODAL
───────────────────────────────────────── */
const SessionModal = ({ session, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/attendance/session`, {
          params: { serviceDate: session.serviceDate, serviceType: session.serviceType },
        });
        setDetail(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [session]);

  const dateStr = new Date(session.serviceDate).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 640, width: "100%", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: colors.deepNavy, fontFamily: "'Georgia', serif" }}>{session.serviceType}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{dateStr}</div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 700, fontSize: 18, color: "#64748b" }}>✕</button>
        </div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner size={32} color={colors.deepNavy} /></div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 12, padding: "14px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#15803D" }}>{detail?.present?.length || 0}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>✅ Present</div>
              </div>
              <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: 12, padding: "14px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#B91C1C" }}>{detail?.absent?.length || 0}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>❌ Absent</div>
              </div>
            </div>
            {detail?.present?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#15803D", marginBottom: 10 }}>✅ Present Members</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {detail.present.map(m => m && (
                    <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#F0FDF4", borderRadius: 10 }}>
                      <MemberAvatar member={m} size={32} />
                      <span style={{ fontWeight: 600, fontSize: 14, color: colors.deepNavy }}>{m.firstName} {m.lastName}</span>
                      <CategoryBadge category={m.category} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {detail?.absent?.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#B91C1C", marginBottom: 10 }}>❌ Absent Members</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {detail.absent.map(m => m && (
                    <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#FEF2F2", borderRadius: 10 }}>
                      <MemberAvatar member={m} size={32} />
                      <span style={{ fontWeight: 600, fontSize: 14, color: colors.deepNavy }}>{m.firstName} {m.lastName}</span>
                      <CategoryBadge category={m.category} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   ATTENDANCE HISTORY TAB
───────────────────────────────────────── */
const AttendanceHistory = ({ totalMembers }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/attendance/history`, { params: { month, year } });
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
  const sessions = data?.sessions || [];
  const totals   = data?.monthlyTotals || { totalPresent: 0, totalAbsent: 0, totalServices: 0 };
  const avgAttendance = totals.totalServices > 0 ? Math.round(totals.totalPresent / totals.totalServices) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #e8eaf0", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 800, color: colors.deepNavy, fontSize: 15 }}>📅 View History:</span>
        <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ padding: "8px 14px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontWeight: 700, fontSize: 14, color: colors.deepNavy, background: colors.soft, cursor: "pointer", outline: "none" }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ padding: "8px 14px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontWeight: 700, fontSize: 14, color: colors.deepNavy, background: colors.soft, cursor: "pointer", outline: "none" }}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={fetchHistory} style={{ padding: "8px 18px", borderRadius: 9, background: colors.deepNavy, color: colors.gold, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Refresh</button>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{MONTHS[month - 1]} {year}</span>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={40} color={colors.deepNavy} /></div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            <div style={{ background: colors.deepNavy, color: "#fff", borderRadius: 16, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Services Held</div>
              <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Georgia', serif" }}>{totals.totalServices}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #86EFAC" }}>
              <div style={{ fontSize: 11, color: "#15803D", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Total Present</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#15803D", fontFamily: "'Georgia', serif" }}>{totals.totalPresent}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #FCA5A5" }}>
              <div style={{ fontSize: 11, color: "#B91C1C", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Total Absent</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#B91C1C", fontFamily: "'Georgia', serif" }}>{totals.totalAbsent}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1.5px solid #e8eaf0" }}>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Avg per Service</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: colors.deepNavy, fontFamily: "'Georgia', serif" }}>{avgAttendance}</div>
            </div>
          </div>

          {totals.totalServices > 0 && totalMembers > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, padding: "22px 26px", border: "1.5px solid #e8eaf0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: colors.deepNavy }}>📊 Monthly Attendance Rate</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: colors.deepNavy, fontFamily: "'Georgia', serif" }}>{Math.round((avgAttendance / totalMembers) * 100)}%</div>
              </div>
              <ProgressBar value={avgAttendance} max={totalMembers} color={colors.deepNavy} height={14} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                <span>0</span>
                <span>Average {avgAttendance} of {totalMembers} members per service</span>
                <span>{totalMembers}</span>
              </div>
              {sessions.length > 1 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 12 }}>SERVICE BY SERVICE</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sessions.map((s, i) => {
                      const d = new Date(s._id.serviceDate);
                      const pct = s.total > 0 ? Math.round((s.presentCount / s.total) * 100) : 0;
                      return (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                            <span>{s._id.serviceType} — {d.getDate()} {MONTHS_SHORT[d.getMonth()]}</span>
                            <span style={{ color: pct >= 70 ? "#15803D" : "#B91C1C" }}>{s.presentCount}/{s.total} ({pct}%)</span>
                          </div>
                          <ProgressBar value={s.presentCount} max={s.total} color={pct >= 70 ? "#16A34A" : "#DC2626"} height={7} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: 16, padding: "22px 26px", border: "1.5px solid #e8eaf0" }}>
            <SectionHeader title="Service Records" subtitle="Click any service to see who was present and absent" />
            {sessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>No services recorded for {MONTHS[month - 1]} {year}</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Go to "Mark Attendance" to record a service</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {sessions.map((session, i) => {
                  const date = new Date(session._id.serviceDate);
                  const dateStr = date.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" });
                  const pct = session.total > 0 ? Math.round((session.presentCount / session.total) * 100) : 0;
                  const isGood = pct >= 70;
                  return (
                    <div key={i} onClick={() => setSelectedSession({ serviceDate: session._id.serviceDate, serviceType: session._id.serviceType })}
                      style={{ padding: "16px 20px", borderRadius: 14, border: "1.5px solid #e8eaf0", cursor: "pointer", transition: "all 0.18s", background: "#fafafa" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${colors.deepNavy}06`; e.currentTarget.style.borderColor = colors.deepNavy; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#e8eaf0"; }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                        <div style={{ background: colors.deepNavy, color: colors.gold, borderRadius: 10, padding: "6px 12px", textAlign: "center", minWidth: 58, flexShrink: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>{MONTHS_SHORT[date.getMonth()]}</div>
                          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{date.getDate()}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 15, color: colors.deepNavy }}>{session._id.serviceType}</div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{dateStr}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#15803D", background: "#F0FDF4", padding: "4px 10px", borderRadius: 20 }}>✅ {session.presentCount}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#B91C1C", background: "#FEF2F2", padding: "4px 10px", borderRadius: 20 }}>❌ {session.absentCount}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, padding: "4px 10px", borderRadius: 20, background: isGood ? "#F0FDF4" : "#FEF2F2", color: isGood ? "#15803D" : "#B91C1C" }}>{pct}%</span>
                          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>→</span>
                        </div>
                      </div>
                      <ProgressBar value={session.presentCount} max={session.total} color={isGood ? "#16A34A" : "#DC2626"} height={6} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
      {selectedSession && <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
const AdminDashboard = () => {
  const [members, setMembers]         = useState([]);
  const [prayers, setPrayers]         = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [birthdays, setBirthdays]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [sendingStates, setSendingStates] = useState({});

  const [attendance, setAttendance]   = useState({});
  const [serviceType, setServiceType] = useState("Sunday Service");
  const [serviceDate, setServiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceMessage, setAttendanceMessage] = useState(
    "Hello {name}, we missed you at church today. Please reach out if there's any issue."
  );
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  const [activeTab, setActiveTab]     = useState("attendance");
  const [toast, setToast]             = useState("");
  const [searchTerm, setSearchTerm]   = useState("");

  // ERROR 1 FIXED: These are now properly inside the component as state
  const [ftStageFilter, setFtStageFilter]     = useState("all");
  const [ftActionLoading, setFtActionLoading] = useState({});

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(""), 3500); return () => clearTimeout(t); }
  }, [toast]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, prayersRes, testimoniesRes, birthdaysRes] = await Promise.all([
        axios.get(`${API_URL}/api/members`),
        axios.get(`${API_URL}/api/prayers`),
        axios.get(`${API_URL}/api/testimonies`),
        axios.get(`${API_URL}/api/birthdays/upcoming`),
      ]);
      setMembers(membersRes.data.data || []);
      setPrayers(prayersRes.data.data || []);
      setTestimonies(testimoniesRes.data.data || []);
      setBirthdays(birthdaysRes.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const submitAttendance = async () => {
  const presentMembers = Object.keys(attendance).filter(id => attendance[id]);
  const absentMembers = members
    .filter(m => !attendance[m._id])
    .map(m => ({
      memberId: m._id,
      name: `${m.firstName} ${m.lastName}`,
      phone: m.phone || null,
    }));

  if (presentMembers.length === 0) {
    alert("Please mark at least one member as present");
    return;
  }
  if (!attendanceMessage.trim()) {
    alert("Please enter a message for absentees");
    return;
  }

  setSubmittingAttendance(true);
  try {
    const payload = { presentMembers, absentMembers, message: attendanceMessage, serviceType, serviceDate };
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));

    const res = await axios.post(`${API_URL}/api/attendance/mark`, payload);
    console.log("✅ Success:", res.data);

    setToast(`✅ Attendance saved! ${presentMembers.length} present, ${absentMembers.length} absent.`);
    setAttendance({});
  } catch (err) {
    // Show the FULL backend error
    const errData = err.response?.data;
    const errStatus = err.response?.status;
    const errMsg = errData?.error || errData?.message || errData || err.message;
    
    console.error("❌ Status:", errStatus);
    console.error("❌ Full error data:", errData);
    
    // Show detailed error in alert so you can see it without DevTools
    alert(`Error ${errStatus}:\n${typeof errMsg === "object" ? JSON.stringify(errMsg, null, 2) : errMsg}`);
  } finally {
    setSubmittingAttendance(false);
  }
};
  const sendFollowUp = async (member) => {
    const id   = member._id;
    const name = member.firstName ? `${member.firstName} ${member.lastName}` : member.memberName;
    if (!member.phone) { alert(`${name} has no phone number`); return; }
    setSendingStates(p => ({ ...p, [id]: true }));
    try {
      await axios.post(`${API_URL}/api/birthdays/${id}/message`, { name, phone: member.phone });
      setToast(`✅ Message sent to ${name}`);
    } catch (err) { alert(err.response?.data?.message || "Failed to send message"); }
    finally { setSendingStates(p => ({ ...p, [id]: false })); }
  };

  const handleFirstTimerAction = async (memberId, actionType, payload = {}) => {
    setFtActionLoading(p => ({ ...p, [memberId]: true }));
    try {
      if (actionType === "sms") {
        await axios.post(`${API_URL}/api/members/${memberId}/followup/sms`, payload);
        setToast("✅ Follow-up SMS sent!");
      } else if (actionType === "note") {
        await axios.post(`${API_URL}/api/members/${memberId}/followup/note`, payload);
        setToast("✅ Note saved!");
      } else if (actionType === "returned") {
        await axios.put(`${API_URL}/api/members/${memberId}/followup/returned`);
        setToast("✅ Marked as returned!");
      } else if (actionType === "convert") {
        if (!window.confirm("Convert this person to New Convert?")) return;
        await axios.put(`${API_URL}/api/members/${memberId}/followup/convert`);
        setToast("🎉 Converted to New Convert!");
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setFtActionLoading(p => ({ ...p, [memberId]: false }));
    }
  };

  const publishTestimony = async (id) => {
    try { await axios.put(`${API_URL}/api/testimonies/${id}/publish`); setToast("✅ Testimony published!"); fetchData(); }
    catch { alert("Failed to publish testimony"); }
  };

  const deleteTestimony = async (id) => {
    if (!window.confirm("Delete this testimony?")) return;
    try { await axios.delete(`${API_URL}/api/testimonies/${id}`); setToast("✅ Testimony deleted!"); fetchData(); }
    catch { alert("Failed to delete testimony"); }
  };

  if (loading) return <LoadingScreen />;

  const filtered        = members.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const firstTimers     = members.filter(m => m.category === "First Timer");
  const newConverts     = members.filter(m => m.category === "New Convert");
  const regularMembers  = members.filter(m => m.category === "Member");
  const presentCount    = Object.values(attendance).filter(Boolean).length;

  // First timer filter groups
  const ftGroups = {
    all:       firstTimers,
    overdue:   firstTimers.filter(m => daysSince(m.firstVisitDate || m.createdAt) >= 14 && !["returned","converted"].includes(m.followUpStage)),
    due:       firstTimers.filter(m => { const d = daysSince(m.firstVisitDate || m.createdAt); return d >= 7 && d < 14 && !["returned","converted"].includes(m.followUpStage); }),
    on_track:  firstTimers.filter(m => (daysSince(m.firstVisitDate || m.createdAt) || 0) < 7 && !["returned","converted"].includes(m.followUpStage)),
    returned:  firstTimers.filter(m => m.returnedToChurch || m.followUpStage === "returned"),
    converted: firstTimers.filter(m => m.followUpStage === "converted"),
  };
  const ftDisplayed = (ftGroups[ftStageFilter] || firstTimers).filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const tabs = [
    { id: "attendance",  label: "Mark Attendance",   icon: "📋" },
    { id: "history",     label: "Attendance History", icon: "📊" },
    { id: "members",     label: "All Members",        icon: "👥" },
    { id: "firstTimers", label: "First Timers",       icon: "🆕" },
    { id: "newConverts", label: "New Converts",       icon: "✝️" },
    { id: "prayers",     label: "Prayers",            icon: "🙏" },
    { id: "testimonies", label: "Testimonies",        icon: "💬" },
    { id: "birthdays",   label: "Birthdays",          icon: "🎂" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.soft, fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}} *{box-sizing:border-box}`}</style>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: colors.deepNavy, boxShadow: "0 2px 20px rgba(11,27,63,0.25)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>⛪</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, fontFamily: "'Georgia', serif", letterSpacing: 0.5 }}>Heritage Admin</span>
          </div>
          <button onClick={() => { localStorage.removeItem("authToken"); window.location.href = "/login"; }}
            style={{ background: "rgba(255,215,0,0.12)", color: colors.gold, border: "1.5px solid rgba(255,215,0,0.3)", borderRadius: 8, padding: "6px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 74, right: 20, zIndex: 200, background: colors.deepNavy, color: "#fff", padding: "12px 22px", borderRadius: 10, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.18)", fontSize: 14, borderLeft: `4px solid ${colors.gold}`, animation: "slideIn 0.3s ease" }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "28px 20px" }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 28 }}>
          <StatCard label="Total Members"   value={members.length}        icon="👥" accent />
          <StatCard label="Regular"         value={regularMembers.length} icon="⭐" />
          <StatCard label="First Timers"    value={firstTimers.length}    icon="🆕" />
          <StatCard label="New Converts"    value={newConverts.length}    icon="✝️" />
          <StatCard label="Prayer Requests" value={prayers.length}        icon="🙏" />
          <StatCard label="Upcoming B-days" value={birthdays.length}      icon="🎂" />
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchTerm(""); setFtStageFilter("all"); }}
              style={{ padding: "9px 16px", borderRadius: 9, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: activeTab === tab.id ? colors.deepNavy : "#fff", color: activeTab === tab.id ? colors.gold : "#475569", boxShadow: activeTab === tab.id ? "0 4px 14px rgba(11,27,63,0.2)" : "0 1px 4px rgba(0,0,0,0.07)", transition: "all 0.18s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══ MARK ATTENDANCE ══ */}
        {activeTab === "attendance" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
              <SectionHeader title="Mark Attendance" subtitle="Check members who are present. Unchecked members will receive an SMS." />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ color: "#15803D", fontWeight: 800, fontSize: 28 }}>{presentCount}</div>
                  <div style={{ color: "#16A34A", fontSize: 12, fontWeight: 700 }}>✅ Present</div>
                </div>
                <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ color: "#B91C1C", fontWeight: 800, fontSize: 28 }}>{members.length - presentCount}</div>
                  <div style={{ color: "#DC2626", fontSize: 12, fontWeight: 700 }}>❌ Absent</div>
                </div>
              </div>
              <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search member…" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, maxHeight: 440, overflowY: "auto", padding: 2 }}>
                {filtered.map(member => (
                  <label key={member._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${attendance[member._id] ? colors.deepNavy : "#e2e8f0"}`, background: attendance[member._id] ? `${colors.deepNavy}08` : "#fafafa", transition: "all 0.15s" }}>
                    <input type="checkbox" checked={attendance[member._id] || false} onChange={e => setAttendance(p => ({ ...p, [member._id]: e.target.checked }))} style={{ accentColor: colors.deepNavy, width: 16, height: 16, cursor: "pointer" }} />
                    <MemberAvatar member={member} size={30} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: colors.deepNavy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{member.firstName} {member.lastName}</div>
                      {!member.phone && <div style={{ fontSize: 10, color: "#ef4444" }}>No phone</div>}
                    </div>
                    {attendance[member._id] && <span style={{ color: "#16A34A", fontSize: 16 }}>✓</span>}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: colors.deepNavy, marginBottom: 14 }}>⛪ Service Details</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5 }}>SERVICE TYPE</label>
                  <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, fontWeight: 600, color: colors.deepNavy, background: colors.soft, outline: "none", cursor: "pointer" }} onFocus={e => e.target.style.borderColor = colors.deepNavy} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5 }}>SERVICE DATE</label>
                  <input type="date" value={serviceDate} onChange={e => setServiceDate(e.target.value)} style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, fontWeight: 600, color: colors.deepNavy, background: colors.soft, outline: "none" }} onFocus={e => e.target.style.borderColor = colors.deepNavy} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: colors.deepNavy, marginBottom: 6 }}>✉️ Message to Absentees</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>Use <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>{"{name}"}</code> to personalise</div>
                <textarea value={attendanceMessage} onChange={e => setAttendanceMessage(e.target.value)} rows={4} style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", color: colors.deepNavy }} onFocus={e => e.target.style.borderColor = colors.deepNavy} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              <button onClick={submitAttendance} disabled={submittingAttendance || presentCount === 0}
                style={{ width: "100%", padding: "16px 0", borderRadius: 12, fontWeight: 800, fontSize: 15, border: "none", cursor: submittingAttendance || presentCount === 0 ? "not-allowed" : "pointer", background: submittingAttendance || presentCount === 0 ? "#e2e8f0" : colors.deepNavy, color: submittingAttendance || presentCount === 0 ? "#94a3b8" : colors.gold, boxShadow: presentCount > 0 ? "0 4px 18px rgba(11,27,63,0.2)" : "none", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {submittingAttendance ? <><Spinner /><span>Saving…</span></> : `✓ Save Attendance (${presentCount} present)`}
              </button>

              <div style={{ background: `${colors.deepNavy}06`, border: `1px solid ${colors.deepNavy}15`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                <strong style={{ color: colors.deepNavy }}>How it works:</strong> Select the service type and date, check present members, then save. Absentees automatically receive your SMS.
              </div>
            </div>
          </div>
        )}

        {/* ══ ATTENDANCE HISTORY ══ */}
        {activeTab === "history" && <AttendanceHistory totalMembers={members.length} />}

        {/* ══ ALL MEMBERS ══ */}
        {activeTab === "members" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
            <SectionHeader title="All Members" count={members.length} />
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by name…" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {filtered.map(m => <MemberCard key={m._id} member={m} onSendSMS={sendFollowUp} sending={sendingStates[m._id]} />)}
              {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#94a3b8" }}>No members found</div>}
            </div>
          </div>
        )}

        {/* ══ FIRST TIMERS ══ */}
        {activeTab === "firstTimers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Filter strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
              {[
                { key: "all",       label: "All",         value: firstTimers.length,         color: colors.deepNavy, bg: "#EEF2FF" },
                { key: "overdue",   label: "⚠️ Overdue",  value: ftGroups.overdue.length,    color: "#B91C1C",       bg: "#FEF2F2" },
                { key: "due",       label: "⏰ Due Soon",  value: ftGroups.due.length,        color: "#92400E",       bg: "#FFFBEB" },
                { key: "on_track",  label: "✅ On Track",  value: ftGroups.on_track.length,   color: "#15803D",       bg: "#F0FDF4" },
                { key: "returned",  label: "🏠 Returned",  value: ftGroups.returned.length,   color: "#0369A1",       bg: "#E0F2FE" },
                { key: "converted", label: "🎉 Converted", value: ftGroups.converted.length,  color: "#15803D",       bg: "#DCFCE7" },
              ].map(s => (
                <button key={s.key} onClick={() => setFtStageFilter(s.key)}
                  style={{ padding: "12px 10px", borderRadius: 12, border: `2px solid ${ftStageFilter === s.key ? s.color : "transparent"}`, background: ftStageFilter === s.key ? s.bg : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.15s", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.label}</div>
                </button>
              ))}
            </div>

            {/* Cards */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
              <SectionHeader title="🆕 First Timers Follow-Up" count={ftDisplayed.length} subtitle="Track, follow up, and convert first-time visitors into members" />
              <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search first timer…" />
              {ftDisplayed.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{firstTimers.length === 0 ? "No first timers yet" : "No first timers match this filter"}</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                  {ftDisplayed.map(m => (
                    <FirstTimerCard key={m._id} member={m} onAction={handleFirstTimerAction} actionLoading={ftActionLoading[m._id]} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ NEW CONVERTS ══ */}
        {activeTab === "newConverts" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
            <SectionHeader title="✝️ New Converts" count={newConverts.length} />
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search…" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {newConverts.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map(m => <MemberCard key={m._id} member={m} onSendSMS={sendFollowUp} sending={sendingStates[m._id]} />)}
              {newConverts.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#94a3b8" }}>No new converts yet</div>}
            </div>
          </div>
        )}

        {/* ══ PRAYERS ══ */}
        {activeTab === "prayers" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
            <SectionHeader title="🙏 Prayer Requests" count={prayers.length} />
            {prayers.length === 0 ? <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No prayer requests yet</div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {prayers.map(p => (
                    <div key={p._id} style={{ padding: "16px 20px", borderRadius: 12, background: `${colors.deepNavy}05`, borderLeft: `4px solid ${colors.deepNavy}`, border: "1.5px solid #e8eaf0" }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: colors.deepNavy, marginBottom: 6 }}>{p.name}</div>
                      <div style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{p.message}</div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ══ TESTIMONIES ══ */}
        {activeTab === "testimonies" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1.5px solid #FED7AA", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
              <SectionHeader title="⏳ Pending Review" count={testimonies.filter(t => !t.isPublic).length} />
              {testimonies.filter(t => !t.isPublic).length === 0 ? <div style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>All clear!</div>
                : testimonies.filter(t => !t.isPublic).map(t => (
                    <div key={t._id} style={{ padding: 16, background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 10, marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, color: colors.deepNavy }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: "#92400E", marginTop: 3 }}>by {t.name}</div>
                      <button onClick={() => publishTestimony(t._id)} style={{ marginTop: 10, padding: "6px 16px", borderRadius: 7, background: colors.deepNavy, color: colors.gold, border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✓ Publish</button>
                    </div>
                  ))
              }
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1.5px solid #BBF7D0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
              <SectionHeader title="✅ Published" count={testimonies.filter(t => t.isPublic).length} />
              {testimonies.filter(t => t.isPublic).length === 0 ? <div style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>No published testimonies yet</div>
                : testimonies.filter(t => t.isPublic).map(t => (
                    <div key={t._id} style={{ padding: 16, background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 10, marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, color: colors.deepNavy }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: "#065F46", marginTop: 3 }}>by {t.name}</div>
                      <button onClick={() => deleteTestimony(t._id)} style={{ marginTop: 10, padding: "6px 16px", borderRadius: 7, background: "#DC2626", color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🗑 Delete</button>
                    </div>
                  ))
              }
            </div>
          </div>
        )}

        {/* ══ BIRTHDAYS ══ */}
        {activeTab === "birthdays" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
            <SectionHeader title="🎂 Upcoming Birthdays" count={birthdays.length} />
            {birthdays.length === 0 ? <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No upcoming birthdays</div>
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {birthdays.map(b => {
                    const today = new Date();
                    const isToday = b.birthDay === today.getDate() && b.birthMonth === (today.getMonth() + 1);
                    return (
                      <div key={b._id} style={{ padding: "16px 18px", borderRadius: 14, border: isToday ? "2px solid #F9A8D4" : "1.5px solid #e8eaf0", background: isToday ? "#FFF0F6" : "#fff", boxShadow: isToday ? "0 4px 20px rgba(249,168,212,0.3)" : "0 2px 8px rgba(11,27,63,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
                        <img src={b.imageUrl || `https://ui-avatars.com/api/?name=${b.memberName}&background=0B1B3F&color=FFD700`} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${isToday ? "#F9A8D4" : colors.gold}` }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: colors.deepNavy, fontSize: 15 }}>{b.memberName} {isToday && "🎉"}</div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{b.birthDay} {MONTHS_SHORT[(b.birthMonth || 1) - 1]}</div>
                        </div>
                        <button disabled={!b.phone || sendingStates[b._id]} onClick={() => sendFollowUp(b)}
                          style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: b.phone && !sendingStates[b._id] ? colors.deepNavy : "#e2e8f0", color: b.phone && !sendingStates[b._id] ? colors.gold : "#94a3b8", fontWeight: 700, fontSize: 12, cursor: b.phone && !sendingStates[b._id] ? "pointer" : "not-allowed" }}>
                          {sendingStates[b._id] ? "…" : "🎁 Send"}
                        </button>
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
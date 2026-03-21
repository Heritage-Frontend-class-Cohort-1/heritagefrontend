// ─────────────────────────────────────────────────────────────────
// BroadcastMessage.jsx
// Drop this component into your AdminDashboard.jsx:
//
//  1. Import it at the top:
//       import BroadcastMessage from "./BroadcastMessage";
//
//  2. Add to the tabs array:
//       { id: "broadcast", label: "Broadcast", icon: "📣" }
//
//  3. Render it in the tab section area:
//       {activeTab === "broadcast" && (
//         <BroadcastMessage members={members} apiUrl={API_URL} onToast={setToast} />
//       )}
// ─────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import axios from "axios";

const colors = {
  deepNavy: "#0B1B3F",
  navy2: "#142A5A",
  gold: "#FFD700",
  soft: "#F4F6FB",
};

const Spinner = ({ size = 18, color = "#fff" }) => (
  <>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <div style={{
      width: size, height: size,
      border: `2.5px solid ${color}40`,
      borderTop: `2.5px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }} />
  </>
);

const MemberAvatar = ({ member, size = 36 }) => (
  member?.imageUrl
    ? <img src={member.imageUrl} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${colors.gold}`, flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: "50%", background: colors.deepNavy, color: colors.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.35, flexShrink: 0 }}>
        {member?.firstName?.[0]}{member?.lastName?.[0]}
      </div>
);

const CATEGORY_COLORS = {
  "First Timer": { bg: "#FFF7E0", text: "#92400e", dot: "#F59E0B" },
  "New Convert": { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  "Member":      { bg: "#EEF2FF", text: "#3730A3", dot: "#6366F1" },
};

const CategoryBadge = ({ category }) => {
  const c = CATEGORY_COLORS[category] || CATEGORY_COLORS["Member"];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: c.bg, color: c.text, flexShrink: 0 }}>
      <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: c.dot, marginRight: 4, verticalAlign: "middle" }} />
      {category}
    </span>
  );
};

// ── Template presets ─────────────────────────────────────────────
const TEMPLATES = [
  {
    label: "Sunday Reminder",
    text: "Hello {name}, this is a reminder that Sunday Service holds at 8:00 AM tomorrow. We look forward to worshipping with you! God bless you. 🙏",
  },
  {
    label: "Event Announcement",
    text: "Hello {name}, you are invited to our upcoming church event! Details will be shared soon. Stay blessed. — Heritage Church",
  },
  {
    label: "Vigil Notice",
    text: "Hello {name}, our Congregational Vigil holds this Friday at 10:00 PM. Come and experience the power of God! See you there. 🔥",
  },
  {
    label: "Welfare / Check-In",
    text: "Hello {name}, Heritage Church is thinking of you and praying for your wellbeing. Please reach out if you need any support. God loves you! ❤️",
  },
  {
    label: "Giving Campaign",
    text: "Hello {name}, as we serve together, your support helps us touch more lives. You can give via UBA — The Lord's Heritage House, Acct: 1028674844. God rewards a cheerful giver! 🙌",
  },
];

// ── Main Component ───────────────────────────────────────────────
const BroadcastMessage = ({ members = [], apiUrl, onToast }) => {
  const [search, setSearch]           = useState("");
  const [categoryFilter, setCategory] = useState("all");
  const [selected, setSelected]       = useState(new Set());
  const [message, setMessage]         = useState("");
  const [sending, setSending]         = useState(false);
  const [preview, setPreview]         = useState(false);
  const [sentLog, setSentLog]         = useState([]);

  // Filter members
  const filtered = useMemo(() => {
    return members.filter(m => {
      const nameMatch = `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase());
      const catMatch  = categoryFilter === "all" || m.category === categoryFilter;
      return nameMatch && catMatch;
    });
  }, [members, search, categoryFilter]);

  const withPhone = filtered.filter(m => m.phone);
  const noPhone   = filtered.filter(m => !m.phone);

  const toggleMember = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(withPhone.map(m => m._id)));
  const clearAll  = () => setSelected(new Set());

  const selectByCategory = (cat) => {
    const ids = members.filter(m => m.category === cat && m.phone).map(m => m._id);
    setSelected(new Set(ids));
  };

  const selectedMembers = members.filter(m => selected.has(m._id));

  const resolveMessage = (member) =>
    message.replace(/\{name\}/gi, member.firstName || "Friend");

  const handleSend = async () => {
    if (!message.trim()) { alert("Please write a message first."); return; }
    if (selected.size === 0) { alert("Please select at least one member."); return; }

    const confirm = window.confirm(
      `Send message to ${selected.size} member${selected.size > 1 ? "s" : ""}?\n\nPreview:\n"${resolveMessage(selectedMembers[0])}"`
    );
    if (!confirm) return;

    setSending(true);
    const results = { sent: [], failed: [] };

    for (const member of selectedMembers) {
      try {
        await axios.post(`${apiUrl}/api/sms/send`, {
          phone: member.phone,
          name: `${member.firstName} ${member.lastName}`,
          message: resolveMessage(member),
        });
        results.sent.push(member);
      } catch (err) {
        results.failed.push({ member, error: err.response?.data?.message || "Failed" });
      }
    }

    setSending(false);
    setSentLog(results.sent);
    setSelected(new Set());

    const summary = `✅ Sent to ${results.sent.length} member${results.sent.length !== 1 ? "s" : ""}${results.failed.length > 0 ? ` · ❌ ${results.failed.length} failed` : ""}`;
    onToast?.(summary);

    if (results.failed.length > 0) {
      const failNames = results.failed.map(f => `${f.member.firstName} ${f.member.lastName}: ${f.error}`).join("\n");
      alert(`Some messages failed:\n${failNames}`);
    }
  };

  const charCount = message.length;
  const smsCount  = Math.ceil(charCount / 160) || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header stat strip ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        {[
          { label: "Total Members", value: members.length, icon: "👥", color: colors.deepNavy, light: "#EEF2FF" },
          { label: "With Phone",    value: members.filter(m => m.phone).length, icon: "📱", color: "#15803D", light: "#F0FDF4" },
          { label: "Selected",      value: selected.size, icon: "✓", color: "#D97706", light: "#FFFBEB" },
          { label: "No Phone",      value: members.filter(m => !m.phone).length, icon: "⚠️", color: "#B91C1C", light: "#FEF2F2" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 14, padding: "16px 20px",
            border: `1.5px solid ${s.light}`,
            boxShadow: "0 2px 8px rgba(11,27,63,0.05)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{ fontSize: 22, width: 40, height: 40, borderRadius: 10, background: s.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1.1, fontFamily: "'Georgia', serif" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>

        {/* ── LEFT: Member Picker ──────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>

          {/* Picker header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: colors.deepNavy, fontFamily: "'Georgia', serif" }}>Select Recipients</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Only members with phone numbers can receive SMS</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={selectAll} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: colors.deepNavy, color: colors.gold, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                Select All ({withPhone.length})
              </button>
              <button onClick={clearAll} style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                Clear
              </button>
            </div>
          </div>

          {/* Quick-select by category */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", alignSelf: "center" }}>Quick select:</span>
            {["Member", "New Convert", "First Timer"].map(cat => {
              const c = CATEGORY_COLORS[cat];
              return (
                <button key={cat} onClick={() => selectByCategory(cat)} style={{
                  padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${c.dot}40`,
                  background: c.bg, color: c.text, fontWeight: 700, fontSize: 11, cursor: "pointer"
                }}>
                  {cat}s ({members.filter(m => m.category === cat && m.phone).length})
                </button>
              );
            })}
          </div>

          {/* Search + filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search member…"
                style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", background: colors.soft, color: colors.deepNavy, boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = colors.deepNavy}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <select value={categoryFilter} onChange={e => setCategory(e.target.value)}
              style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, fontWeight: 600, color: colors.deepNavy, background: colors.soft, outline: "none", cursor: "pointer" }}>
              <option value="all">All Categories</option>
              <option value="Member">Members</option>
              <option value="New Convert">New Converts</option>
              <option value="First Timer">First Timers</option>
            </select>
          </div>

          {/* Member list */}
          <div style={{ maxHeight: 460, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 2 }}>
            {withPhone.length === 0 && noPhone.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No members found</div>
            )}

            {withPhone.map(m => {
              const isSelected = selected.has(m._id);
              return (
                <label key={m._id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 10, cursor: "pointer",
                  border: `1.5px solid ${isSelected ? colors.deepNavy : "#e2e8f0"}`,
                  background: isSelected ? `${colors.deepNavy}08` : "#fafafa",
                  transition: "all 0.15s"
                }}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleMember(m._id)}
                    style={{ accentColor: colors.deepNavy, width: 15, height: 15, cursor: "pointer", flexShrink: 0 }} />
                  <MemberAvatar member={m} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: colors.deepNavy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {m.firstName} {m.lastName}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{m.phone}</div>
                  </div>
                  <CategoryBadge category={m.category} />
                  {isSelected && <span style={{ color: "#16A34A", fontSize: 14, flexShrink: 0 }}>✓</span>}
                </label>
              );
            })}

            {noPhone.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, padding: "8px 4px 4px" }}>
                  ⚠️ No phone number — cannot receive SMS ({noPhone.length})
                </div>
                {noPhone.map(m => (
                  <div key={m._id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                    borderRadius: 10, opacity: 0.45,
                    border: "1.5px solid #e2e8f0", background: "#fafafa"
                  }}>
                    <div style={{ width: 15, height: 15, flexShrink: 0 }} />
                    <MemberAvatar member={m} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: colors.deepNavy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {m.firstName} {m.lastName}
                      </div>
                      <div style={{ fontSize: 11, color: "#ef4444" }}>No phone number</div>
                    </div>
                    <CategoryBadge category={m.category} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Message Composer ──────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Templates */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: colors.deepNavy, marginBottom: 12 }}>📋 Message Templates</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => setMessage(t.text)}
                  style={{
                    padding: "9px 14px", borderRadius: 9, border: "1.5px solid #e2e8f0",
                    background: message === t.text ? `${colors.deepNavy}08` : "#fafafa",
                    borderColor: message === t.text ? colors.deepNavy : "#e2e8f0",
                    color: colors.deepNavy, fontWeight: 600, fontSize: 13,
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                  }}>
                  {message === t.text ? "✓ " : ""}{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compose */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: colors.deepNavy }}>✏️ Compose Message</div>
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{charCount} chars · {smsCount} SMS</span>
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
              Use <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>{"{name}"}</code> — it'll be replaced with each member's first name
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={6}
              placeholder="Type your message here… e.g. Hello {name}, join us this Sunday at 8AM 🙏"
              style={{
                width: "100%", padding: "12px 14px",
                border: "1.5px solid #e2e8f0", borderRadius: 10,
                fontSize: 14, outline: "none", resize: "vertical",
                fontFamily: "inherit", color: colors.deepNavy,
                lineHeight: 1.7, boxSizing: "border-box"
              }}
              onFocus={e => e.target.style.borderColor = colors.deepNavy}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />

            {/* Live preview */}
            {message && selectedMembers.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setPreview(!preview)} style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {preview ? "▲ Hide preview" : "▼ Preview for first recipient"}
                </button>
                {preview && (
                  <div style={{ marginTop: 8, padding: "12px 14px", background: "#F0F7FF", border: "1.5px solid #BFDBFE", borderRadius: 10, fontSize: 13, color: "#1E3A5F", lineHeight: 1.7, fontStyle: "italic" }}>
                    "{resolveMessage(selectedMembers[0])}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected recipients preview */}
          {selected.size > 0 && (
            <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 14, padding: "14px 18px" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#92400E", marginBottom: 10 }}>
                📤 Sending to {selected.size} member{selected.size !== 1 ? "s" : ""}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedMembers.slice(0, 12).map(m => (
                  <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 5, background: "#fff", border: "1px solid #FDE68A", borderRadius: 20, padding: "3px 10px 3px 5px", fontSize: 12, fontWeight: 600, color: "#92400E" }}>
                    <MemberAvatar member={m} size={20} />
                    {m.firstName}
                    <span onClick={() => toggleMember(m._id)} style={{ cursor: "pointer", color: "#D97706", fontSize: 14, lineHeight: 1, marginLeft: 2 }}>×</span>
                  </div>
                ))}
                {selectedMembers.length > 12 && (
                  <div style={{ padding: "3px 10px", background: "#FDE68A", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#92400E" }}>
                    +{selectedMembers.length - 12} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Send button */}
          <button onClick={handleSend} disabled={sending || selected.size === 0 || !message.trim()}
            style={{
              width: "100%", padding: "16px 0",
              borderRadius: 12, fontWeight: 800, fontSize: 15,
              border: "none",
              cursor: sending || selected.size === 0 || !message.trim() ? "not-allowed" : "pointer",
              background: sending || selected.size === 0 || !message.trim() ? "#e2e8f0" : colors.deepNavy,
              color: sending || selected.size === 0 || !message.trim() ? "#94a3b8" : colors.gold,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: selected.size > 0 && message.trim() ? "0 4px 18px rgba(11,27,63,0.2)" : "none",
              transition: "all 0.2s"
            }}>
            {sending
              ? <><Spinner /><span>Sending to {selected.size} members…</span></>
              : `📣 Send to ${selected.size || 0} Member${selected.size !== 1 ? "s" : ""}`
            }
          </button>

          {/* Hint */}
          <div style={{ background: `${colors.deepNavy}06`, border: `1px solid ${colors.deepNavy}12`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#475569", lineHeight: 1.65 }}>
            <strong style={{ color: colors.deepNavy }}>How it works:</strong> Select members from the list, pick or write a message, then press Send. Each member receives a personalised SMS with their name inserted where you put <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>{"{name}"}</code>.
          </div>
        </div>
      </div>

      {/* ── Sent Log ─────────────────────────────────────────────── */}
      {sentLog.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1.5px solid #BBF7D0", boxShadow: "0 2px 12px rgba(11,27,63,0.06)" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#15803D", marginBottom: 14 }}>
            ✅ Last Broadcast — {sentLog.length} messages sent
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sentLog.map(m => (
              <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 20, padding: "4px 12px 4px 6px", fontSize: 12, fontWeight: 600, color: "#15803D" }}>
                <MemberAvatar member={m} size={22} />
                {m.firstName} {m.lastName}
              </div>
            ))}
          </div>
          <button onClick={() => setSentLog([])} style={{ marginTop: 12, fontSize: 12, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Clear log
          </button>
        </div>
      )}

    </div>
  );
};

export default BroadcastMessage;
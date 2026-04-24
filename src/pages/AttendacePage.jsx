import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://backend-heritage-7.onrender.com/api/register";

const SERVICES = [
  "Sunday Service",
  "Tuesday Service",
  "Thursday Service",
  "Special Programme",
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, e) => s + (e.value || 0), 0);
  return (
    <div style={{ background:"#0a1628", border:"1px solid #c9a84c", borderRadius:10, padding:"12px 18px", fontFamily:"'Lora',serif" }}>
      <p style={{ color:"#c9a84c", fontWeight:700, marginBottom:6 }}>{label}</p>
      {payload.map(e => (
        <p key={e.name} style={{ color:e.color, margin:"2px 0", fontSize:13 }}>
          {e.name}: <strong>{e.value}</strong>
        </p>
      ))}
      <p style={{ color:"#e8d5a3", borderTop:"1px solid #2a3a5c", marginTop:8, paddingTop:8, fontSize:13 }}>
        Total: <strong>{total}</strong>
      </p>
    </div>
  );
};

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("record");
  const [chartType, setChartType] = useState("bar");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const emptyForm = { date: new Date().toISOString().slice(0, 10), service: SERVICES[0], male: "", female: "", children: "" };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = create, id = edit

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(`${BASE_URL}?year=${selectedYear}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecords(data);
    } catch {
      setFetchError("Could not load records. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // ── Chart data ───────────────────────────────────────────────────────────
  const chartData = (() => {
    const map = {};
    MONTHS.forEach(m => { map[m] = { month: m, Male: 0, Female: 0, Children: 0 }; });
    records.forEach(r => {
      const m = MONTHS[new Date(r.date).getMonth()];
      if (map[m]) {
        map[m].Male     += Number(r.male)     || 0;
        map[m].Female   += Number(r.female)   || 0;
        map[m].Children += Number(r.children) || 0;
      }
    });
    return Object.values(map);
  })();

  const totals = chartData.reduce(
    (a, d) => ({ m: a.m + d.Male, f: a.f + d.Female, c: a.c + d.Children }),
    { m: 0, f: 0, c: 0 }
  );
  const grand = totals.m + totals.f + totals.c;

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = (r) => {
    setEditingId(r._id);
    setForm({
      date:     new Date(r.date).toISOString().slice(0, 10),
      service:  r.service,
      male:     r.male,
      female:   r.female,
      children: r.children,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // ── Submit (create or update) ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.male && !form.female && !form.children) {
      setError("Please enter at least one attendance count.");
      return;
    }
    setError("");
    setSaving(true);
    const payload = {
      ...form,
      male:     Number(form.male)     || 0,
      female:   Number(form.female)   || 0,
      children: Number(form.children) || 0,
    };
    try {
      const url    = editingId ? `${BASE_URL}/${editingId}` : BASE_URL;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setForm(emptyForm);
      setEditingId(null);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      fetchRecords();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      setRecords(prev => prev.filter(r => r._id !== id));
      if (editingId === id) handleCancelEdit();
    } catch {
      alert("Could not delete record.");
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
  .attendance-page input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  .attendance-page input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
  .attendance-page select option { background: #0d1f3c; }
  .hov:hover { opacity: 0.8; }
  .tab-btn { transition: all 0.2s; }
  .tab-btn:hover { border-color: #c9a84c !important; color: #c9a84c !important; }
`}</style>

      <div className="attendance-page" style={{ minHeight:"100vh", background:"linear-gradient(160deg,#060e1f 0%,#0d1f3c 60%,#091529 100%)", fontFamily:"'Lora',serif", color:"#e8d5a3", paddingBottom:60 }}>

        {/* Hero */}
        <div style={{ textAlign:"center", padding:"100px 24px 28px", borderBottom:"1px solid rgba(201,168,76,0.2)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%,rgba(201,168,76,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ display:"inline-block", border:"1px solid rgba(201,168,76,0.4)", borderRadius:20, padding:"4px 14px", fontSize:11, letterSpacing:"0.15em", color:"#c9a84c", textTransform:"uppercase", marginBottom:12}}>
            ✦ Lords Heritage Parish ✦
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,5vw,38px)", fontWeight:800, color:"#fff", marginBottom:8 }}>
            Attendance Register
          </h1>
          <p style={{ fontSize:14, color:"#8a9bc0" }}>Record & track weekly service attendance</p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, padding:"24px 24px 0" }}>
          {[["record","✍  Record Attendance"],["chart","📊  View Analytics"]].map(([key,label]) => (
            <button key={key} className="tab-btn" onClick={() => setTab(key)}
              style={{ padding:"10px 24px", border:`1px solid ${tab===key?"#c9a84c":"rgba(201,168,76,0.25)"}`, borderRadius:30, background:tab===key?"rgba(201,168,76,0.15)":"transparent", color:tab===key?"#c9a84c":"#8a9bc0", cursor:"pointer", fontSize:13, fontFamily:"'Lora',serif", fontWeight:tab===key?700:400 }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth:760, margin:"32px auto 0", padding:"0 20px" }}>

          {/* ════ RECORD TAB ════ */}
          {tab === "record" && (
            <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${editingId?"rgba(255,179,71,0.35)":"rgba(201,168,76,0.2)"}`, borderRadius:16, padding:"28px" }}>

              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, borderBottom:"1px solid rgba(201,168,76,0.15)", paddingBottom:10 }}>
                <p style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color: editingId?"#ffb347":"#c9a84c", margin:0 }}>
                  {editingId ? "✏️  Editing Record — Make Your Corrections" : "New Attendance Entry"}
                </p>
                {editingId && (
                  <button onClick={handleCancelEdit} className="hov"
                    style={{ fontSize:11, color:"#8a9bc0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"4px 12px", cursor:"pointer", fontFamily:"'Lora',serif" }}>
                    ✕ Cancel
                  </button>
                )}
              </div>

              {editingId && (
                <div style={{ background:"rgba(255,179,71,0.08)", border:"1px solid rgba(255,179,71,0.3)", borderRadius:10, padding:"10px 14px", color:"#ffb347", fontSize:13, marginBottom:16 }}>
                  ✏️ Editing existing record. Correct the values below and click <strong>Update Attendance</strong>.
                </div>
              )}

              {submitted && (
                <div style={{ background:"rgba(201,168,76,0.12)", border:"1px solid rgba(201,168,76,0.4)", borderRadius:10, padding:"12px", textAlign:"center", color:"#c9a84c", marginBottom:16, fontSize:13 }}>
                  ✦ {editingId ? "Record updated" : "Attendance recorded"} successfully!
                </div>
              )}
              {error && (
                <div style={{ background:"rgba(220,60,60,0.1)", border:"1px solid rgba(220,60,60,0.35)", borderRadius:10, padding:"12px", color:"#f08080", fontSize:13, marginBottom:14 }}>
                  ⚠ {error}
                </div>
              )}

              {/* Date + Service */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#c9a84c" }}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date:e.target.value })}
                    style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${editingId?"rgba(255,179,71,0.4)":"rgba(201,168,76,0.3)"}`, borderRadius:8, padding:"10px 14px", color:"#e8d5a3", fontSize:14, fontFamily:"'Lora',serif", outline:"none", width:"100%" }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#c9a84c" }}>Service</label>
                  <select value={form.service} onChange={e => setForm({ ...form, service:e.target.value })}
                    style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${editingId?"rgba(255,179,71,0.4)":"rgba(201,168,76,0.3)"}`, borderRadius:8, padding:"10px 14px", color:"#e8d5a3", fontSize:14, fontFamily:"'Lora',serif", outline:"none", width:"100%" }}>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Count cards */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:18 }}>
                {[
                  { key:"male",     label:"Male",     icon:"👨", rgb:"100,160,255" },
                  { key:"female",   label:"Female",   icon:"👩", rgb:"255,140,180" },
                  { key:"children", label:"Children", icon:"🧒", rgb:"100,220,160" },
                ].map(({ key, label, icon, rgb }) => (
                  <div key={key} style={{ background:`rgba(${rgb},0.08)`, border:`1px solid rgba(${rgb},0.3)`, borderRadius:12, padding:"16px 14px" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:`rgba(${rgb},0.2)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginBottom:8 }}>{icon}</div>
                    <label style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:`rgb(${rgb})` }}>{label}</label>
                    <input type="number" min="0" placeholder="0" value={form[key]}
                      onChange={e => setForm({ ...form, [key]:e.target.value })}
                      style={{ display:"block", background:"transparent", border:"none", borderBottom:`2px solid rgba(${rgb},0.5)`, color:"#fff", fontSize:24, fontWeight:700, fontFamily:"'Lora',serif", width:"100%", outline:"none", padding:"6px 0", marginTop:6 }} />
                  </div>
                ))}
              </div>

              {(form.male || form.female || form.children) && (
                <div style={{ textAlign:"center", padding:"12px", marginBottom:16, background:"rgba(201,168,76,0.07)", borderRadius:8, fontSize:13, color:"#c9a84c" }}>
                  Total this entry:{" "}
                  <strong style={{ fontSize:20 }}>
                    {(Number(form.male)||0) + (Number(form.female)||0) + (Number(form.children)||0)}
                  </strong>{" "}in attendance
                </div>
              )}

              <button onClick={handleSubmit} disabled={saving}
                style={{ width:"100%", padding:"14px", background: saving ? "rgba(201,168,76,0.4)" : editingId ? "linear-gradient(135deg,#ffb347,#ffe0a0,#ffb347)" : "linear-gradient(135deg,#c9a84c,#e8d5a3,#c9a84c)", border:"none", borderRadius:10, color:"#0a1628", fontWeight:700, fontSize:15, fontFamily:"'Lora',serif", cursor: saving?"not-allowed":"pointer", letterSpacing:"0.05em" }}>
                {saving ? "Saving..." : editingId ? "✏️  Update Attendance" : "Submit Attendance"}
              </button>

              {/* Records list */}
              {loading ? (
                <p style={{ textAlign:"center", color:"#8a9bc0", fontSize:13, marginTop:24 }}>Loading records…</p>
              ) : fetchError ? (
                <p style={{ textAlign:"center", color:"#f08080", fontSize:13, marginTop:24 }}>{fetchError}</p>
              ) : records.length > 0 && (
                <div style={{ marginTop:28 }}>
                  <p style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#c9a84c", marginBottom:12, borderBottom:"1px solid rgba(201,168,76,0.15)", paddingBottom:10 }}>
                    Recent Entries
                  </p>
                  {records.slice(0, 8).map(r => (
                    <div key={r._id}
                      style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", padding:"12px", borderRadius:10, marginBottom:8, border:`1px solid ${editingId===r._id?"rgba(255,179,71,0.5)":"rgba(255,255,255,0.06)"}`, background: editingId===r._id?"rgba(255,179,71,0.07)":"rgba(255,255,255,0.02)", gap:12 }}>
                      <div>
                        <div style={{ fontSize:13, color:"#e8d5a3", fontWeight:600 }}>{r.service}</div>
                        <div style={{ fontSize:11, color:"#8a9bc0", marginTop:2 }}>
                          {new Date(r.date).toLocaleDateString("en-NG", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
                        </div>
                        <div style={{ display:"flex", gap:10, fontSize:12, color:"#8a9bc0", marginTop:5 }}>
                          <span>👨 {r.male}</span>
                          <span>👩 {r.female}</span>
                          <span>🧒 {r.children}</span>
                          <span style={{ color:"#c9a84c", fontWeight:700 }}>{r.male + r.female + r.children} total</span>
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <button onClick={() => handleEdit(r)} className="hov"
                          style={{ background:"rgba(201,168,76,0.12)", border:"1px solid rgba(201,168,76,0.3)", borderRadius:6, color:"#c9a84c", fontSize:11, padding:"5px 12px", cursor:"pointer", fontFamily:"'Lora',serif", whiteSpace:"nowrap" }}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(r._id)} className="hov"
                          style={{ background:"rgba(220,60,60,0.1)", border:"1px solid rgba(220,60,60,0.3)", borderRadius:6, color:"#f08080", fontSize:11, padding:"5px 12px", cursor:"pointer", fontFamily:"'Lora',serif", whiteSpace:"nowrap" }}>
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════ CHART TAB ════ */}
          {tab === "chart" && (
            <div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16, gap:8 }}>
                {yearOptions.map(y => (
                  <button key={y} onClick={() => setSelectedYear(y)}
                    style={{ padding:"6px 16px", borderRadius:20, border:`1px solid ${selectedYear===y?"#c9a84c":"rgba(201,168,76,0.2)"}`, background:selectedYear===y?"rgba(201,168,76,0.15)":"transparent", color:selectedYear===y?"#c9a84c":"#8a9bc0", cursor:"pointer", fontSize:12, fontFamily:"'Lora',serif" }}>
                    {y}
                  </button>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
                {[
                  { label:`Total ${selectedYear}`, val:grand,    color:"#c9a84c" },
                  { label:"Male",                  val:totals.m, color:"#64a0ff" },
                  { label:"Female",                val:totals.f, color:"#ff8cb4" },
                  { label:"Children",              val:totals.c, color:"#64dca0" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:12, padding:"16px 14px", textAlign:"center", borderTop:`3px solid ${color}` }}>
                    <div style={{ fontSize:26, fontWeight:800, color, fontFamily:"'Playfair Display',serif" }}>{val.toLocaleString()}</div>
                    <div style={{ fontSize:10, color:"#8a9bc0", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:4 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:16, padding:"24px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <p style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#c9a84c" }}>
                    Monthly Attendance — {selectedYear}
                  </p>
                  <div style={{ display:"flex", gap:6 }}>
                    {["bar","area"].map(t => (
                      <button key={t} onClick={() => setChartType(t)}
                        style={{ padding:"5px 14px", borderRadius:20, border:`1px solid ${chartType===t?"#c9a84c":"rgba(201,168,76,0.2)"}`, background:chartType===t?"rgba(201,168,76,0.15)":"transparent", color:chartType===t?"#c9a84c":"#8a9bc0", cursor:"pointer", fontSize:11, fontFamily:"'Lora',serif", textTransform:"capitalize" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <p style={{ textAlign:"center", color:"#8a9bc0", fontSize:13, padding:"40px 0" }}>Loading chart…</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    {chartType === "bar" ? (
                      <BarChart data={chartData} margin={{ left:-20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill:"#8a9bc0", fontSize:11 }} tickFormatter={v => v.slice(0,3)} />
                        <YAxis tick={{ fill:"#8a9bc0", fontSize:11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color:"#8a9bc0", fontSize:12, paddingTop:16 }} />
                        <Bar dataKey="Male"     fill="#64a0ff" radius={[4,4,0,0]} />
                        <Bar dataKey="Female"   fill="#ff8cb4" radius={[4,4,0,0]} />
                        <Bar dataKey="Children" fill="#64dca0" radius={[4,4,0,0]} />
                      </BarChart>
                    ) : (
                      <AreaChart data={chartData} margin={{ left:-20 }}>
                        <defs>
                          {[["male","#64a0ff"],["female","#ff8cb4"],["children","#64dca0"]].map(([id,c]) => (
                            <linearGradient key={id} id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill:"#8a9bc0", fontSize:11 }} tickFormatter={v => v.slice(0,3)} />
                        <YAxis tick={{ fill:"#8a9bc0", fontSize:11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color:"#8a9bc0", fontSize:12, paddingTop:16 }} />
                        <Area type="monotone" dataKey="Male"     stroke="#64a0ff" strokeWidth={2} fill="url(#g-male)"     dot={{ fill:"#64a0ff", r:3 }} />
                        <Area type="monotone" dataKey="Female"   stroke="#ff8cb4" strokeWidth={2} fill="url(#g-female)"   dot={{ fill:"#ff8cb4", r:3 }} />
                        <Area type="monotone" dataKey="Children" stroke="#64dca0" strokeWidth={2} fill="url(#g-children)" dot={{ fill:"#64dca0", r:3 }} />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                )}

                {!loading && records.length === 0 && (
                  <p style={{ textAlign:"center", color:"#8a9bc0", fontSize:13, marginTop:16 }}>
                    No records for {selectedYear}. Switch to <strong style={{ color:"#c9a84c" }}>Record Attendance</strong> to add entries.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
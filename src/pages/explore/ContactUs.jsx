import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, ArrowRight } from "lucide-react";

const API_URL = "https://backend-heritage-10.onrender.com";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Server error");
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Contact Error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Visit Us",
      value: "338, Sagamu Road, Beside MRS Filling Station, Opposite UBA Odogunyan, Ikorodu, Lagos",
      accent: "#F59E0B",
      bg: "#FFFBEB",
      border: "#FDE68A",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+234 905 915 6800",
      accent: "#2563EB",
      bg: "#EFF6FF",
      border: "#BFDBFE",
    },
    {
      icon: Mail,
      label: "Email Us",
      value: "hello@lordsheritagehouse.org",
      accent: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0",
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: "Mon – Fri: 9:00 AM – 5:00 PM",
      accent: "#7C3AED",
      bg: "#F5F3FF",
      border: "#DDD6FE",
    },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #0B1B3F 0%, #1E3A5F 55%, #0B2454 100%)",
        padding: "100px 24px 80px",
        position: "relative", overflow: "hidden"
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "radial-gradient(circle, #FFD700 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }} />
        {/* Gold glow */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 65%)"
        }} />
        {/* Vertical accent line */}
        <div style={{
          position: "absolute", left: "5%", top: "10%", bottom: "10%",
          width: "1px",
          background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.45), transparent)"
        }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "100px", padding: "7px 18px", marginBottom: "32px"
          }}>
            <Mail size={13} color="#F59E0B" />
            <span style={{
              color: "#FCD34D", fontSize: "12px", letterSpacing: "0.18em",
              textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700
            }}>
              We'd Love to Hear From You
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(44px, 8vw, 80px)", fontWeight: 700,
            color: "#FFFFFF", lineHeight: 1.08, marginBottom: "24px",
            letterSpacing: "-0.02em"
          }}>
            Get In<br />
            <span style={{ color: "#F59E0B" }}>Touch</span>
          </h1>

          <p style={{
            color: "#CBD5E1", fontSize: "clamp(17px, 2vw, 21px)",
            lineHeight: 1.8, fontFamily: "'Trebuchet MS', sans-serif",
            maxWidth: "520px", margin: 0
          }}>
            Have a question, a prayer request, or want to connect with a department?
            Our doors and hearts are always open.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ───────────────────────────────────── */}
      <section style={{ background: "#FFFFFF", padding: "72px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}>
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  background: item.bg, border: `1.5px solid ${item.border}`,
                  borderRadius: "20px", padding: "32px 28px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 16px 36px ${item.accent}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: `${item.accent}18`, border: `1px solid ${item.accent}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "20px"
                  }}>
                    <Icon size={22} color={item.accent} />
                  </div>
                  <p style={{
                    color: "#94A3B8", fontSize: "11px", letterSpacing: "0.2em",
                    textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif",
                    fontWeight: 700, marginBottom: "8px"
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    color: "#0F172A", fontSize: "15px", lineHeight: 1.65,
                    fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 500, margin: 0
                  }}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ─────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, #F0F7FF 0%, #F8FAFC 60%, #FFF7E6 100%)",
        padding: "80px 24px 96px"
      }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>

          {/* Section label */}
          <div style={{ marginBottom: "48px" }}>
            <p style={{
              color: "#D97706", fontSize: "12px", letterSpacing: "0.25em",
              textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif",
              fontWeight: 700, marginBottom: "12px"
            }}>Send a Message</p>
            <h2 style={{
              color: "#0B1B3F", fontSize: "clamp(30px, 4vw, 46px)",
              fontWeight: 700, lineHeight: 1.15, margin: 0
            }}>
              We'll get back to you<br />
              <span style={{ color: "#D97706" }}>within 24 hours</span>
            </h2>
          </div>

          {/* Card */}
          <div style={{
            background: "#FFFFFF", borderRadius: "28px",
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 24px 64px rgba(11,27,63,0.08)",
            overflow: "hidden"
          }}>

            {!submitted ? (
              <div style={{ padding: "56px 52px" }} className="contact-form-pad">
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="contact-form-grid">

                    {/* Full Name */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{
                        color: "#64748B", fontSize: "11px", letterSpacing: "0.18em",
                        textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700
                      }}>Full Name *</label>
                      <input
                        type="text" name="name" value={formData.name}
                        onChange={handleChange} required
                        placeholder="e.g. Adaeze Okafor"
                        style={{
                          padding: "16px 18px", borderRadius: "12px",
                          border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                          fontSize: "16px", color: "#0F172A", outline: "none",
                          fontFamily: "'Trebuchet MS', sans-serif",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#F59E0B"}
                        onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                      />
                    </div>

                    {/* Email */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{
                        color: "#64748B", fontSize: "11px", letterSpacing: "0.18em",
                        textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700
                      }}>Email Address *</label>
                      <input
                        type="email" name="email" value={formData.email}
                        onChange={handleChange} required
                        placeholder="you@example.com"
                        style={{
                          padding: "16px 18px", borderRadius: "12px",
                          border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                          fontSize: "16px", color: "#0F172A", outline: "none",
                          fontFamily: "'Trebuchet MS', sans-serif",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#F59E0B"}
                        onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                      />
                    </div>

                    {/* Phone — full width */}
                    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{
                        color: "#64748B", fontSize: "11px", letterSpacing: "0.18em",
                        textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700
                      }}>Phone Number</label>
                      <input
                        type="tel" name="phone" value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 000 000 0000"
                        style={{
                          padding: "16px 18px", borderRadius: "12px",
                          border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                          fontSize: "16px", color: "#0F172A", outline: "none",
                          fontFamily: "'Trebuchet MS', sans-serif",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#F59E0B"}
                        onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                      />
                    </div>

                    {/* Message — full width */}
                    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{
                        color: "#64748B", fontSize: "11px", letterSpacing: "0.18em",
                        textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700
                      }}>How Can We Help? *</label>
                      <textarea
                        name="message" value={formData.message}
                        onChange={handleChange} required rows={5}
                        placeholder="Share your question, prayer request, or message…"
                        style={{
                          padding: "16px 18px", borderRadius: "12px",
                          border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                          fontSize: "16px", color: "#0F172A", outline: "none",
                          fontFamily: "'Trebuchet MS', sans-serif",
                          resize: "vertical", lineHeight: 1.7,
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#F59E0B"}
                        onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                      />
                    </div>

                    {/* Submit */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          width: "100%", padding: "18px 32px",
                          background: loading ? "#94A3B8" : "#0B1B3F",
                          color: "#F59E0B", borderRadius: "14px", border: "none",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                          fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 800,
                          fontSize: "17px", letterSpacing: "0.04em", textTransform: "uppercase",
                          cursor: loading ? "not-allowed" : "pointer",
                          transition: "background 0.2s, transform 0.15s"
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#142A5A"; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#0B1B3F"; }}
                      >
                        {loading ? (
                          <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
                        ) : (
                          <><Send size={18} /> Send Message</>
                        )}
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            ) : (
              /* Success state */
              <div style={{
                padding: "80px 52px", textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center"
              }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  background: "#ECFDF5", border: "2px solid #A7F3D0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "28px"
                }}>
                  <CheckCircle size={40} color="#059669" />
                </div>
                <h3 style={{
                  color: "#0B1B3F", fontSize: "36px", fontWeight: 700,
                  marginBottom: "12px"
                }}>
                  Message Sent!
                </h3>
                <p style={{
                  color: "#64748B", fontSize: "18px", lineHeight: 1.75,
                  fontFamily: "'Trebuchet MS', sans-serif",
                  maxWidth: "380px", marginBottom: "36px"
                }}>
                  Thank you for reaching out. A member of our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    color: "#D97706", fontSize: "16px", fontWeight: 700,
                    fontFamily: "'Trebuchet MS', sans-serif",
                    background: "none", border: "none", cursor: "pointer"
                  }}
                >
                  Send another message <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MAP EMBED ─────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF", padding: "0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{
            borderRadius: "24px", overflow: "hidden",
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 8px 32px rgba(11,27,63,0.07)",
            height: "380px"
          }}>
            <iframe
              title="Lord's Heritage House Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.4!2d3.5!3d6.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMDAuMCJOIDPCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%" height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .contact-form-grid { grid-template-columns: 1fr !important; }
          .contact-form-pad { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
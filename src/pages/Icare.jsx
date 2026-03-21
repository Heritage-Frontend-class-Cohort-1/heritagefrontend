import React from "react";
import {
  Heart, User, Gift, Code, BookOpen,
  Shield, Stethoscope, Sprout, ChevronRight, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Data ─────────────────────────────────────────────────────── */

const programs = [
  {
    icon: Shield,
    title: "Emergency Support",
    description:
      "Immediate relief for families in crisis — financial aid, food parcels, and on-ground care deployed within 48 hours.",
    accent: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  {
    icon: Gift,
    title: "Food & Essentials",
    description:
      "Monthly distribution of food packs and daily necessities to registered beneficiaries across our community.",
    accent: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  {
    icon: User,
    title: "Counselling & Mentorship",
    description:
      "One-on-one spiritual and emotional support with trained counsellors. Growth tracks for individuals and families.",
    accent: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  {
    icon: Stethoscope,
    title: "Medical Assistance",
    description:
      "Regular medical screenings during church services, such as blood sugar testing and other basic health checks, to promote early detection and overall well-being within the congregation.",
    accent: "#DB2777",
    bg: "#FDF2F8",
    border: "#FBCFE8",
  },
  {
    icon: Sprout,
    title: "Community Empowerment",
    description:
      "Skills training, microfinance access, and education bursaries that build long-term self-sufficiency.",
    accent: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
];

const scholarships = [
  {
    tag: "JSS 1 Entry",
    amount: "₦40,000",
    detail: "For new students gaining admission into Junior Secondary Year 1.",
    index: "01",
  },
  {
    tag: "SS1 Entry",
    amount: "₦60,000",
    detail: "For students advancing into their first year of senior secondary school.",
    index: "02",
  },
  {
    tag: "University Admission",
    amount: "₦100,000",
    detail: "For members who secure a university or polytechnic admission offer.",
    index: "03",
  },
];

const curriculum = [
  "HTML5 & CSS3 fundamentals",
  "JavaScript & modern ES6+",
  "React.js — component-driven UIs",
  "Tailwind CSS & responsive design",
  "Git, GitHub & version control",
  "Deploying live projects to the web",
];

const programDetails = [
  { label: "Duration", value: "3 Months Intensive" },
  { label: "Format", value: "Project-based, hands-on" },
  { label: "Eligibility", value: "Youth members of the church" },
  { label: "Cost", value: "Fully church-sponsored" },
  { label: "Certificate", value: "Issued on completion" },
  { label: "Outcome", value: "Portfolio-ready developer" },
];

/* ─── Component ─────────────────────────────────────────────────── */

const ICare = () => {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Georgia', serif", backgroundColor: "#F8FAFC" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "80vh", display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #0B1B3F 0%, #1E3A5F 55%, #0B2454 100%)",
        position: "relative", overflow: "hidden"
      }}>
        {/* Subtle dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle, #FFD700 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }} />
        {/* Gold glow top-right */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 65%)"
        }} />
        {/* Thin gold vertical line */}
        <div style={{
          position: "absolute", left: "6%", top: "10%", bottom: "10%",
          width: "1px",
          background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.5), transparent)"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1152px", margin: "0 auto", padding: "96px 48px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)",
            borderRadius: "100px", padding: "8px 20px", marginBottom: "36px"
          }}>
            <Heart size={15} color="#F59E0B" />
            <span style={{
              color: "#FCD34D", fontSize: "13px",
              fontFamily: "'Trebuchet MS', sans-serif",
              letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700
            }}>
              iCare Welfare Ministry
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 700,
            color: "#FFFFFF", lineHeight: 1.05, marginBottom: "28px",
            letterSpacing: "-0.02em"
          }}>
            Compassion<br />
            <span style={{ color: "#F59E0B" }}>in Action</span>
          </h1>

          <p style={{
            color: "#CBD5E1", fontSize: "clamp(18px, 2.2vw, 22px)",
            maxWidth: "560px", lineHeight: 1.8,
            fontFamily: "'Trebuchet MS', sans-serif",
            marginBottom: "52px"
          }}>
            At iCare, we translate faith into tangible love — from emergency relief
            to education scholarships and tech empowerment. We meet people where they are.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/explore-heritage/contact-us" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "#F59E0B", color: "#0B1B3F",
              padding: "16px 32px", borderRadius: "10px",
              fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 800,
              fontSize: "16px", textDecoration: "none"
            }}>
              Get Support <ArrowRight size={17} />
            </Link>
            <a href="#programs" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              border: "1.5px solid rgba(255,255,255,0.3)", color: "#F1F5F9",
              padding: "16px 32px", borderRadius: "10px",
              fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 600,
              fontSize: "16px", textDecoration: "none"
            }}>
              Explore Programs
            </a>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────────────────────── */}
      <section id="programs" style={{ background: "#FFFFFF", padding: "96px 0" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 48px" }}>

          <div style={{ marginBottom: "64px" }}>
            <p style={{
              color: "#D97706", fontSize: "12px", letterSpacing: "0.25em",
              textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif",
              fontWeight: 700, marginBottom: "12px"
            }}>What We Do</p>
            <h2 style={{
              color: "#0B1B3F", fontSize: "clamp(34px, 5vw, 54px)",
              fontWeight: 700, lineHeight: 1.15, margin: 0
            }}>
              Our Care Programs
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {programs.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} style={{
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  borderRadius: "20px", padding: "40px 36px",
                  position: "relative", overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 20px 40px ${p.accent}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "14px",
                    background: `${p.accent}18`, border: `1px solid ${p.accent}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "22px"
                  }}>
                    <Icon size={24} color={p.accent} />
                  </div>

                  <h3 style={{
                    color: "#0B1B3F", fontSize: "20px", fontWeight: 700,
                    marginBottom: "12px"
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    color: "#475569", fontSize: "16px", lineHeight: 1.75,
                    fontFamily: "'Trebuchet MS', sans-serif", margin: 0
                  }}>
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CASH SCHOLARSHIP ─────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, #FFF7E6 0%, #FFFBF0 60%, #FEF3C7 100%)",
        padding: "96px 0", position: "relative", overflow: "hidden"
      }}>
        {/* Decorative rings */}
        <div style={{
          position: "absolute", bottom: "-160px", right: "-80px",
          width: "500px", height: "500px", borderRadius: "50%",
          border: "1.5px solid rgba(245,158,11,0.15)"
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", right: "-20px",
          width: "320px", height: "320px", borderRadius: "50%",
          border: "1.5px solid rgba(245,158,11,0.1)"
        }} />

        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>

          {/* Header row */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", gap: "32px",
            marginBottom: "64px", flexWrap: "wrap"
          }}>
            <div>
              <p style={{
                color: "#D97706", fontSize: "12px", letterSpacing: "0.25em",
                textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif",
                fontWeight: 700, marginBottom: "12px"
              }}>Education Investment</p>
              <h2 style={{
                color: "#0B1B3F", fontSize: "clamp(34px, 5vw, 54px)",
                fontWeight: 700, lineHeight: 1.15, margin: 0
              }}>
                Cash Scholarship<br />
                <span style={{ color: "#D97706" }}>Support</span>
              </h2>
            </div>
            <div style={{
              background: "#FFFFFF", border: "1.5px solid #FDE68A",
              borderRadius: "16px", padding: "20px 32px",
              textAlign: "center", boxShadow: "0 4px 20px rgba(245,158,11,0.12)"
            }}>
              <p style={{
                color: "#D97706", fontSize: "12px", letterSpacing: "0.15em",
                textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif",
                fontWeight: 700, margin: 0
              }}>Total Possible Award</p>
              <p style={{
                color: "#0B1B3F", fontSize: "40px", fontWeight: 800,
                margin: "6px 0 0", letterSpacing: "-0.03em"
              }}>₦200,000</p>
            </div>
          </div>

          {/* Tier cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {scholarships.map((s, i) => (
              <div key={i} style={{
                background: "#FFFFFF", borderRadius: "20px",
                border: "1.5px solid #FDE68A", overflow: "hidden",
                boxShadow: "0 4px 24px rgba(245,158,11,0.08)"
              }}>
                <div style={{ height: "5px", background: "linear-gradient(90deg, #F59E0B, #FCD34D)" }} />
                <div style={{ padding: "36px 32px" }}>
                  <span style={{
                    color: "rgba(217,119,6,0.2)", fontSize: "72px", fontWeight: 800,
                    lineHeight: 1, display: "block", marginBottom: "4px",
                    letterSpacing: "-0.04em"
                  }}>
                    {s.index}
                  </span>
                  <p style={{
                    color: "#92400E", fontSize: "12px", letterSpacing: "0.18em",
                    textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif",
                    fontWeight: 700, marginBottom: "10px"
                  }}>
                    {s.tag}
                  </p>
                  <p style={{
                    color: "#D97706", fontSize: "48px", fontWeight: 800,
                    letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "20px"
                  }}>
                    {s.amount}
                  </p>
                  <p style={{
                    color: "#64748B", fontSize: "16px", lineHeight: 1.7,
                    fontFamily: "'Trebuchet MS', sans-serif", margin: 0
                  }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            color: "#A16207", fontSize: "14px", marginTop: "32px",
            fontFamily: "'Trebuchet MS', sans-serif", textAlign: "center"
          }}>
            * Awarded to qualifying members of Lord's Heritage House.
            Visit the welfare desk for eligibility and application details.
          </p>
        </div>
      </section>

      {/* ── TECH SCHOLARSHIP ─────────────────────────────────────── */}
      <section style={{ background: "#F0F7FF", padding: "96px 0" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 48px" }}>

          <div style={{ marginBottom: "64px" }}>
            <p style={{
              color: "#2563EB", fontSize: "12px", letterSpacing: "0.25em",
              textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif",
              fontWeight: 700, marginBottom: "12px"
            }}>Tech Empowerment</p>
            <h2 style={{
              color: "#0B1B3F", fontSize: "clamp(34px, 5vw, 54px)",
              fontWeight: 700, lineHeight: 1.15, marginBottom: "20px"
            }}>
              Youth Frontend<br />
              <span style={{ color: "#2563EB" }}>Coding Scholarship</span>
            </h2>
            <p style={{
              color: "#475569", fontSize: "20px", maxWidth: "540px",
              lineHeight: 1.75, fontFamily: "'Trebuchet MS', sans-serif", margin: 0
            }}>
              A fully church-sponsored, 3-month intensive program turning
              Heritage youth into job-ready frontend developers.
            </p>
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }} className="icare-tech-grid">

            {/* Curriculum card */}
            <div style={{
              background: "#FFFFFF", borderRadius: "20px",
              border: "1.5px solid #BFDBFE", padding: "44px 40px",
              boxShadow: "0 4px 24px rgba(37,99,235,0.07)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "36px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: "#EFF6FF", border: "1.5px solid #BFDBFE",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Code size={22} color="#2563EB" />
                </div>
                <h3 style={{ color: "#0B1B3F", fontSize: "22px", fontWeight: 700, margin: 0 }}>
                  What You'll Learn
                </h3>
              </div>

              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "18px" }}>
                {curriculum.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <div style={{
                      marginTop: "4px", width: "22px", height: "22px", borderRadius: "50%",
                      background: "#EFF6FF", border: "1.5px solid #93C5FD",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <ChevronRight size={12} color="#2563EB" />
                    </div>
                    <span style={{
                      color: "#334155", fontSize: "17px", lineHeight: 1.65,
                      fontFamily: "'Trebuchet MS', sans-serif"
                    }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Duration highlight */}
              <div style={{
                background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
                borderRadius: "20px", padding: "36px 40px",
                display: "flex", alignItems: "center", gap: "24px"
              }}>
                <div style={{
                  width: "76px", height: "76px", borderRadius: "18px",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <BookOpen size={34} color="#FFFFFF" />
                </div>
                <div>
                  <p style={{
                    color: "#FFFFFF", fontSize: "56px", fontWeight: 800,
                    lineHeight: 1, margin: 0, letterSpacing: "-0.04em"
                  }}>3</p>
                  <p style={{
                    color: "#BFDBFE", fontSize: "17px",
                    fontFamily: "'Trebuchet MS', sans-serif", margin: "6px 0 0"
                  }}>
                    Months intensive training
                  </p>
                </div>
              </div>

              {/* Detail rows */}
              <div style={{
                background: "#FFFFFF", borderRadius: "20px",
                border: "1.5px solid #DBEAFE", overflow: "hidden",
                boxShadow: "0 4px 24px rgba(37,99,235,0.07)", flex: 1
              }}>
                {programDetails.map((d, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "18px 28px",
                    borderBottom: i < programDetails.length - 1
                      ? "1px solid #EFF6FF" : "none",
                    background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFF"
                  }}>
                    <span style={{
                      color: "#94A3B8", fontSize: "15px",
                      fontFamily: "'Trebuchet MS', sans-serif"
                    }}>
                      {d.label}
                    </span>
                    <span style={{
                      color: "#0B1B3F", fontSize: "16px", fontWeight: 700,
                      fontFamily: "'Trebuchet MS', sans-serif"
                    }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Apply CTA strip */}
          <div style={{
            marginTop: "40px", background: "#0B1B3F",
            borderRadius: "20px", padding: "44px 48px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "32px", flexWrap: "wrap"
          }}>
            <div>
              <h3 style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
                Ready to start your tech journey?
              </h3>
              <p style={{
                color: "#94A3B8", fontSize: "17px",
                fontFamily: "'Trebuchet MS', sans-serif", margin: 0
              }}>
                Speak to the iCare desk on Sunday or contact us to register your interest.
              </p>
            </div>
            <Link to="/explore-heritage/contact-us" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "#F59E0B", color: "#0B1B3F",
              padding: "16px 32px", borderRadius: "10px",
              fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 800,
              fontSize: "16px", textDecoration: "none", whiteSpace: "nowrap"
            }}>
              Apply Now <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ───────────────────────────────────────────── */}
      <section style={{
        background: "#0B1B3F",
        padding: "100px 24px",
        textAlign: "center",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)"
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto" }}>
          <Heart size={44} color="#F59E0B" style={{ margin: "0 auto 28px" }} />
          <h2 style={{
            color: "#FFFFFF", fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700, lineHeight: 1.2, marginBottom: "20px"
          }}>
            Partner With Us to Change Lives
          </h2>
          <p style={{
            color: "#94A3B8", fontSize: "19px", lineHeight: 1.8,
            fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "48px"
          }}>
            Your donations, time, and prayers fuel everything we do.
            Every naira given is a life touched.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/giving" style={{
              display: "inline-block",
              background: "#F59E0B", color: "#0B1B3F",
              padding: "18px 40px", borderRadius: "10px",
              fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 800,
              fontSize: "17px", textDecoration: "none"
            }}>
              Donate Now
            </Link>
            <button style={{
              background: "transparent", color: "#E2E8F0",
              padding: "18px 40px", borderRadius: "10px",
              border: "1.5px solid rgba(255,255,255,0.25)",
              fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 600,
              fontSize: "17px", cursor: "pointer"
            }}>
              Volunteer
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .icare-tech-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ICare;
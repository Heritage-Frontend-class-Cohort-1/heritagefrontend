import React, { useState, useRef } from "react";
import { Code, ArrowRight, CheckCircle, AlertCircle, Camera, X } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   Lords Heritage Tech Space — Cohort Application Form
   Styled to match the existing ICare page (navy / gold / blue,
   Georgia + Trebuchet MS pairing).

   Submits to: POST https://backend-heritage-7.onrender.com/api/tech-applications
   (multipart/form-data)
───────────────────────────────────────────────────────────────── */

const initialFormState = {
  fullName: "",
  age: "",
  gender: "",
  address: "",
  parish: "",
  membershipStatus: "",
  priorTechKnowledge: "",
  hasLaptop: "",
  availability: "",
  howHeard: "",
  aim: "",
  guardianName: "",
  guardianPhone: "",
  email: "",
  phone: "",
  reason: "",
  consent: false,
};

const TechApplicationForm = () => {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Photo state
  const [photoFile, setPhotoFile] = useState(null);       // File object
  const [photoPreview, setPhotoPreview] = useState(null); // base64 data URL
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Photo upload handler ─────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoError("");

    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setPhotoError("Only JPG or PNG photos are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Photo must be under 5MB. Please choose a smaller file.");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    if (!photoFile) return "Please upload a passport photo of the applicant.";
    if (!form.fullName.trim()) return "Please enter the applicant's full name.";
    if (!form.age || Number(form.age) < 5 || Number(form.age) > 25)
      return "Please enter a valid age (5–25).";
    if (!form.gender) return "Please select a gender.";
    if (!form.address.trim()) return "Please enter your home address.";
    if (!form.parish.trim()) return "Please enter your parish/church location.";
    if (!form.membershipStatus) return "Please select a membership status.";
    if (!form.hasLaptop) return "Please let us know if you have access to a laptop.";
    if (!form.guardianName.trim()) return "Please enter a parent or guardian's name.";
    if (!form.guardianPhone.trim()) return "Please enter a parent or guardian's phone number.";
    if (!form.phone.trim()) return "Please enter a phone number for the applicant.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email address.";
    if (!form.consent)
      return "Please confirm the commitment statement before submitting.";
    return null;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setErrorMsg(validationError);
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("photo", photoFile); // Multer field name: "photo"
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        "https://backend-heritage-7.onrender.com/api/tech-applications",
        {
          method: "POST",
          body: formData, // Do NOT set Content-Type — browser sets multipart boundary
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Submission failed. Please try again.");
      }

      setStatus("success");
      setForm(initialFormState);
      setPhotoFile(null);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  // ── Success screen ───────────────────────────────────────────
  if (status === "success") {
    return (
      <section style={sectionStyle}>
        <div style={{ maxWidth: "640px", margin: "0 auto", background: "#FFFFFF", borderRadius: "24px", border: "1.5px solid #E2E8F0", padding: "56px 48px", textAlign: "center", boxShadow: "0 12px 40px rgba(11,27,63,0.08)", fontFamily: "'Georgia', serif" }}>
          <div style={{ width: "76px", height: "76px", borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle size={36} color="#2563EB" />
          </div>
          <h2 style={{ color: "#0B1B3F", fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>
            Application received!
          </h2>
          <p style={{ color: "#475569", fontSize: "17px", lineHeight: 1.7, fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "28px" }}>
            Thank you for applying to the Lords Heritage Tech Space Frontend Development
            cohort. We'll review your application and reach out via phone or email with
            next steps.
          </p>
          <button onClick={() => setStatus("idle")} style={submitBtnStyle(false)}>
            Submit another application
          </button>
        </div>
      </section>
    );
  }

  // ── Main form ────────────────────────────────────────────────
  return (
    <section style={sectionStyle}>
      {/* Decorative background accents */}
      <div style={{ position: "absolute", top: "-120px", right: "-120px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-140px", left: "-100px", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 70%)" }} />

      <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Church banner */}
        <div style={{ background: "linear-gradient(135deg, #0B1B3F 0%, #1E3A5F 100%)", borderRadius: "18px", padding: "22px 28px", display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", boxShadow: "0 8px 24px rgba(11,27,63,0.18)" }}>
          <img
            src="/rccg-logo.png"
            alt="RCCG Lord's Heritage Parish logo"
            style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "contain", background: "#FFFFFF", padding: "4px", flexShrink: 0 }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div>
            <p style={{ color: "#FCD34D", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700, margin: 0 }}>
              RCCG Lord's Heritage Parish
            </p>
            <p style={{ color: "#FFFFFF", fontSize: "17px", fontWeight: 700, margin: "2px 0 0", fontFamily: "'Georgia', serif" }}>
              Lords Heritage Tech Space
            </p>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: "100px", padding: "8px 20px", marginBottom: "20px" }}>
            <Code size={16} color="#2563EB" />
            <span style={{ color: "#2563EB", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700 }}>
              Tech Space Cohort
            </span>
          </div>
          <h1 style={{ color: "#0B1B3F", fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 700, lineHeight: 1.2, marginBottom: "14px", fontFamily: "'Georgia', serif" }}>
            Frontend Development<br />
            <span style={{ color: "#2563EB" }}>Cohort Application</span>
          </h1>
          <p style={{ color: "#475569", fontSize: "17px", lineHeight: 1.7, fontFamily: "'Trebuchet MS', sans-serif", maxWidth: "520px", margin: "0 auto" }}>
            Fill out the form below to apply for the next Lords Heritage Tech Space
            frontend development cohort. Spaces are limited.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          style={{ background: "#FFFFFF", borderRadius: "24px", border: "1.5px solid #E2E8F0", padding: "44px 40px", boxShadow: "0 12px 40px rgba(11,27,63,0.08)", display: "flex", flexDirection: "column", gap: "22px" }}
        >

          {/* ── PASSPORT PHOTO ── */}
          <SectionHeading>Passport Photo</SectionHeading>

          <div>
            <label style={labelStyle}>
              Applicant passport photo{" "}
              <span style={{ color: "#94A3B8", fontWeight: 400 }}>(clear headshot, well-lit)</span>
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />

            {/* Upload area */}
            {!photoPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #BFDBFE",
                  borderRadius: "14px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  background: "#F8FAFF",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.background = "#EFF6FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#BFDBFE"; e.currentTarget.style.background = "#F8FAFF"; }}
              >
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Camera size={24} color="#2563EB" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#2563EB", fontWeight: 700, fontSize: "15px", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "4px" }}>
                    Click to upload photo
                  </p>
                  <p style={{ color: "#94A3B8", fontSize: "13px", fontFamily: "'Trebuchet MS', sans-serif" }}>
                    JPG or PNG · Max 5MB · Passport-style headshot
                  </p>
                </div>
              </div>
            ) : (
              /* Preview */
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", background: "#F8FAFF", border: "1.5px solid #BFDBFE", borderRadius: "14px", padding: "20px" }}>
                <img
                  src={photoPreview}
                  alt="Passport preview"
                  style={{ width: "90px", height: "110px", objectFit: "cover", borderRadius: "10px", border: "2px solid #DBEAFE", flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#0B1B3F", fontWeight: 700, fontSize: "14px", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "4px" }}>
                    Photo selected
                  </p>
                  <p style={{ color: "#64748B", fontSize: "13px", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "14px", wordBreak: "break-all" }}>
                    {photoFile?.name}
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: "8px", padding: "7px 14px", color: "#2563EB", fontSize: "13px", fontWeight: 700, fontFamily: "'Trebuchet MS', sans-serif", cursor: "pointer" }}
                    >
                      Change photo
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "8px", padding: "7px 10px", color: "#B91C1C", fontSize: "13px", fontWeight: 700, fontFamily: "'Trebuchet MS', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <X size={13} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {photoError && (
              <p style={{ color: "#B91C1C", fontSize: "13px", fontFamily: "'Trebuchet MS', sans-serif", marginTop: "6px" }}>
                {photoError}
              </p>
            )}
          </div>

          {/* ── PERSONAL DETAILS ── */}
          <SectionHeading>Personal Details</SectionHeading>

          <Field label="Full name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Tobi Adeyemi" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} placeholder="e.g. 14" />
            <div>
              <label style={labelStyle} htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select an option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* ── CHURCH INFORMATION ── */}
          <SectionHeading>Church Information</SectionHeading>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Field label="Home address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. 12 Ojo Street, Ikorodu, Lagos" />
            <Field label="Parish/church location" name="parish" value={form.parish} onChange={handleChange} placeholder="e.g. RCCG Lord's Heritage Parish, Ikorodu" />
          </div>

          <div>
            <label style={labelStyle} htmlFor="membershipStatus">Membership status</label>
            <select id="membershipStatus" name="membershipStatus" value={form.membershipStatus} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select an option</option>
              <option value="member">I'm a member of this parish</option>
              <option value="other-parish">I'm a member of another RCCG parish</option>
              <option value="other-church">I attend a different church</option>
              <option value="not-attending">I don't currently attend a church</option>
            </select>
          </div>

          {/* ── PROGRAM READINESS ── */}
          <SectionHeading>Program Readiness</SectionHeading>

          <div>
            <label style={labelStyle} htmlFor="hasLaptop">Do you have access to a laptop?</label>
            <select id="hasLaptop" name="hasLaptop" value={form.hasLaptop} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select an option</option>
              <option value="yes">Yes, I have my own laptop</option>
              <option value="shared">I can use a shared/family laptop</option>
              <option value="no">No, I don't have access to one</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Any prior knowledge of tech/coding?</label>
            <textarea name="priorTechKnowledge" value={form.priorTechKnowledge} onChange={handleChange} placeholder="e.g. None, or briefly describe what you've learned/used before (HTML, Scratch, computer basics, etc.)" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div>
            <label style={labelStyle}>What's your availability for the cohort?</label>
            <textarea name="availability" value={form.availability} onChange={handleChange} placeholder="e.g. Available weekdays after school, or Saturdays only" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="howHeard">How did you hear about this program?</label>
            <select id="howHeard" name="howHeard" value={form.howHeard} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select an option</option>
              <option value="flyer">Flyer/poster</option>
              <option value="church-announcement">Church announcement</option>
              <option value="friend-family">A friend or family member</option>
              <option value="social-media">Social media</option>
              <option value="church-website">Church website</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>What do you hope to do after completing this program?</label>
            <textarea name="aim" value={form.aim} onChange={handleChange} placeholder="e.g. Build my own websites, get a tech job/internship, freelance, further studies in tech" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* ── CONTACT & COMMITMENT ── */}
          <SectionHeading>Contact &amp; Commitment</SectionHeading>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Field label="Parent/guardian name" name="guardianName" value={form.guardianName} onChange={handleChange} placeholder="e.g. Mrs. Adeyemi" />
            <Field label="Parent/guardian phone" name="guardianPhone" type="tel" value={form.guardianPhone} onChange={handleChange} placeholder="e.g. 080xxxxxxxx" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Field label="Applicant phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="e.g. 080xxxxxxxx" />
            <Field label="Email address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. name@example.com" />
          </div>

          <div>
            <label style={labelStyle}>Why do you want to join this cohort?</label>
            <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Tell us a little about yourself and why you're interested in learning frontend development." rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Consent */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#F8FAFF", border: "1.5px solid #DBEAFE", borderRadius: "10px", padding: "16px 18px" }}>
            <input type="checkbox" id="consent" name="consent" checked={form.consent} onChange={handleChange} style={{ marginTop: "4px", width: "18px", height: "18px", flexShrink: 0, cursor: "pointer" }} />
            <label htmlFor="consent" style={{ color: "#334155", fontSize: "15px", lineHeight: 1.6, fontFamily: "'Trebuchet MS', sans-serif", cursor: "pointer" }}>
              I confirm that I am ready and willing to commit my time to this program,
              and I understand that it requires consistent attendance and effort for
              the full <strong>3-month training period</strong>.
            </label>
          </div>

          {/* Error */}
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "10px", padding: "12px 16px", color: "#B91C1C", fontSize: "14px", fontFamily: "'Trebuchet MS', sans-serif" }}>
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={status === "submitting"} style={submitBtnStyle(status === "submitting")}>
            {status === "submitting" ? "Submitting..." : "Submit application"}
            {status !== "submitting" && <ArrowRight size={17} />}
          </button>
        </form>
      </div>
    </section>
  );
};

/* ─── Shared styles ───────────────────────────────────────────── */

const sectionStyle = {
  background: "linear-gradient(160deg, #F0F7FF 0%, #FFFBF0 55%, #FFF7E6 100%)",
  padding: "72px 24px 96px",
  fontFamily: "'Georgia', serif",
  position: "relative",
  overflow: "hidden",
};

const labelStyle = {
  display: "block",
  color: "#0B1B3F",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "'Trebuchet MS', sans-serif",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  border: "1.5px solid #DBEAFE",
  borderRadius: "10px",
  padding: "12px 14px",
  fontSize: "15px",
  color: "#0B1B3F",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Trebuchet MS', sans-serif",
};

const submitBtnStyle = (disabled) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  background: disabled ? "#93C5FD" : "#2563EB",
  color: "#FFFFFF",
  padding: "16px 32px",
  borderRadius: "10px",
  border: "none",
  fontFamily: "'Trebuchet MS', sans-serif",
  fontWeight: 800,
  fontSize: "16px",
  cursor: disabled ? "not-allowed" : "pointer",
  marginTop: "8px",
});

const SectionHeading = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
    <span style={{ color: "#2563EB", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 800, whiteSpace: "nowrap" }}>
      {children}
    </span>
    <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
  </div>
);

const Field = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div>
    <label style={labelStyle} htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
      onBlur={(e) => (e.target.style.borderColor = "#DBEAFE")}
    />
  </div>
);

export default TechApplicationForm;
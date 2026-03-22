import { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  deepNavy: "#0D2B52",
  gold: "#C9A96E",
  goldHover: "#b89a63",
};

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.598-4.236M6.8 6.8A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411M3 3l18 18" />
  </svg>
);

// ─── Forgot Password Modal ────────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "https://backend-heritage-7.onrender.com/api/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        setStep("sent");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" aria-label="Close">✕</button>

        {step === "email" ? (
          <>
            <h3 className="text-2xl font-bold mb-2 text-center" style={{ color: colors.deepNavy }}>Forgot Password</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Enter your admin email and we'll send you a reset link.</p>
            {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleSend} className="space-y-4">
              <input
                type="email" placeholder="Email Address" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-lg font-semibold transition duration-300"
                style={{ backgroundColor: colors.gold, color: colors.deepNavy, opacity: loading ? 0.7 : 1 }}
              >
                {loading && <span className="loader w-5 h-5 rounded-full animate-spin" />}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: "#f0f9f0" }}>✉️</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.deepNavy }}>Check your inbox</h3>
            <p className="text-gray-500 text-sm mb-6">
              A password reset link has been sent to{" "}
              <span className="font-medium text-gray-700">{email}</span>. Check your spam folder if you don't see it.
            </p>
            <button onClick={onClose} className="w-full py-3 rounded-lg font-semibold transition duration-300" style={{ backgroundColor: colors.gold, color: colors.deepNavy }}>Done</button>
          </div>
        )}
        <style>{`.loader { border: 2px solid transparent; border-top-color: #0D2B52; border-bottom-color: #0D2B52; }`}</style>
      </div>
    </div>
  );
};

// ─── Pending Approval Screen ──────────────────────────────────────────────────
const PendingApprovalScreen = ({ name, onBackToLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-amber-50">
    <div className="bg-white rounded-2xl shadow-xl p-10 md:p-14 border border-gray-200 w-full max-w-md text-center">
      {/* Animated clock icon */}
      <div
        className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ backgroundColor: "#FEF9EE", border: `3px solid ${colors.gold}` }}
      >
        ⏳
      </div>

      <h2 className="text-2xl font-bold mb-3" style={{ color: colors.deepNavy }}>
        Account Pending Approval
      </h2>

      <p className="text-gray-500 text-sm leading-relaxed mb-2">
        Hi <span className="font-semibold text-gray-700">{name || "there"}</span>, your admin account has been created successfully.
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        A <span className="font-semibold" style={{ color: colors.deepNavy }}>Super Admin</span> needs to approve your account before you can access the dashboard. You'll be able to log in once approved.
      </p>

      {/* Status pill */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
        style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
        Awaiting Super Admin Approval
      </div>

      <button
        onClick={onBackToLogin}
        className="w-full py-4 rounded-lg font-semibold transition duration-300 border-2"
        style={{ borderColor: colors.gold, color: colors.deepNavy, backgroundColor: "transparent" }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FEF9EE"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
      >
        Back to Login
      </button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminAuth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // After successful signup, show the pending screen
  const [pendingName, setPendingName] = useState(null);
  const navigate = useNavigate();

  // If signup was successful, show the pending screen
  if (pendingName !== null) {
    return (
      <PendingApprovalScreen
        name={pendingName}
        onBackToLogin={() => {
          setPendingName(null);
          setIsSignup(false);
          setFormData({ name: "", email: "", password: "" });
        }}
      />
    );
  }

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const url = isSignup
        ? "https://backend-heritage-7.onrender.com/api/users/signup"
        : "https://backend-heritage-7.onrender.com/api/users/signin";

      const bodyData = isSignup
        ? { ...formData, role: "admin" }
        : { email: formData.email, password: formData.password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        // ── Pending approval check on LOGIN ──
        // Adjust the message string to match whatever your backend returns
        const msg = (data.message || "").toLowerCase();
        if (msg.includes("pending") || msg.includes("not approved") || msg.includes("awaiting")) {
          setError("Your account is pending approval by a Super Admin. Please check back later.");
          return;
        }

        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map((err) => err.msg).join(", "));
        } else {
          setError(data.message || "Something went wrong. Please try again.");
        }
        return;
      }

      if (isSignup) {
        // ── Show pending screen after successful signup ──
        setPendingName(formData.name);
        return;
      }

      // ── Successful login ──
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminName", data.user.name);
      localStorage.setItem("adminEmail", data.user.email);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to connect to the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.deepNavy }}>
          {isSignup ? "Admin Signup" : "Admin Login"}
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {isSignup && (
            <input
              type="text" name="name" placeholder="Full Name"
              value={formData.name} onChange={handleChange} required
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          )}

          <input
            type="email" name="email" placeholder="Email Address"
            value={formData.email} onChange={handleChange} required
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} name="password" placeholder="Password"
              value={formData.password} onChange={handleChange} required
              className="w-full px-5 py-4 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
            <button
              type="button" onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {!isSignup && (
            <div className="text-right -mt-3">
              <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit" disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-lg font-semibold transition duration-300"
            style={{ backgroundColor: colors.gold, color: colors.deepNavy, opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting && <span className="loader w-5 h-5 rounded-full animate-spin" />}
            {isSubmitting ? (isSignup ? "Signing up..." : "Logging in...") : (isSignup ? "Sign Up" : "Login")}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={toggleForm}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

        <style>{`.loader { border: 2px solid transparent; border-top-color: #0D2B52; border-bottom-color: #0D2B52; }`}</style>
      </form>
    </div>
  );
};

export default AdminAuth;
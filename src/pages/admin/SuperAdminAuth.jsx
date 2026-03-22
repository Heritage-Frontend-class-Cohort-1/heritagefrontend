import { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  deepNavy: "#0D2B52",
  navyLight: "#1a3f6f",
  gold: "#C9A96E",
  goldLight: "#f5e6cc",
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

// Crown icon for super admin branding
const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M3 17l2-7 4 4 3-8 3 8 4-4 2 7H3z" />
  </svg>
);

const SuperAdminAuth = () => {
  const [isSignup, setIsSignup] = useState(false); // default to login since super admin is usually pre-existing
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
        ? { ...formData, role: "superadmin" }
        : { email: formData.email, password: formData.password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map((err) => err.msg).join(", "));
        } else {
          setError(data.message || "Something went wrong. Please try again.");
        }
        return;
      }

      // Verify the returned role is actually superadmin
      if (data.user?.role !== "superadmin") {
        setError("Access denied. This portal is for Super Admins only.");
        return;
      }

      localStorage.setItem("superAdminToken", data.token);
      localStorage.setItem("superAdminName", data.user.name);
      localStorage.setItem("superAdminEmail", data.user.email);

      navigate("/superadmin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to connect to the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: colors.deepNavy }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large faint circle top-right */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{ backgroundColor: colors.gold }}
        />
        {/* Small circle bottom-left */}
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: colors.gold }}
        />
        {/* Thin horizontal line accent */}
        <div
          className="absolute top-1/2 left-0 right-0 h-px opacity-10"
          style={{ backgroundColor: colors.gold }}
        />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Header badge */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ backgroundColor: colors.gold, color: colors.deepNavy }}
          >
            <CrownIcon />
          </div>
          <h1 className="text-white text-sm font-semibold tracking-[0.25em] uppercase opacity-70">
            Heritage Church
          </h1>
          <h2
            className="text-2xl font-bold tracking-wide mt-1"
            style={{ color: colors.gold }}
          >
            Super Admin Portal
          </h2>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            {isSignup ? "Create Super Admin Account" : "Welcome back"}
          </h3>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-400/30">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text" name="name" placeholder="Your full name"
                  value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3.5 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = colors.gold}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>
            )}

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email" name="email" placeholder="admin@heritage.com"
                value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3.5 rounded-lg text-white placeholder-white/30 focus:outline-none transition"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onFocus={e => e.currentTarget.style.borderColor = colors.gold}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                  value={formData.password} onChange={handleChange} required
                  className="w-full px-4 py-3.5 pr-12 rounded-lg text-white placeholder-white/30 focus:outline-none transition"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = colors.gold}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                />
                <button
                  type="button" onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-lg font-bold text-sm tracking-wide transition duration-300 mt-2"
              style={{
                backgroundColor: colors.gold,
                color: colors.deepNavy,
                opacity: isSubmitting ? 0.75 : 1,
              }}
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.backgroundColor = "#b89a63")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = colors.gold)}
            >
              {isSubmitting && (
                <span
                  className="w-4 h-4 rounded-full animate-spin"
                  style={{ border: `2px solid ${colors.deepNavy}`, borderTopColor: "transparent" }}
                />
              )}
              {isSubmitting
                ? isSignup ? "Creating account..." : "Signing in..."
                : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-white/40 text-sm">
            {isSignup ? "Already have an account?" : "Need to create a super admin account?"}{" "}
            <span
              className="cursor-pointer transition"
              style={{ color: colors.gold }}
              onClick={toggleForm}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-xs mt-6">
          Restricted access — Super Admins only
        </p>
      </div>
    </div>
  );
};

export default SuperAdminAuth;
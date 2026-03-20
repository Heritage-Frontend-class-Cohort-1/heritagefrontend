import { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  deepNavy: "#0D2B52",
  gold: "#C9A96E",
  goldHover: "#b89a63",
};

// Eye icons (inline SVG to avoid extra deps)
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.598-4.236M6.8 6.8A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411M3 3l18 18" />
  </svg>
);

// ─── Forgot Password Modal ────────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState("email"); // "email" | "sent"
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
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Card — stop clicks bubbling to backdrop */}
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          ✕
        </button>

        {step === "email" ? (
          <>
            <h3
              className="text-2xl font-bold mb-2 text-center"
              style={{ color: colors.deepNavy }}
            >
              Forgot Password
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Enter your admin email and we'll send you a reset link.
            </p>

            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-lg font-semibold transition duration-300"
                style={{
                  backgroundColor: colors.gold,
                  color: colors.deepNavy,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading && (
                  <span className="loader border-t-2 border-b-2 border-deepNavy w-5 h-5 rounded-full animate-spin" />
                )}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          // Success state
          <div className="text-center py-4">
            <div
              className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: "#f0f9f0" }}
            >
              ✉️
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: colors.deepNavy }}
            >
              Check your inbox
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              A password reset link has been sent to{" "}
              <span className="font-medium text-gray-700">{email}</span>. Check
              your spam folder if you don't see it.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg font-semibold transition duration-300"
              style={{ backgroundColor: colors.gold, color: colors.deepNavy }}
            >
              Done
            </button>
          </div>
        )}

        <style>{`
          .loader { border-left-color: transparent; border-right-color: transparent; }
        `}</style>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminAuth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
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
        ? { ...formData, role: "admin" }
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
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

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
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: colors.deepNavy }}
        >
          {isSignup ? "Admin Signup" : "Admin Login"}
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="space-y-6">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />

          {/* Password field with show/hide toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Forgot password link — only visible on login */}
          {!isSignup && (
            <div className="text-right -mt-3">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-lg font-semibold transition duration-300"
            style={{
              backgroundColor: colors.gold,
              color: colors.deepNavy,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting && (
              <span className="loader border-t-2 border-b-2 border-deepNavy w-5 h-5 rounded-full animate-spin" />
            )}
            {isSubmitting
              ? isSignup
                ? "Signing up..."
                : "Logging in..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={toggleForm}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

        <style>{`
          .loader { border-left-color: transparent; border-right-color: transparent; }
        `}</style>
      </form>
    </div>
  );
};

export default AdminAuth;
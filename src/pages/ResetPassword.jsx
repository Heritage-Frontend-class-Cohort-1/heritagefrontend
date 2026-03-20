import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const colors = {
  deepNavy: "#0D2B52",
  gold: "#C9A96E",
  goldHover: "#b89a63",
};

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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://backend-heritage-7.onrender.com/api/users/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 w-full max-w-md">

        {success ? (
          // ── Success state ──
          <div className="text-center py-4">
            <div
              className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: "#f0f9f0" }}
            >
              ✅
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: colors.deepNavy }}
            >
              Password Reset!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/Admin/login")}
              className="w-full py-4 rounded-lg font-semibold transition duration-300"
              style={{ backgroundColor: colors.gold, color: colors.deepNavy }}
            >
              Go to Login
            </button>
          </div>
        ) : (
          // ── Form state ──
          <>
            <h2
              className="text-3xl font-bold mb-2 text-center"
              style={{ color: colors.deepNavy }}
            >
              Reset Password
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Enter your new password below.
            </p>

            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <style>{`
          .loader { border-left-color: transparent; border-right-color: transparent; }
        `}</style>
      </div>
    </div>
  );
};

export default ResetPassword;
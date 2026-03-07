import { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  deepNavy: "#0D2B52",
  gold: "#C9A96E",
  goldHover: "#b89a63",
};

const AdminAuth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ name: "", email: "", password: "" });
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
        ? "https://backend-heritage-6.onrender.com/api/users/signup"
        : "https://backend-heritage-6.onrender.com/api/users/signin";

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
          setError(data.errors.map(err => err.msg).join(", "));
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />

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
              <span className="loader border-t-2 border-b-2 border-deepNavy w-5 h-5 rounded-full animate-spin"></span>
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

        {/* Spinner CSS */}
        <style>{`
          .loader {
            border-left-color: transparent;
            border-right-color: transparent;
          }
        `}</style>
      </form>
    </div>
  );
};

export default AdminAuth;
import { useState } from "react";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const PrayerRequestForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Use environment variable for backend
  const API_URL = import.meta.env.VITE_API_URL || "https://backend-heritage-6.onrender.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/prayers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.secondaryNavy }}>
      <div className="max-w-xl w-full p-8 rounded-2xl shadow-xl" style={{ backgroundColor: colors.softCream }}>
        
        {/* Header */}
        <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: colors.deepNavy }}>
          Prayer Request
        </h1>
        <p className="mb-6 text-center text-gray-700">
          Share your prayer request. Our prayer team will stand with you in faith and confidentiality.
        </p>

        {/* Error message */}
        {error && (
          <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 text-center">{error}</div>
        )}

        {/* Form or Thank You */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded border border-gray-300"
              style={{ backgroundColor: colors.offWhite }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300"
              style={{ backgroundColor: colors.offWhite }}
            />
            <textarea
              name="message"
              placeholder="Write your prayer request here..."
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full p-3 rounded border border-gray-300"
              style={{ backgroundColor: colors.offWhite }}
            />
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110"}`}
              style={{ backgroundColor: colors.deepNavy }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Prayer Request"}
            </button>
          </form>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.deepNavy }}>
              Thank you!
            </h2>
            <p style={{ color: colors.deepNavy }}>
              Your prayer request has been received. Someone from our prayer team will lift it up in prayer and follow up if needed.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2 rounded-lg font-semibold text-white hover:brightness-110"
              style={{ backgroundColor: colors.deepNavy }}
            >
              Submit Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestForm;
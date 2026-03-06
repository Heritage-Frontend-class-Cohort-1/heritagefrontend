import { useState } from "react";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const PrayerRequestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use your deployed backend URL directly
  const BACKEND_URL = "https://backend-heritage-6.onrender.com"; // <-- replace with your Render backend

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/prayers`, {
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
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.secondaryNavy }}
    >
      <div
        className="max-w-xl w-full p-6 shadow-xl rounded-2xl"
        style={{ backgroundColor: colors.softCream }}
      >
        {/* Declaration Section */}
        <div
          className="mb-6 p-6 rounded-lg"
          style={{ backgroundColor: colors.gold }}
        >
          <h2
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: colors.deepNavy }}
          >
            SHOUT HALLELUJAH!
          </h2>

          <p className="leading-relaxed text-justify mb-4" style={{ color: colors.deepNavy }}>
            I decree and declare, I am lifted from the ash heap to a place of honor, for
            “He raises the poor from the dust and lifts the needy from the ash heap; He seats them with princes and has them inherit a throne of honor” (1 Samuel 2:8).
          </p>

          <p className="leading-relaxed text-justify mb-4" style={{ color: colors.deepNavy }}>
            I am positioned according to God’s perfect plan, for
            “God arranged the members in the body, each one of them, as He chose” (1 Corinthians 12:18).
          </p>

          <p className="leading-relaxed text-justify mb-4" style={{ color: colors.deepNavy }}>
            I walk through open doors of divine opportunity, for
            “I have placed before you an open door that no one can shut” (Revelation 3:8).
          </p>

          <p className="leading-relaxed text-justify mb-4" style={{ color: colors.deepNavy }}>
            I arise and shine into a season of landmark testimonies, for
            “Arise, shine, for your light has come, and the glory of the Lord has risen upon you” (Isaiah 60:1).
          </p>

          <p className="font-semibold text-center" style={{ color: colors.deepNavy }}>
            So shall it be, and so I declare—my testimony is changing, my season is shifting, and my destiny is secured in Christ!
          </p>
        </div>

        {!submitted ? (
          <>
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: colors.deepNavy }}
            >
              Prayer Request
            </h2>

            <p className="mb-6 text-center" style={{ color: colors.deepNavy }}>
              Share your prayer request. Our prayer team will stand with you in faith and confidentiality.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <textarea
                name="message"
                placeholder="Write your prayer request here..."
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: colors.deepNavy,
                  color: colors.gold,
                }}
              >
                {loading ? "Submitting..." : "Submit Prayer Request"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: colors.deepNavy }}
            >
              Thank you!
            </h3>
            <p style={{ color: colors.deepNavy }}>
              Your prayer request has been received. Someone from our prayer team will lift it up in prayer and follow up if needed.
            </p>
          </div>
        )}

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default PrayerRequestForm;
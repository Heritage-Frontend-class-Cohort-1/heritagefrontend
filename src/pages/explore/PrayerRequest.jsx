import { useState } from "react";
import { prayerService } from "../../utils/api"; // assuming submitPrayerRequest comes from here

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await prayerService.submitPrayerRequest(formData); // assuming this is the method

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
      className="min-h-screen flex items-center justify-center p-6 md:p-12"
      style={{ backgroundColor: colors.secondaryNavy }}
    >
      <div
        className="max-w-2xl w-full bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-gold/30"
        style={{ backgroundColor: colors.softCream }}
      >
        {/* Declaration Section - with subtle gradient overlay */}
        <div
          className="relative p-8 md:p-10"
          style={{
            background: `linear-gradient(135deg, ${colors.gold} 0%, #f7e8b0 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/40 to-transparent opacity-50 pointer-events-none"></div>
          
          <h2
            className="text-3xl md:text-4xl font-bold mb-6 text-center relative z-10"
            style={{ color: colors.deepNavy }}
          >
            SHOUT HALLELUJAH!
          </h2>

          <div className="space-y-5 text-justify relative z-10 leading-relaxed text-lg">
            <p style={{ color: colors.deepNavy }}>
              I decree and declare, I am lifted from the ash heap to a place of honor...
            </p>
            <p style={{ color: colors.deepNavy }}>
              I am positioned according to God’s perfect plan...
            </p>
            <p style={{ color: colors.deepNavy }}>
              I walk through open doors of divine opportunity...
            </p>
            <p style={{ color: colors.deepNavy }}>
              I arise and shine into a season of landmark testimonies...
            </p>
            <p className="font-bold text-center mt-6 text-xl" style={{ color: colors.deepNavy }}>
              So shall it be, and so I declare—my testimony is changing! Amen.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          {!submitted ? (
            <>
              <h2
                className="text-3xl font-bold mb-3 text-center"
                style={{ color: colors.deepNavy }}
              >
                Prayer Request
              </h2>

              <p className="mb-8 text-center text-lg" style={{ color: colors.deepNavy }}>
                Share your heart with us. Our prayer team will stand with you in faith.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl border border-gold/50 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all duration-200 text-lg"
                  style={{ backgroundColor: colors.offWhite }}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gold/50 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all duration-200 text-lg"
                  style={{ backgroundColor: colors.offWhite }}
                />

                <textarea
                  name="message"
                  placeholder="Write your prayer request here... *"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  className="w-full p-4 rounded-xl border border-gold/50 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition-all duration-200 resize-none text-lg"
                  style={{ backgroundColor: colors.offWhite }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.deepNavy,
                    color: colors.gold,
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-gold" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Prayer Request"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl mb-4">🙏✨</div>
              <h3
                className="text-3xl font-bold"
                style={{ color: colors.deepNavy }}
              >
                Thank You!
              </h3>
              <p className="text-xl" style={{ color: colors.deepNavy }}>
                Your prayer request has been received with love.<br />
                We are standing in faith with you.
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-600 mt-6 text-center font-medium text-lg">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestForm;
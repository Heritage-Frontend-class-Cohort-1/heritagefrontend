import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const BASE_URL = "https://backend-heritage-1.onrender.com";

const Testimony = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    content: "",
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);

  // Fetch testimonies
  const fetchTestimonies = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/testimonies?publicOnly=true`);
      const data = await res.json();
      if (res.ok) {
        setTestimonies(data.data || []);
      } else {
        console.error("Failed to fetch testimonies:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch testimonies:", err);
    }
  };

  useEffect(() => {
    fetchTestimonies();
    const interval = setInterval(fetchTestimonies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/testimonies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit testimony");

      alert("Testimony submitted successfully!");
      setFormData({
        name: "",
        email: "",
        title: "",
        content: "",
        isPublic: false,
      });
      fetchTestimonies();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit testimony");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ backgroundColor: colors.secondaryNavy }}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.gold }}>
            TESTIMONIES
          </h1>
          <p className="text-lg" style={{ color: colors.softCream }}>
            “We overcome by the blood of the Lamb and the word of our testimony”
          </p>
          <p style={{ color: colors.gold }}>Revelation 12:11</p>
        </div>

        {/* FORM */}
        <div
          className="max-w-3xl mx-auto p-8 rounded-2xl shadow-2xl mb-20"
          style={{ backgroundColor: colors.softCream }}
        >
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: colors.deepNavy }}
          >
            Share Your Testimony
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Your Full Name"
              required
              className="p-3 rounded-md border"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email (optional)"
              className="p-3 rounded-md border"
            />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="Testimony Title"
              required
              className="p-3 rounded-md border"
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your testimony here"
              required
              className="p-3 rounded-md border min-h-[120px]"
            />
            <label
              className="flex items-center gap-2 text-sm"
              style={{ color: colors.deepNavy }}
            >
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              Allow this testimony to be published
            </label>

            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-md font-bold flex items-center justify-center gap-2 transition hover:scale-105"
              style={{
                backgroundColor: colors.deepNavy,
                color: colors.gold,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                "Submit Testimony"
              )}
            </button>
          </form>
        </div>

        {/* DISPLAY PUBLISHED TESTIMONIES */}
        <div>
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: colors.gold }}
          >
            Published Testimonies
          </h2>

          {testimonies.length === 0 ? (
            <p className="text-center" style={{ color: colors.softCream }}>
              No testimonies yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonies.map((t) => (
                <div
                  key={t._id}
                  className="p-6 rounded-2xl shadow-xl transition hover:-translate-y-2"
                  style={{ backgroundColor: colors.softCream }}
                >
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: colors.deepNavy }}
                  >
                    {t.title}
                  </h3>
                  <p className="mb-4 text-gray-700">
                    {t.content.length > 150 ? t.content.substring(0, 150) + "..." : t.content}
                  </p>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: colors.secondaryNavy }}
                  >
                    — {t.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimony;
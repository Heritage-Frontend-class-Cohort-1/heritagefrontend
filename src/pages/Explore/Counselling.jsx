import React, { useState } from "react";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const Counselling = () => {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    sessionType: "", // Online or Physical
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sessionType) {
      alert("Please select a session type: Online or Physical.");
      return;
    }

    // Here you can call your backend API
    alert(`Counselling session booked successfully!\nSession Type: ${formData.sessionType}`);
    setShowForm(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      sessionType: "",
      date: "",
      message: "",
    });
  };

  return (
    <div style={{ backgroundColor: colors.secondaryNavy }} className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center p-10 rounded-2xl mb-10 shadow-lg" style={{ backgroundColor: colors.softCream }}>
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.deepNavy }}>
            Christian Counselling
          </h1>
          <p style={{ color: colors.deepNavy }}>
            "Where there is no counsel, the people fall; but in the multitude of counselors there is safety."
          </p>
          <p className="font-bold mt-2" style={{ color: colors.gold }}>
            Proverbs 11:14
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-8 mb-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f"
            alt="Counselling"
            className="rounded-2xl shadow-lg"
          />

          <div style={{ backgroundColor: colors.softCream }} className="p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-3" style={{ color: colors.deepNavy }}>
              You Are Not Alone
            </h2>
            <p style={{ color: colors.deepNavy }}>
              Life can sometimes feel overwhelming. Whether you are dealing with
              emotional struggles, family challenges, spiritual questions, or
              personal decisions, our church counselling team is here to walk
              with you in love, wisdom, and prayer.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-8 mb-10 items-center">
          <div style={{ backgroundColor: colors.softCream }} className="p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-3" style={{ color: colors.deepNavy }}>
              Confidential & Prayerful Support
            </h2>
            <p style={{ color: colors.deepNavy }}>
              Our counselling sessions are confidential and guided by biblical
              principles. We provide support for marriage counselling, youth
              guidance, grief support, spiritual growth, and personal healing.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
            alt="Prayer support"
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl shadow-lg mb-10" style={{ backgroundColor: colors.deepNavy }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.gold }}>
            Request Counselling
          </h2>
          <p className="mb-6" style={{ color: colors.offWhite }}>
            Book a session with one of our pastors or trained counsellors. You can choose an Online or Physical session.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-lg font-bold"
            style={{ backgroundColor: colors.gold, color: colors.deepNavy }}
          >
            Book Counselling Session
          </button>
        </div>

        {/* Booking Form */}
        {showForm && (
          <div className="p-6 rounded-2xl shadow-lg mb-10" style={{ backgroundColor: colors.softCream }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.deepNavy }}>
              Book a Counselling Session
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <input
                name="phone"
                placeholder="Phone Number"
                required
                onChange={handleChange}
                className="p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <select
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                required
                className="p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              >
                <option value="" disabled>
                  Select Session Type
                </option>
                <option value="Online">Online Session</option>
                <option value="Physical">Physical Session</option>
              </select>

              <input
                type="date"
                name="date"
                required
                onChange={handleChange}
                className="p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <textarea
                name="message"
                placeholder="What would you like counselling about?"
                onChange={handleChange}
                className="p-3 rounded"
                style={{ backgroundColor: colors.offWhite }}
              />

              <button
                type="submit"
                className="py-3 rounded-lg font-bold"
                style={{ backgroundColor: colors.deepNavy, color: colors.gold }}
              >
                Submit Booking
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Counselling;

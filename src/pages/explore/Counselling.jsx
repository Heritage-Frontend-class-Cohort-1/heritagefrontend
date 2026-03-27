import React, { useState, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://backend-heritage-10.onrender.com";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  sessionType: "",
  date: "",
  message: "",
};

const Counselling = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  
  const formRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpenForm = () => {
    setShowForm(true);
    setMessage("");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.sessionType) {
      setMessage("Please select a session type.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const cleanUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const res = await axios.post(`${cleanUrl}/api/counselling`, formData);
      
      setMessage(res.data.message || "Session booked successfully!");
      setMessageType("success");
      setFormData(INITIAL_FORM);

      setTimeout(() => {
        setShowForm(false);
        setMessage("");
      }, 4000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Connection error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.secondaryNavy }} className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <header className="text-center p-10 rounded-2xl mb-10 shadow-lg" style={{ backgroundColor: colors.softCream }}>
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.deepNavy }}>
            Christian Counselling
          </h1>
          <blockquote className="italic" style={{ color: colors.deepNavy }}>
            "Where there is no counsel, the people fall; but in the multitude of counselors there is safety."
          </blockquote>
          <p className="font-bold mt-2" style={{ color: colors.gold }}>
            Proverbs 11:14
          </p>
        </header>

        {/* Info Sections */}
        <div className="space-y-10 mb-10">
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <img
              src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=800"
              alt="A supportive conversation"
              className="rounded-2xl shadow-lg h-64 w-full object-cover"
            />
            <div style={{ backgroundColor: colors.softCream }} className="p-8 rounded-2xl h-full flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-3" style={{ color: colors.deepNavy }}>You Are Not Alone</h2>
              <p style={{ color: colors.deepNavy }} className="leading-relaxed">
                Life can sometimes feel overwhelming. Our church counselling team is here to walk
                with you in love, wisdom, and prayer through any season.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div style={{ backgroundColor: colors.softCream }} className="p-8 rounded-2xl h-full flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-2xl font-bold mb-3" style={{ color: colors.deepNavy }}>Confidential Support</h2>
              <p style={{ color: colors.deepNavy }} className="leading-relaxed">
                Guided by biblical principles, we provide a safe space for marriage counselling, 
                youth guidance, grief support, and spiritual growth.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
              alt="Hands held in prayer"
              className="rounded-2xl shadow-lg h-64 w-full object-cover order-1 md:order-2"
            />
          </section>
        </div>

        {/* CTA Section */}
        <div className="text-center p-10 rounded-2xl shadow-lg mb-10" style={{ backgroundColor: colors.deepNavy }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.gold }}>Ready to Talk?</h2>
          <p className="mb-6" style={{ color: colors.offWhite }}>
            Book a session with one of our pastors or trained counsellors.
          </p>
          {!showForm && (
            <button
              onClick={handleOpenForm}
              className="px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md"
              style={{ backgroundColor: colors.gold, color: colors.deepNavy }}
            >
              Book Counselling Session
            </button>
          )}
        </div>

        {/* Booking Form */}
        {showForm && (
          <div
            ref={formRef}
            className="p-8 rounded-2xl shadow-2xl mb-10 border-t-4"
            style={{ backgroundColor: colors.softCream, borderColor: colors.gold }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold" style={{ color: colors.deepNavy }}>Booking Details</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="hover:rotate-90 transition-transform"
                style={{ color: colors.deepNavy, fontSize: 24 }}
              >
                ✕
              </button>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-lg" style={{
                color: messageType === "success" ? "#1b5e20" : "#b71c1c",
                backgroundColor: messageType === "success" ? "#c8e6c9" : "#ffcdd2",
                borderLeft: `5px solid ${messageType === "success" ? "#2e7d32" : "#d32f2f"}`
              }}>
                {messageType === "success" ? "✅ " : "⚠️ "}{message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Full Name *" value={formData.name} required onChange={handleChange} className="p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
              <input name="phone" placeholder="Phone Number *" value={formData.phone} required onChange={handleChange} className="p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
              <input name="email" type="email" placeholder="Email (Optional)" value={formData.email} onChange={handleChange} className="p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
              <select name="sessionType" value={formData.sessionType} onChange={handleChange} required className="p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none">
                <option value="" disabled>Select Session Type *</option>
                <option value="Online">Online Session</option>
                <option value="Physical">Physical Session</option>
              </select>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1" style={{color: colors.deepNavy}}>Preferred Date *</label>
                <input type="date" name="date" value={formData.date} min={today} required onChange={handleChange} className="w-full p-3 rounded border border-gray-300 outline-none" />
              </div>
              <textarea name="message" placeholder="Optional: What is on your mind?" value={formData.message} onChange={handleChange} rows={4} className="md:col-span-2 p-3 rounded border border-gray-300 outline-none resize-none" />
              
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.deepNavy, color: colors.gold }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Confirm My Booking"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Counselling;
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react";

const API_URL = "https://backend-heritage-1.onrender.com";

const colors = {
  deepNavy: "#0B1B3F",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Server error");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Contact Error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.offWhite }} className="min-h-screen font-sans">
      {/* Hero Section */}
      <section
        className="py-20 text-center px-6"
        style={{ backgroundColor: colors.deepNavy, color: colors.offWhite }}
      >
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Get In Touch</h1>
        <p className="text-lg md:text-xl opacity-90 leading-relaxed">
          Have a question, a prayer request, or want to join a department? Our doors and hearts are always open.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: <MapPin className="text-amber-500" />, title: "Our Location", content: "The Redeemed Christian Church of God, The Lord’s House, Lagos, Nigeria" },
              { icon: <Phone className="text-amber-500" />, title: "Call Us", content: "+2349059156800" },
              { icon: <Clock className="text-amber-500" />, title: "Service Hours", content: "Mon - Fri: 9:00 AM - 5:00 PM" },
              { icon: <Mail className="text-amber-500" />, title: "Email Us", content: "contact@thelordshouse.org" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white shadow-xl border border-gray-100 flex items-start gap-4 transition-transform hover:scale-105"
              >
                <div className="p-3 rounded-2xl bg-amber-50">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
              {!submitted ? (
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-black mb-2" style={{ color: colors.deepNavy }}>
                    Send us a Message
                  </h2>
                  <p className="text-gray-500 mb-6 font-medium">
                    Fields marked with * are required.
                  </p>

                  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"
                        style={{ backgroundColor: colors.offWhite }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"
                        style={{ backgroundColor: colors.offWhite }}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"
                        style={{ backgroundColor: colors.offWhite }}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">How can we help? *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        required
                        className="w-full p-4 rounded-2xl border border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"
                        style={{ backgroundColor: colors.offWhite }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`md:col-span-2 mt-4 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${
                        loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-amber-400/20'
                      }`}
                      style={{ backgroundColor: colors.deepNavy, color: colors.gold }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          SENDING...
                        </>
                      ) : (
                        <>
                          <Send size={20} /> SEND MESSAGE
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-3xl font-black mb-4" style={{ color: colors.deepNavy }}>
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 max-w-sm font-medium">
                    Thank you for reaching out. A member of our team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-amber-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
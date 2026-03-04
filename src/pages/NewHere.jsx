// src/pages/NewHere.jsx
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

const NewHere = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    contactMethod: "whatsapp",
    prayer: "",
    consent: false,
  });

  const [showPrayerForm, setShowPrayerForm] = useState(false);

  const [prayerForm, setPrayerForm] = useState({
    name: "",
    email: "",
    request: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handlePrayerChange = (e) => {
    const { name, value } = e.target;
    setPrayerForm({ ...prayerForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consent) return alert("Please give consent to be contacted.");
    alert("Thank you! We’ll be in touch soon 🙏");
  };

  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    alert("Your prayer request has been received 🙏");
    setPrayerForm({ name: "", email: "", request: "" });
    setShowPrayerForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="py-24 bg-blue-950 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">New Here?</h1>
        <p className="text-lg opacity-90">
          We’d love to connect with you and walk with you.
        </p>
      </section>

      {/* Follow-Up Form */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow">
          <h2 className="text-3xl font-bold text-blue-950 mb-6">
            Get Connected
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full p-4 border rounded-lg"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="w-full p-4 border rounded-lg"
            />
            <input
              name="email"
              placeholder="Email (optional)"
              onChange={handleChange}
              className="w-full p-4 border rounded-lg"
            />

            <select
              name="contactMethod"
              onChange={handleChange}
              className="w-full p-4 border rounded-lg"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Phone Call</option>
              <option value="sms">SMS</option>
            </select>

            <label className="flex gap-2 items-center text-sm">
              <input
                type="checkbox"
                name="consent"
                onChange={handleChange}
              />
              I consent to be contacted by the church
            </label>

            <button className="w-full bg-amber-500 py-4 rounded-lg font-semibold">
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Contact & Service Info */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Info icon={<MapPin />} title="Address" text="123 Faith Avenue" />
          <Info icon={<Phone />} title="Phone" text="(555) 123-4567" />
          <Info icon={<Mail />} title="Email" text="hello@church.org" />
          <Info icon={<Clock />} title="Service Times" text="Sundays 9AM & 11AM" />
        </div>
      </section>

      {/* Prayer Request Section */}
      <section className="py-20 text-center">
        <Heart className="mx-auto text-amber-600" size={40} />
        <h3 className="text-2xl font-bold mt-4">Need Prayer?</h3>
        <p className="text-gray-600 mt-2">
          Our prayer team is ready to stand with you.
        </p>

        <button
          onClick={() => setShowPrayerForm(true)}
          className="mt-6 bg-amber-500 text-blue-950 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition"
        >
          Submit a Prayer Request
        </button>

        {showPrayerForm && (
          <form
            onSubmit={handlePrayerSubmit}
            className="mt-10 bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-left"
          >
            <h4 className="text-2xl font-bold text-blue-950 mb-6">
              Prayer Request
            </h4>

            <div className="space-y-5">
              <input
                name="name"
                placeholder="Your Name (optional)"
                value={prayerForm.name}
                onChange={handlePrayerChange}
                className="w-full p-4 border rounded-lg"
              />

              <input
                name="email"
                placeholder="Email (optional)"
                value={prayerForm.email}
                onChange={handlePrayerChange}
                className="w-full p-4 border rounded-lg"
              />

              <textarea
                name="request"
                rows="5"
                placeholder="Share your prayer request..."
                value={prayerForm.request}
                onChange={handlePrayerChange}
                required
                className="w-full p-4 border rounded-lg"
              />

              <button
                type="submit"
                className="w-full bg-amber-500 py-4 rounded-lg font-semibold"
              >
                Send Prayer Request
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

const Info = ({ icon, title, text }) => (
  <div className="flex gap-4 items-start">
    <div className="text-amber-600">{icon}</div>
    <div>
      <p className="font-semibold">{title}</p>
      <p>{text}</p>
    </div>
  </div>
);

export default NewHere;

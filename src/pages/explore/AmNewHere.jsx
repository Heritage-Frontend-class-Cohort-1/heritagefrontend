import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const MemberForm = ({ memberId, existingData }) => {
  const API_URL = import.meta.env.VITE_API_URL || "https://backend-heritage-10.onrender.com";
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: existingData?.firstName || "",
    lastName: existingData?.lastName || "",
    email: existingData?.email || "",
    phone: existingData?.phone || "",
    address: existingData?.address || "",
    birthDay: existingData?.birthDay || "",
    birthMonth: existingData?.birthMonth || "",
    category: existingData?.category || "Member",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMark, setShowSuccessMark] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (existingData) setFormData(existingData);
  }, [existingData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => e.target.files && setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
      setMessage("First name, last name, phone, and address are required.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") data.append(key, formData[key]);
      });
      if (imageFile) data.append("image", imageFile);

      if (memberId) {
        await axios.put(`${API_URL}/api/members/${memberId}`, data);
        setMessage("Profile updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/members`, data);
        setMessage("Member added successfully!");
      }

      setMessageType("success");
      setLoading(false);
      setShowSuccessMark(true);

      setTimeout(() => {
        setShowSuccessMark(false);
        if (!memberId) {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            birthDay: "",
            birthMonth: "",
            category: "Member",
          });
          setImageFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
        setMessage("");
      }, 2500);

    } catch (err) {
      setLoading(false);
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error saving data.");
      setMessageType("error");
    }
  };

  return (
    <div className="relative p-4 rounded-xl shadow-md" style={{ backgroundColor: colors.softCream }}>

      {/* LOADING & SUCCESS OVERLAY */}
      {(loading || showSuccessMark) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-[2px]">
          <div className="text-center">
            {showSuccessMark ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <CheckCircle2 size={60} className="text-green-500 mb-2" />
                <p className="font-bold text-green-700">Done!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Loader2 size={60} className="animate-spin text-blue-600 mb-2" />
                <p className="font-bold" style={{ color: colors.deepNavy }}>
                  {memberId ? "Updating..." : "Saving..."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold" style={{ color: colors.deepNavy }}>
          {memberId ? "Edit Profile" : "Add Member"}
        </h3>
        <Link
          to="/explore-heritage/update-profile"
          className="text-sm px-3 py-1 rounded-lg font-semibold hover:opacity-80 transition"
          style={{ backgroundColor: colors.deepNavy, color: colors.gold }}
        >
          Update Profile
        </Link>
      </div>

      {message && (
        <p
          className="mb-4 p-2 rounded-lg text-sm font-medium"
          style={{
            color: messageType === "success" ? "#1b5e20" : "#b71c1c",
            backgroundColor: messageType === "success" ? "#c8e6c9" : "#ffcdd2",
            borderLeft: `4px solid ${messageType === "success" ? "#2e7d32" : "#d32f2f"}`,
          }}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <input
          name="email"
          placeholder="Email (Optional)"
          value={formData.email}
          onChange={handleChange}
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="p-2 rounded-lg border border-gray-300"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
            className="p-2 rounded-lg border border-gray-300"
          >
            <option value="">Day (Optional)</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select
            name="birthMonth"
            value={formData.birthMonth}
            onChange={handleChange}
            className="p-2 rounded-lg border border-gray-300"
          >
            <option value="">Month (Optional)</option>
            {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-2 rounded-lg border border-gray-300"
        >
          <option value="Member">Member</option>
          <option value="First Timer">First Timer</option>
          <option value="New Convert">New Convert</option>
        </select>

        <label className="text-xs font-bold text-gray-600 ml-1">Profile Photo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 rounded-lg border border-gray-300 bg-white text-sm"
        />

        <button
          type="submit"
          disabled={loading || showSuccessMark}
          className="p-3 mt-2 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 shadow-sm"
          style={{ backgroundColor: colors.deepNavy, color: colors.gold }}
        >
          {memberId ? "Update Profile" : "Add Member"}
        </button>
      </form>
    </div>
  );
};

export default MemberForm;
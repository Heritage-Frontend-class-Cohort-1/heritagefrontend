import { useState } from "react";
import axios from "axios";
import { 
  Camera, User, Save, ArrowLeft, Loader2, CheckCircle2 
} from "lucide-react";

const colors = {
  deepNavy: "#0B1B3F",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const API_URL = import.meta.env.VITE_API_URL || "https://backend-heritage-10.onrender.com";

const UpdateProfilePage = () => {
  const [step, setStep] = useState("verify");
  const [phone, setPhone] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDay: "",
    birthMonth: "",
    category: "Member",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===== VERIFY PHONE =====
  const handleVerifyPhone = async (e) => {
    e.preventDefault();
    setVerifyError("");
    setErrorMsg("");
    setLoading(true);

    try {
      const normalizedPhone = phone.trim().replace(/\s+/g, "");
      const response = await axios.get(`${API_URL}/api/members/phone/${encodeURIComponent(normalizedPhone)}`);
      const member = response.data.data || response.data;

      if (!member?._id) {
        setVerifyError("No member found with this phone number.");
        return;
      }

      setSelectedMember(member);
      setFormData({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        email: member.email || "",
        phone: member.phone || normalizedPhone,
        address: member.address || "",
        birthDay: member.birthDay || "",
        birthMonth: member.birthMonth || "",
        category: member.category || "Member",
      });
      setImagePreview(member.image || member.imageUrl || null);
      setStep("edit");
    } catch (error) {
      console.error("Verify error:", error);
      setVerifyError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE PROFILE =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value || "");
      });
      if (imageFile) data.append("image", imageFile);

      await axios.put(`${API_URL}/api/members/${selectedMember._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleBack();
      }, 2200);
    } catch (error) {
      console.error("Update failed:", error);
      const msg = error.response?.data?.message || "Failed to update profile. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("verify");
    setPhone("");
    setSelectedMember(null);
    setSuccess(false);
    setLoading(false);
    setImageFile(null);
    setImagePreview(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.softCream }}>

      {/* Success / Loading Overlay */}
      {(loading || success) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 shadow-2xl text-center min-w-[320px] max-w-sm w-full">
            {success ? (
              <>
                <CheckCircle2 size={80} className="text-green-500 mx-auto mb-5 animate-bounce" />
                <h2 className="text-3xl font-bold mb-2" style={{ color: colors.deepNavy }}>
                  Success!
                </h2>
                <p className="text-gray-600">Profile updated successfully</p>
              </>
            ) : (
              <>
                <Loader2 size={80} className="text-blue-600 animate-spin mx-auto mb-5" />
                <h2 className="text-2xl font-bold" style={{ color: colors.deepNavy }}>
                  Updating...
                </h2>
                <p className="text-gray-600 mt-2">Please wait a moment</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* STEP 1: VERIFY */}
      {step === "verify" ? (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: colors.deepNavy }}>
            Update Profile
          </h1>
          <form onSubmit={handleVerifyPhone} className="space-y-5">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="080XXXXXXXX"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
            {verifyError && <p className="text-red-600 text-sm font-medium">{verifyError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-bold text-white rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.deepNavy }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Searching...
                </>
              ) : (
                "Find My Profile"
              )}
            </button>
          </form>
        </div>
      ) : (
        /* STEP 2: EDIT FORM */
        <div className="max-w-3xl mx-auto mt-12 mb-16 px-4 sm:px-6">
          <button
            onClick={handleBack}
            className="flex items-center mb-6 text-gold hover:text-yellow-600 font-medium transition"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl space-y-7">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gold shadow-lg">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={56} className="text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow cursor-pointer hover:bg-gray-50 transition">
                  <Camera size={22} className="text-gray-700" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="First Name *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent" required />
              <input placeholder="Last Name *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent" />
              <input type="tel" placeholder="Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent" required />
              <textarea placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent md:col-span-2" rows={3} />
              <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent">
                <option value="">Day</option>
                {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
              </select>
              <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent">
                <option value="">Month</option>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m,i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent md:col-span-2">
                <option value="Member">Member</option>
                <option value="First Timer">First Timer</option>
                <option value="New Convert">New Convert</option>
              </select>
            </div>

            {/* === UPDATE BUTTON === */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 mt-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-deepNavy hover:brightness-110 active:brightness-90"
                }
                text-white shadow-md
              `}
              style={{ backgroundColor: loading ? undefined : colors.deepNavy }}
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={22} />
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateProfilePage;
import { useState } from "react";
import axios from "axios";
import { Camera, User, Mail, Phone, MapPin, Calendar, Users, Save, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
  lightBlue: "#E8F0F8",
};

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
  const [updateSuccess, setUpdateSuccess] = useState(false); // New state for success mark
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "https://backend-heritage-1.onrender.com";

  const handleVerifyPhone = async (e) => {
    e.preventDefault();
    setVerifyError("");
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/members/phone/${encodeURIComponent(phone.trim())}`);
      const result = response.data.data || response.data;
      const member = Array.isArray(result) ? result[0] : result;
      
      if (!member) {
        setVerifyError("No member found with this phone number.");
      } else {
        setSelectedMember(member);
        setFormData({
          firstName: member.firstName || "",
          lastName: member.lastName || "",
          email: member.email || "",
          phone: member.phone || "",
          address: member.address || "",
          birthDay: member.birthDay || "",
          birthMonth: member.birthMonth || "",
          category: member.category || "Member",
        });
        setImagePreview(member.profileImage || member.image || member.imageUrl || null);
        setStep("edit");
      }
    } catch (error) {
      setVerifyError("Search failed. Please check the phone number.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append("image", imageFile);

      await axios.put(`${API_URL}/api/members/${selectedMember._id}`, data);

      setUpdateSuccess(true); // Show success mark
      setTimeout(() => {
        setUpdateSuccess(false);
        handleBack();
      }, 2500);
    } catch (err) {
      setMessage("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("verify");
    setPhone("");
    setSelectedMember(null);
    setUpdateSuccess(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.offWhite }}>
      
      {/* --- LOADING & SUCCESS OVERLAY --- */}
      {(loading || updateSuccess) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center flex flex-col items-center">
            {updateSuccess ? (
              <>
                <CheckCircle2 size={80} className="text-green-500 animate-bounce" />
                <h2 className="text-2xl font-bold mt-4" style={{ color: colors.deepNavy }}>Success!</h2>
                <p className="text-gray-600">Profile updated successfully.</p>
              </>
            ) : (
              <>
                <Loader2 size={80} className="text-blue-600 animate-spin" />
                <h2 className="text-2xl font-bold mt-4" style={{ color: colors.deepNavy }}>Updating...</h2>
                <p className="text-gray-600">Please wait while we save your changes.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- STEP 1: VERIFY --- */}
      {step === "verify" ? (
        <>
          <section className="py-20 text-white text-center" style={{ backgroundColor: colors.deepNavy }}>
            <h1 className="text-4xl font-bold">Update Profile</h1>
          </section>
          <div className="max-w-md mx-auto p-8 -mt-10 bg-white rounded-2xl shadow-xl">
            <form onSubmit={handleVerifyPhone} className="space-y-4">
              <label className="block font-semibold">Registered Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border-2 rounded-xl"
                placeholder="+234..."
                required
              />
              {verifyError && <p className="text-red-500 text-sm font-medium">{verifyError}</p>}
              <button className="w-full py-4 text-white font-bold rounded-xl transition hover:opacity-90" style={{ backgroundColor: colors.deepNavy }}>
                Find My Profile
              </button>
            </form>
          </div>
        </>
      ) : (
        /* --- STEP 2: EDIT FORM --- */
        <>
          <section className="py-12 text-white text-center" style={{ backgroundColor: colors.deepNavy }}>
            <button onClick={handleBack} className="mb-4 flex items-center mx-auto opacity-80 hover:opacity-100">
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>
            <h1 className="text-3xl font-bold">Edit Details</h1>
          </section>

          <div className="max-w-3xl mx-auto px-4 -mt-8 mb-12">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 space-y-6">
              
              {message && <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">{message}</div>}

              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold-500 shadow-md" style={{ borderColor: colors.gold }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100"><User size={48} className="text-gray-400" /></div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition">
                    <Camera size={20} style={{ color: colors.deepNavy }} />
                    <input type="file" className="hidden" onChange={(e) => {
                      if (e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} accept="image/*" />
                  </label>
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-bold mb-1"><User size={14} className="mr-2"/> First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold mb-1"><User size={14} className="mr-2"/> Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold mb-1"><Mail size={14} className="mr-2"/> Email</label>
                  <input name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold mb-1"><Phone size={14} className="mr-2"/> Phone</label>
                  <input name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-bold mb-1"><MapPin size={14} className="mr-2"/> Address</label>
                  <textarea name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 border rounded-lg" rows="2" required />
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold mb-1"><Calendar size={14} className="mr-2"/> Birth Day</label>
                  <select value={formData.birthDay} onChange={(e) => setFormData({...formData, birthDay: e.target.value})} className="w-full p-3 border rounded-lg">
                    {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold mb-1"><Calendar size={14} className="mr-2"/> Birth Month</label>
                  <select value={formData.birthMonth} onChange={(e) => setFormData({...formData, birthMonth: e.target.value})} className="w-full p-3 border rounded-lg">
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-bold mb-1"><Users size={14} className="mr-2"/> Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded-lg">
                    <option value="Member">Member</option>
                    <option value="First Timer">First Timer</option>
                    <option value="New Convert">New Convert</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:brightness-110" style={{ backgroundColor: colors.deepNavy }}>
                <Save size={20} /> Update Profile
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateProfilePage;
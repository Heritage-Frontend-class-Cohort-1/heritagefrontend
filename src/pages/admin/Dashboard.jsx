
import { useEffect, useState } from "react";
import axios from "axios";
import { colors } from "../../utils/colors";

const API_URL = import.meta.env.VITE_API_URL || "https://backend-heritage-1.onrender.com";

console.log("🔍 API_URL:", API_URL);

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingStates, setSendingStates] = useState({});

  // Attendance states - SIMPLIFIED
  const [attendance, setAttendance] = useState({});
  const [attendanceMessage, setAttendanceMessage] = useState(
    "Hello {name}, we missed you at church today. Please reach out if there's any issue."
  );
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  // UI states - SIMPLIFIED
  const [activeTab, setActiveTab] = useState("attendance");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, prayersRes, testimoniesRes, birthdaysRes] =
        await Promise.all([
          axios.get(`${API_URL}/api/members`),
          axios.get(`${API_URL}/api/prayers`),
          axios.get(`${API_URL}/api/testimonies`),
          axios.get(`${API_URL}/api/birthdays/upcoming`),
        ]);

      setMembers(membersRes.data.data || []);
      setPrayers(prayersRes.data.data || []);
      setTestimonies(testimoniesRes.data.data || []);
      setBirthdays(birthdaysRes.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching admin data:", err);
      alert("Failed to fetch data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const submitAttendance = async () => {
    // Check if any members are marked
    const presentMembers = Object.keys(attendance).filter((id) => attendance[id]);
    const absentMembers = members
      .filter((m) => !attendance[m._id])
      .map((m) => ({
        name: `${m.firstName} ${m.lastName}`,
        phone: m.phone,
      }));

    if (presentMembers.length === 0 && absentMembers.length === 0) {
      alert("❌ Please mark at least one member as present");
      return;
    }

    if (!attendanceMessage.trim()) {
      alert("❌ Please type a message for absentees");
      return;
    }

    setSubmittingAttendance(true);

    try {
      const response = await axios.post(`${API_URL}/api/attendance/mark`, {
        presentMembers,
        absentMembers,
        message: attendanceMessage,
      });

      const sentCount = response.data.summary?.sentCount || 0;
      const failedCount = response.data.summary?.failedCount || 0;

      setSuccessMessage(
        `✅ Attendance recorded! ${presentMembers.length} present, ${absentMembers.length} absent. ${sentCount} messages sent.`
      );

      setAttendance({});
      fetchData();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to record attendance.";
      alert(`❌ ${errorMsg}`);
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const sendFollowUp = async (member) => {
    const memberId = member._id;
    const memberName = member.firstName
      ? `${member.firstName} ${member.lastName}`
      : member.memberName;
    const memberPhone = member.phone;

    if (!memberPhone) {
      alert(`❌ ${memberName} has no phone number`);
      return;
    }

    setSendingStates((prev) => ({ ...prev, [memberId]: true }));

    try {
      await axios.post(`${API_URL}/api/birthdays/${memberId}/message`, {
        name: memberName,
        phone: memberPhone,
      });

      setSuccessMessage(`✅ Message sent to ${memberName}`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send message";
      alert(`❌ ${errorMsg}`);
    } finally {
      setSendingStates((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const publishTestimony = async (id) => {
    try {
      await axios.put(`${API_URL}/api/testimonies/${id}/publish`);
      setSuccessMessage("✅ Testimony published!");
      fetchData();
    } catch (err) {
      alert("❌ Failed to publish testimony");
    }
  };

  const deleteTestimony = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimony?"))
      return;

    try {
      const res = await axios.delete(`${API_URL}/api/testimonies/${id}`);
      if (res.data.success) {
        setSuccessMessage("✅ Testimony deleted!");
        fetchData();
      }
    } catch (err) {
      alert("❌ Failed to delete testimony");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Get filtered members
  const filteredMembers = members.filter((m) =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate members by type
  const firstTimers = members.filter(
    (m) => m.memberType === "firstTimer" || m.status === "firstTimer"
  );
  const newConverts = members.filter(
    (m) => m.memberType === "newConvert" || m.status === "newConvert"
  );
  const regularMembers = members.filter(
    (m) => m.memberType === "member" || m.status === "member"
  );

  // Count stats
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalMembers = members.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 shadow-lg py-4"
        style={{ backgroundColor: colors.deepNavy }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">👨‍💼 Church Admin</h1>
          <button
            onClick={handleLogout}
            className="text-white font-medium hover:opacity-80 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Success Toast */}
      {successMessage && (
        <div
          className="fixed top-20 right-4 z-40 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce font-medium"
          style={{ backgroundColor: colors.deepNavy }}
        >
          {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Simple Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "attendance", label: "📋 Mark Attendance", icon: "📋" },
            { id: "members", label: "👥 All Members", icon: "👥" },
            { id: "firstTimers", label: "🆕 First Timers", icon: "🆕" },
            { id: "newConverts", label: "✝️ New Converts", icon: "✝️" },
            { id: "prayers", label: "🙏 Prayers", icon: "🙏" },
            { id: "testimonies", label: "💬 Testimonies", icon: "💬" },
            { id: "birthdays", label: "🎂 Birthdays", icon: "🎂" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
              style={
                activeTab === tab.id
                  ? { backgroundColor: colors.deepNavy }
                  : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: MARK ATTENDANCE - MAIN FOCUS */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">📋 Mark Attendance</h1>
              <p className="text-gray-600">
                Check the boxes below to mark members as PRESENT. Unchecked members will receive an SMS.
              </p>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div
                className="p-6 rounded-lg text-white text-center"
                style={{ backgroundColor: colors.deepNavy }}
              >
                <p className="text-sm opacity-90 font-medium">Total Members</p>
                <p className="text-4xl font-bold">{totalMembers}</p>
              </div>
              <div className="p-6 rounded-lg bg-green-50 border-2 border-green-200 text-center">
                <p className="text-sm text-green-700 font-medium">✅ Present</p>
                <p className="text-4xl font-bold text-green-700">{presentCount}</p>
              </div>
              <div className="p-6 rounded-lg bg-red-50 border-2 border-red-200 text-center">
                <p className="text-sm text-red-700 font-medium">❌ Absent</p>
                <p className="text-4xl font-bold text-red-700">{totalMembers - presentCount}</p>
              </div>
            </div>

            {/* MESSAGE SECTION */}
            <div className="mb-8">
              <label className="block text-lg font-bold mb-3">
                ✉️ Message to Absent Members
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Use {`{name}`} to add member names automatically
              </p>
              <textarea
                value={attendanceMessage}
                onChange={(e) => setAttendanceMessage(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none min-h-[100px] font-medium"
                style={{
                  borderColor: colors.deepNavy + "40",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.deepNavy;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.deepNavy + "40";
                }}
              />
            </div>

            {/* SEARCH BAR */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Search member name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none text-lg"
                style={{
                  borderColor: colors.deepNavy + "40",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.deepNavy;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.deepNavy + "40";
                }}
              />
            </div>

            {/* MEMBERS LIST - SIMPLE CHECKBOX LAYOUT */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Check Members Present:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                {filteredMembers.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No members found
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <label
                      key={member._id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={attendance[member._id] || false}
                        onChange={(e) =>
                          setAttendance((prev) => ({
                            ...prev,
                            [member._id]: e.target.checked,
                          }))
                        }
                        className="w-5 h-5 rounded cursor-pointer"
                        style={{
                          accentColor: colors.deepNavy,
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {member.firstName} {member.lastName}
                        </p>
                        {!member.phone && (
                          <p className="text-xs text-red-600">⚠️ No phone</p>
                        )}
                      </div>
                      {attendance[member._id] && (
                        <span className="text-2xl">✓</span>
                      )}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON - BIG AND CLEAR */}
            <button
              onClick={submitAttendance}
              disabled={submittingAttendance || presentCount === 0}
              className={`w-full py-4 rounded-lg font-bold text-lg text-white transition ${
                submittingAttendance || presentCount === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:opacity-90 active:scale-95 shadow-lg"
              }`}
              style={
                submittingAttendance || presentCount === 0
                  ? {}
                  : { backgroundColor: colors.deepNavy }
              }
            >
              {submittingAttendance ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </span>
              ) : (
                `✓ SUBMIT ATTENDANCE (${presentCount} checked)`
              )}
            </button>

            {/* HELPER TEXT */}
            <p className="text-center text-gray-600 mt-4 text-sm">
              Mark members as present by checking their boxes, then click submit.
              Unchecked members will be marked absent and receive your message.
            </p>
          </div>
        )}

        {/* TAB: ALL MEMBERS */}
        {activeTab === "members" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">👥 All Members</h1>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Search member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
                style={{
                  borderColor: colors.deepNavy + "40",
                }}
              />
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member._id}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:shadow-lg transition"
                >
                  <p className="font-bold text-lg">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {member.phone ? `📱 ${member.phone}` : "⚠️ No phone"}
                  </p>
                  {member.memberType && (
                    <p className="text-xs mt-2 px-2 py-1 rounded-full inline-block" style={{
                      backgroundColor: member.memberType === "firstTimer" ? "#fef3c7" :
                                     member.memberType === "newConvert" ? "#dcfce7" : "#e9d5ff",
                      color: member.memberType === "firstTimer" ? "#92400e" :
                            member.memberType === "newConvert" ? "#166534" : "#6b21a8",
                    }}>
                      {member.memberType === "firstTimer" ? "🆕 First Timer" :
                       member.memberType === "newConvert" ? "✝️ New Convert" : "⭐ Member"}
                    </p>
                  )}
                  <button
                    disabled={!member.phone || sendingStates[member._id]}
                    onClick={() => sendFollowUp(member)}
                    className="mt-3 w-full py-2 rounded-lg font-medium text-white transition"
                    style={{
                      backgroundColor: member.phone && !sendingStates[member._id] ? colors.deepNavy : "#ccc",
                      cursor: member.phone && !sendingStates[member._id] ? "pointer" : "not-allowed",
                    }}
                  >
                    {sendingStates[member._id] ? "Sending..." : "📱 Send SMS"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: FIRST TIMERS */}
        {activeTab === "firstTimers" && (
          <MemberCategoryTab
            members={firstTimers}
            title="🆕 First Timers"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sendingStates={sendingStates}
            sendFollowUp={sendFollowUp}
            colors={colors}
          />
        )}

        {/* TAB: NEW CONVERTS */}
        {activeTab === "newConverts" && (
          <MemberCategoryTab
            members={newConverts}
            title="✝️ New Converts"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sendingStates={sendingStates}
            sendFollowUp={sendFollowUp}
            colors={colors}
          />
        )}

        {/* TAB: PRAYERS */}
        {activeTab === "prayers" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">🙏 Prayer Requests</h1>

            {prayers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No prayer requests yet</p>
            ) : (
              <div className="space-y-4">
                {prayers.map((prayer) => (
                  <div
                    key={prayer._id}
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      borderLeftColor: colors.deepNavy,
                      backgroundColor: colors.deepNavy + "10",
                    }}
                  >
                    <p className="font-bold text-lg">{prayer.name}</p>
                    <p className="text-gray-700 mt-2">{prayer.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: TESTIMONIES */}
        {activeTab === "testimonies" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">💬 Testimonies</h1>

            <div className="space-y-8">
              {/* Pending */}
              <div>
                <h2 className="text-2xl font-bold text-orange-600 mb-4">
                  👁️ Pending Review
                </h2>
                <div className="space-y-3">
                  {testimonies.filter((t) => !t.isPublic).length === 0 ? (
                    <p className="text-gray-500">No pending testimonies</p>
                  ) : (
                    testimonies
                      .filter((t) => !t.isPublic)
                      .map((testimony) => (
                        <div
                          key={testimony._id}
                          className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg"
                        >
                          <p className="font-bold">{testimony.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            by {testimony.name}
                          </p>
                          <button
                            onClick={() => publishTestimony(testimony._id)}
                            className="mt-3 px-4 py-2 rounded-lg font-medium text-white transition"
                            style={{ backgroundColor: colors.deepNavy }}
                          >
                            ✓ Publish
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Published */}
              <div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  ✓ Published
                </h2>
                <div className="space-y-3">
                  {testimonies.filter((t) => t.isPublic).length === 0 ? (
                    <p className="text-gray-500">No published testimonies</p>
                  ) : (
                    testimonies
                      .filter((t) => t.isPublic)
                      .map((testimony) => (
                        <div
                          key={testimony._id}
                          className="p-4 bg-green-50 border-2 border-green-200 rounded-lg"
                        >
                          <p className="font-bold">{testimony.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            by {testimony.name}
                          </p>
                          <button
                            onClick={() => deleteTestimony(testimony._id)}
                            className="mt-3 px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BIRTHDAYS */}
        {activeTab === "birthdays" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">🎂 Upcoming Birthdays</h1>

            {birthdays.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No upcoming birthdays</p>
            ) : (
              <div className="space-y-3">
                {birthdays.map((birthday) => {
                  const date = new Date(birthday.birthDate);
                  const today = new Date();
                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth();

                  return (
                    <div
                      key={birthday._id}
                      className={`p-4 rounded-lg flex items-center justify-between ${
                        isToday
                          ? "bg-pink-50 border-2 border-pink-300"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={
                            birthday.imageUrl ||
                            "https://via.placeholder.com/50"
                          }
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold">
                            {birthday.memberName}{" "}
                            {isToday && <span>🎉</span>}
                          </p>
                          <p className="text-sm text-gray-600">
                            {date.toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={
                          !birthday.phone || sendingStates[birthday._id]
                        }
                        onClick={() => sendFollowUp(birthday)}
                        className="px-4 py-2 rounded-lg font-medium text-white transition"
                        style={{
                          backgroundColor:
                            birthday.phone && !sendingStates[birthday._id]
                              ? colors.deepNavy
                              : "#ccc",
                          cursor:
                            birthday.phone && !sendingStates[birthday._id]
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        {sendingStates[birthday._id] ? "Sending..." : "🎁 Send"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-bold text-lg">Loading...</p>
    </div>
  </div>
);

const MemberCategoryTab = ({
  members,
  title,
  searchTerm,
  setSearchTerm,
  sendingStates,
  sendFollowUp,
  colors,
}) => {
  const filtered = members.filter((m) =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">Total: {members.length} members</p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search member..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
          style={{
            borderColor: colors.deepNavy + "40",
          }}
        />
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No members found
          </div>
        ) : (
          filtered.map((member) => (
            <div
              key={member._id}
              className="p-4 border-2 border-gray-200 rounded-lg hover:shadow-lg transition"
            >
              <p className="font-bold text-lg">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {member.phone ? `📱 ${member.phone}` : "⚠️ No phone"}
              </p>
              <button
                disabled={!member.phone || sendingStates[member._id]}
                onClick={() => sendFollowUp(member)}
                className="mt-3 w-full py-2 rounded-lg font-medium text-white transition"
                style={{
                  backgroundColor:
                    member.phone && !sendingStates[member._id]
                      ? colors.deepNavy
                      : "#ccc",
                  cursor:
                    member.phone && !sendingStates[member._id]
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                {sendingStates[member._id] ? "Sending..." : "📱 Send SMS"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;



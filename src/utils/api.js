import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-heritage-10.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

export const memberService = {
  // Fetch member by phone
  getByPhone: async (phone) => {
    const response = await api.get(
      `/api/members/phone/${encodeURIComponent(phone.trim())}`
    );

    const result = response.data.data || response.data;
    return Array.isArray(result) ? result[0] : result;
  },

  // Update member profile
  updateProfile: async (id, formData, imageFile) => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (imageFile) {
      data.append("image", imageFile);
    }

    const response = await api.put(`/api/members/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};

// Birthday API
export const birthdayService = {
  getUpcomingBirthdays: async () => {
    const response = await api.get("/api/birthdays/upcoming");
    return response.data;
  },
};

// Prayer API
export const prayerService = {
  submitPrayerRequest: async (formData) => {
    const response = await api.post("/api/prayers", formData);
    return response.data;
  },
};
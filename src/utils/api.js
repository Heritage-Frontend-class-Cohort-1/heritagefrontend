// src/utils/api.js
import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // must be set in .env
  withCredentials: false, // set true if your backend requires cookies/auth
});

// Optional: Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response, // return response if successful
  (error) => {
    // Optional: log errors
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
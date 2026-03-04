import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // change if your backend runs elsewhere
  withCredentials: true,
});

export default api;

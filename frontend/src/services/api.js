import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission.");
    } else if (error.response?.status === 422) {
      const details = error.response?.data?.detail;
      const message = Array.isArray(details) 
        ? details.map(d => d.msg).join(", ")
        : details || "Validation error";
      toast.error(message);
    } else if (error.response?.status === 400) {
      // some 400 errors (in particular our outside-county response) include an
      // object with `message` + extra data; the caller component is responsible for
      // displaying it, so we avoid spamming a generic toast here.
      const detail = error.response?.data?.detail;
      if (!detail || typeof detail === "string" || !detail.message) {
        const message = detail || "Bad request";
        toast.error(message);
      }
    } else {
      const message = error.response?.data?.detail || error.message || "An error occurred";
      toast.error(message);
      console.error("API Error:", error);
    }
    return Promise.reject(error);
  },
);

export default api;


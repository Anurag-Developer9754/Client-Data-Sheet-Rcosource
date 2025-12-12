import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 20000,
});

// attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// Dashboard: send ?month=January etc.
export const getDashboardData = (month) =>
  API.get("/dashboard", { params: { month } });

// Login
export const loginUser = (data) => API.post("/auth/login", data);

// Upload (admin) - left for later
export const uploadSheet = (formData) =>
  API.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" }});

export default API;

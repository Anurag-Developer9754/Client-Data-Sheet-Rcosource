import axios from "axios";

// ===============================
// AXIOS INSTANCE CONFIG
// ===============================
const API = axios.create({
baseURL: "[http://localhost:5000](http://localhost:5000)", // Backend URL
timeout: 20000, // 20 sec timeout
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
API.interceptors.request.use(
(config) => {
console.log("📤 Request Sent:", config.url);
return config;
},
(error) => {
console.error("❌ Request Error:", error);
return Promise.reject(error);
}
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
API.interceptors.response.use(
(response) => {
console.log("📥 Response Received:", response.config.url);
return response;
},
(error) => {
console.error("❌ API Response Error:", error);
return Promise.reject(error);
}
);

// ===============================
// API FUNCTIONS
// ===============================

// Test API
export const getTransactions = () => API.get("/api/transactions");

// Upload CSV Sheet
export const uploadSheet = (formData) =>
API.post("/api/upload", formData, {
headers: {
"Content-Type": "multipart/form-data",
},
});

// Dashboard Data API
export const getDashboardData = () => API.get("/api/dashboard");

// Example delete API
export const deleteFile = (id) => API.delete(`/api/delete/${id}`);

export default API;

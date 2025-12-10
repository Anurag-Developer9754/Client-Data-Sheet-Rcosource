import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:5000/api",  
  timeout: 20000, 
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // console.log("📤 Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log("📥 Response URL:", response.config.url);
    console.log("📦 Response Data:", response.data);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.data || error.message || error
    );
    return Promise.reject(error);
  }
);


// User Login
export const loginUser = (data) => API.post("/auth/login", data);

// Upload CSV Sheet
export const uploadSheet = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const getDashboardData = ({ params }) =>
  API.get("/dashboard", { params });

// Get All Transactions
export const getTransactions = () => API.get("/transactions");

// Delete File
export const deleteFile = (id) => API.delete(`/delete/${id}`);

export default API;

import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Component/Navbar";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

// 🔒 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* Navbar visible only when logged in */}
        {localStorage.getItem("token") && <Navbar />}

        <Routes>
          {/* Default route → Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard → Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

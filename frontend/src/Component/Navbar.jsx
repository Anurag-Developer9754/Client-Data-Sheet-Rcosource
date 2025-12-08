import React, { useEffect, useState } from "react";
import Logo from "../Images/Rcosource Logo.png";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; // redirect
  };

  return (
    <nav className="bg-white-600 text-black p-4 flex items-center justify-between">
      <a href="/" className="flex items-center">
        <img
          src={Logo}
          alt="Logo"
          className="h-12 w-auto cursor-pointer sm:h-16"
        />
      </a>

      <div className="flex items-center space-x-6 text-base sm:text-lg">
        <a href="/" className="hover:text-green-500 font-medium">
          Home
        </a>
        <a href="/dashboard" className="hover:text-green-500 font-medium">
          Dashboard
        </a>

        {/* SHOW USER NAME + LOGOUT ONLY IF LOGGED IN */}
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-green-600">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="text-red-500 text-xl hover:text-red-700"
              title="Logout"
            >
              🔓
            </button>
          </div>
        ) : (
          // IF NOT LOGGED IN → Show Login Button
          <a href="/login" className="hover:text-green-500 font-medium">
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

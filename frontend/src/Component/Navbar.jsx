import React from "react";
import Logo from "../Images/Rcosource Logo.png";

const Navbar = () => {
  return (
    <nav className="bg-white-600 text-black p-4 flex items-center justify-between">
      <a href="/" className="flex items-center">
        <img src={Logo}  alt="Logo" className="h-12 w-auto cursor-pointer sm:h-16" />
      </a>
      <div className="flex items-center space-x-6 text-base sm:text-lg">
        <a href="/"  className="hover:text-green-500 font-medium">
          Home
        </a>
        <a  href="/dashboard" className="hover:text-green-500 font-medium">
          Dashboard
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

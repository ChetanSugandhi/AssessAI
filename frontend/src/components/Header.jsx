import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleStudentLogin = async () => {
    try {  
      window.location.href = "/authform";  // Redirect only after role is set
    } catch (error) {
      console.error("Error setting student role:", error);
    }
  };
  
  const handleTeacherLogin = async () => {
    const teacherCode = prompt("Enter Teacher Code: #Education");
    if (!teacherCode) return;  // Stop if no code entered

    try {
      const response = await axios.post(
        "/api/set-role/teacher",
        { teacherCode },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        window.location.href = "/teacher-login";  // Redirect only after role is set
      } else {
        alert("Invalid Teacher Code"); // This will work only if backend sends `success: false`
      }
    } catch (error) {
      // Explicitly check for 403 status
      if (error.response && error.response.status === 403) {
        alert("Invalid Teacher Code");  // Show alert if code is wrong
      } else {
        console.error("Error setting teacher role:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src="education.png" alt="AssessAI Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="ml-2 text-xl sm:text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gray-200">Assess</span>
              <span className="bg-clip-text text-transparent bg-cyan-500">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-100 hover:text-blue-500 transition-colors">Home</a>
            <a href="/features" className="text-gray-100 hover:text-blue-500 transition-colors">Features</a>
            <a href="/about" className="text-gray-100 hover:text-blue-500 transition-colors">About</a>
          </nav>
          
          {/* Desktop Login Buttons */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={handleStudentLogin}
              className="px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-cyan-500 hover:bg-cyan-600 transition duration-150 ease-in-out"
            >
              Student Login
            </button>

            <button
              onClick={handleTeacherLogin}
              className="px-4 py-2 text-sm font-medium rounded-md text-cyan-500 bg-slate-800 hover:bg-slate-700 transition duration-150 ease-in-out flex items-center"
            >
              Teacher Login
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="text-gray-200 hover:text-cyan-500 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-cyan-500 hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="/features" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-cyan-500 hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-cyan-500 hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
          </div>
          
          <div className="px-5 py-4 border-t border-slate-700 space-y-3">
            <button
              onClick={() => {
                handleStudentLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-cyan-500 hover:bg-cyan-600 transition duration-150 ease-in-out"
            >
              Student Login
            </button>

            <button
              onClick={() => {
                handleTeacherLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-sm font-medium rounded-md text-cyan-500 bg-slate-800 hover:bg-slate-700 transition duration-150 ease-in-out flex items-center justify-center"
            >
              Teacher Login
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
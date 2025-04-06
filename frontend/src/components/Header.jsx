import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleStudentLogin = async () => {
      try {  
              window.location.href = "/authform";  // Redirect only after role is set
          
      } catch (error) {
          console.error("Error setting student role:", error);
      }
  };
  
const handleTeacherLogin = async () => {
    const teacherCode = prompt("Enter Teacher Code:");
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

  


  return (
    <header className="bg-slate-900 bg-opacity shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src="education.png" alt="AssessAI Logo" className="h-10 w-10" />
            <span className="ml-2 text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gray-200">Assess</span>
              <span className="bg-clip-text text-transparent bg-cyan-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-100 hover:text-blue-500 transition-colors">Home</a>
            <a href="/features" className="text-gray-100 hover:text-blue-500 transition-colors">Features</a>
            <a href="/about" className="text-gray-100 hover:text-blue-500 transition-colors">About</a>
          </nav>
          
          <>
        <div className="flex space-x-4">
          <button
            onClick={handleStudentLogin}
            className="px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-cyan-500 hover:bg-indigo-100 transition duration-150 ease-in-out"
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
    
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate=useNavigate();
    const handleHome = () => {
        navigate('/');};
  return (
    <header className="bg-slate-900 bg-opacity shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div onClick={handleHome}  className="flex items-center cursor-pointer">
            <img 
            src="education.png"
              alt="AssessAI Logo" 
              className="h-10 w-10"
            />
            <span className="ml-2 text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gray-200">Assess</span>
              <span className="bg-clip-text text-transparent bg-cyan-500">AI</span>
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-100 hover:text-blue-500 transition-colors">
              Home
            </a>
            <a href="/features" className="text-gray-100 hover:text-blue-500 transition-colors">
              Features
            </a>
            <a href="/about" className="text-gray-100 hover:text-blue-500 transition-colors">
              About
            </a>
          </nav>
          
          <div className="flex space-x-4">
            <a 
              href="/authform" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-indigo-50 bg-cyan-500 hover:bg-indigo-100 transition duration-150 ease-in-out"
            >
              Student Login
            </a>
            <a 
              href="/teacher-login" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-cyan-500 bg-slate-800 hover:bg-slate-700 transition duration-150 ease-in-out"
            >
              Teacher Login
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
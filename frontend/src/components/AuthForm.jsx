import React, { useState } from 'react';
import { Github, Facebook, Linkedin } from 'lucide-react';

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100">
      <div className={`bg-white rounded-[30px] shadow-lg relative overflow-hidden w-[768px] max-w-full min-h-[480px] ${isActive ? 'active' : ''}`}>
        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${
          isActive ? 'translate-x-[100%] opacity-100 z-[5]' : 'left-0 w-1/2 opacity-0 z-[1]'
        }`}>
          <form className="bg-white h-full flex flex-col items-center justify-center pl-117 mr-24">
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>
            <div className="flex gap-3 my-5">
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <span className="text-sm text-gray-500">or</span>
            <input 
              type="text" 
              placeholder="Name" 
              className="bg-gray-100 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-gray-100 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none"
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="bg-gray-100 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none"
            />
            <button className="bg-[#1f5355] text-white text-sm px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-[#1a4547] transition-colors">
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${
          isActive ? 'translate-x-[100%]' : 'left-0 w-1/2 z-[2]'
        }`}>
          <form className="bg-white h-full flex flex-col items-center justify-center px-10">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <div className="flex gap-3 my-5">
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <span className="text-sm text-gray-500">or</span>
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-gray-100 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none"
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="bg-gray-100 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none"
            />
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900 my-4">Forgot Password?</a>
            <button className="bg-[#1f5355] text-white text-sm px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-[#1a4547] transition-colors">
              Sign In
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out rounded-l-[150px] rounded-bl-[100px] z-[1000] ${
          isActive ? '-translate-x-full rounded-l-none rounded-r-[150px] rounded-br-[100px]' : ''
        }`}>
          <div className={`bg-gradient-to-r from-[#1f5355] to-[#1f5355] text-white relative -left-full h-full w-[200%] transform ${
            isActive ? 'translate-x-1/2' : 'translate-x-0'
          } transition-transform duration-900 ease-in-out`}>
            {/* Toggle Left Panel */}
            <div className={`absolute left-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transform ${
              isActive ? 'translate-x-0' : '-translate-x-[200%]'
            } transition-transform duration-600 ease-in-out`}>
              <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
              <button 
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-sm px-11 py-2.5 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Toggle Right Panel */}
            <div className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transform ${
              isActive ? 'translate-x-[200%]' : 'translate-x-0'
            } transition-transform duration-600 ease-in-out`}>
              <video autoPlay muted loop className="w-auto h-[40%] rounded-[65px] shadow-lg">
                <source src="https://assets.mixkit.co/videos/preview/mixkit-white-lines-on-a-black-background-97047-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button 
                onClick={() => setIsActive(true)}
                className="bg-transparent border border-white text-white text-sm px-11 py-2.5 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
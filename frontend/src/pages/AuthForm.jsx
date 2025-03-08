import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password
    };

    try {
      const response = await axios.post('http://localhost:7777/registerUser', userData);
      console.log(response.data.message);

      if (response.status === 200) {
        navigate('/student-dashboard');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001a2c] to-slate-950">
      <div className={`bg-slate-900 rounded-[30px] shadow-2xl relative overflow-hidden w-[768px] max-w-full min-h-[480px] border border-slate-800 ${isActive ? 'active' : ''}`}>
        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${isActive ? 'translate-x-[100%] opacity-100 z-[5]' : 'left-0 w-1/2 opacity-0 z-[1]'}`}>
          <form onSubmit={handleSignUp} className="bg-slate-900 h-full flex flex-col items-center justify-center pl-17 mr-24">
            <h1 className="text-2xl font-bold mb-4 text-cyan-400">Create Account</h1>
            <button 
              type="button"
              className="w-full max-w-[280px] bg-slate-800 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors mb-4"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>
            <span className="text-sm text-slate-400">or</span>
            <input
              type="text"
              placeholder="Name"
              className="bg-slate-800 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-slate-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-slate-800 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-slate-800 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-cyan-500 text-white text-sm px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-cyan-600 transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${isActive ? 'translate-x-[100%]' : 'left-0 w-1/2 z-[2]'}`}>
          <form onSubmit={handleSignUp} className="bg-slate-900 h-full flex flex-col items-center justify-center px-10">
            <h1 className="text-2xl font-bold mb-4 text-cyan-400">Sign In</h1>
            <button 
              type="button"
              className="w-full max-w-[280px] bg-slate-800 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors mb-4"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            <span className="text-sm text-slate-400">or</span>
            <input
              type="email"
              placeholder="Email"
              className="bg-slate-800 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-slate-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-slate-800 border-none my-2 px-4 py-2 text-sm rounded-lg w-full outline-none text-white placeholder-slate-400"
            />
            <a href="#" className="text-sm text-slate-400 hover:text-cyan-400 my-4">Forgot Password?</a>
            <button className="bg-cyan-500 text-white text-sm px-11 py-2.5 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-cyan-600 transition-colors">
              Sign In
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out rounded-l-[180px] rounded-bl-[150px] z-[1000] ${isActive ? '-translate-x-full rounded-l-xl rounded-r-[180px] rounded-br-[120px]' : ''}`}>
          <div className={`bg-gradient-to-b from-cyan-500 to-cyan-600 text-white relative -left-full h-full w-[200%] transform ${isActive ? 'translate-x-1/2' : 'translate-x-0'} transition-transform duration-600 ease-in-out`}>
            {/* Toggle Left Panel */}
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transform ${isActive ? 'translate-x-0' : '-translate-x-[200%]'} transition-transform duration-600 ease-in-out`}>
              <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
              <button
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-sm px-11 py-2.5 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Toggle Right Panel */}
            <div className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transform ${isActive ? 'translate-x-[200%]' : 'translate-x-0'} transition-transform duration-600 ease-in-out`}>
              <img src="/assets/man.png" alt="Man" className="w-auto h-[40%] rounded-[65px] shadow-lg" />
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
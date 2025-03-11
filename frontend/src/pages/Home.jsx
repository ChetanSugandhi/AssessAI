"use client"

import { useEffect, useRef } from "react"
import { Brain, Lightbulb, Users, ArrowRight, Star, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate
import axios from "axios"; // Make sure to import axios

function Home() {
  const containerRef = useRef(null);
  const navigate = useNavigate(); // Move useNavigate here

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Subtle light movement based on mouse position
      const lightElement = containerRef.current.querySelector(".light-beam");
      if (lightElement) {
        const moveX = (x / rect.width - 0.5) * 10;
        const moveY = (y / rect.height - 0.5) * 5;
        lightElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const handleStudentDashboard = async () => {
    try {
        const response = await axios.get("http://localhost:7777/auth/check", { withCredentials: true });

        console.log("Auth Check Response:", response.data); // Debugging
        navigate(response.data.redirectTo);
    } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/authform"); // Redirect if error occurs
    }
};




  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section with Lamp Effect */}
      <section
        ref={containerRef}
        className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-[#001a2c] to-slate-950 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        {/* Light beam effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[300px] light-beam">
          <div className="w-full h-full bg-cyan-500 blur-[100px] opacity-30"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-cyan-500 shadow-[0_0_20px_10px_rgba(14,165,233,0.5)]"></div>
        </div>

        {/* Text content */}
        <div className="relative z-10 text-center max-w-7xl mx-auto pt-20 pb-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 text-white">
            <span className="text-gray-200">Assess</span><span className="text-cyan-500">AI</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Revolutionizing education with AI-powered feedback that helps teachers provide personalized, timely
            assessments and empowers students to excel.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStudentDashboard}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white bg-cyan-500 hover:bg-cyan-600 transition"
            >
              Student Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="/teacher-dashboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-cyan-500 bg-slate-800 hover:bg-slate-700 transition"
            >
              Teacher Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">How AssessAI Transforms Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain />,
              title: "AI-Powered Insights",
              desc: "Our advanced AI analyzes student work to provide detailed, constructive feedback that identifies strengths and areas for improvement.",
            },
            {
              icon: <Lightbulb />,
              title: "Personalized Learning",
              desc: "Students receive tailored feedback that addresses their specific needs, helping them progress at their own pace.",
            },
            {
              icon: <Users />,
              title: "Teacher Empowerment",
              desc: "Teachers save time on routine grading while gaining deeper insights into student performance and class-wide trends.",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <MessageCircle className="h-12 w-12 text-cyan-500 mb-4" />
              <p className="text-gray-400 italic">
                "This platform has completely changed how I learn and receive feedback. Highly recommended!"
              </p>
              <div className="mt-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-cyan-500 rounded-xl shadow-xl overflow-hidden text-center p-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
            Ready to transform your educational experience?
          </h2>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto mb-10">
            Join thousands of teachers and students already benefiting from AI-enhanced feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStudentDashboard}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-cyan-500 bg-white hover:bg-gray-50 transition"
            >
              Sign Up as Student
            </button>
            <a
              href="/teacher-signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white bg-cyan-900 hover:bg-cyan-800 transition"
            >
              Sign Up as Teacher
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
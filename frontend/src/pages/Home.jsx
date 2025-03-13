"use client"

import { useEffect, useRef } from "react"
import { Brain, Lightbulb, Users, ArrowRight, BookOpen, GraduationCap, School } from "lucide-react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Import framer-motion

function Home() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

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
        console.log("Auth Check Response:", response.data);
        navigate(response.data.redirectTo);
    } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/authform");
    }
  };

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const featureCardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  const statsVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 50,
        damping: 15
      }
    }
  };

  const ctaVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section with Lamp Effect */}
      <motion.section
        ref={containerRef}
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-[#001a2c] to-slate-950 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        {/* Light beam effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[300px] light-beam">
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="w-full h-full bg-cyan-500 blur-[100px] opacity-30"
          ></motion.div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-cyan-500 shadow-[0_0_20px_10px_rgba(14,165,233,0.5)]"></div>
        </div>

        {/* Text content */}
        <div className="relative z-10 text-center max-w-7xl mx-auto pt-20 pb-16">
          <motion.h1 
            variants={itemVariants}
            className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 text-white"
          >
            <span className="text-gray-200">Assess</span>
            <motion.span 
              animate={{ 
                color: ["#06b6d4", "#22d3ee", "#06b6d4"],
                textShadow: [
                  "0 0 5px rgba(14,165,233,0.3)",
                  "0 0 15px rgba(14,165,233,0.5)",
                  "0 0 5px rgba(14,165,233,0.3)"
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-cyan-500"
            >
              AI
            </motion.span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Revolutionizing education with AI-powered feedback that helps teachers provide personalized, timely
            assessments and empowers students to excel.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleStudentDashboard}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white bg-cyan-500 hover:bg-cyan-600 transition"
            >
              Student Portal
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.div>
            </motion.button>
            <motion.a
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              href="/teacher-dashboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-cyan-500 bg-slate-800 hover:bg-slate-700 transition"
            >
              Teacher Portal
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.div>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-white mb-12"
        >
          How AssessAI Transforms Education
        </motion.h2>
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
            <motion.div 
              key={index}
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white mb-5"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Educational Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900 rounded-xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-white mb-12"
        >
          Educational Impact
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <BookOpen />,
              stat: "40%",
              title: "Improvement in Student Engagement",
              desc: "Students are more likely to engage with personalized AI feedback compared to traditional grading methods."
            },
            {
              icon: <GraduationCap />,
              stat: "35%",
              title: "Better Learning Outcomes",
              desc: "Our AI-powered platform helps students achieve better grades and more comprehensive understanding."
            },
            {
              icon: <School />,
              stat: "50%",
              title: "Time Saved for Educators",
              desc: "Teachers can focus more on creative instruction and less on routine assessment tasks."
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-6"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/20 text-cyan-400 mb-4"
              >
                {stat.icon}
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ["#06b6d4", "#22d3ee", "#06b6d4"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.3
                }}
                className="text-4xl font-bold text-cyan-500 mb-2"
              >
                {stat.stat}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{stat.title}</h3>
              <p className="text-gray-400">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-slate-800 p-8 rounded-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 text-white mb-4"
              >
                <span className="font-bold">1</span>
              </motion.div>
              <h4 className="text-lg font-semibold text-white mb-2">Submit Work</h4>
              <p className="text-gray-400">Students submit assignments through our intuitive platform.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 text-white mb-4"
              >
                <span className="font-bold">2</span>
              </motion.div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-gray-400">Our AI engine analyzes the work based on learning objectives and rubrics.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 text-white mb-4"
              >
                <span className="font-bold">3</span>
              </motion.div>
              <h4 className="text-lg font-semibold text-white mb-2">Actionable Feedback</h4>
              <p className="text-gray-400">Students and teachers receive detailed, personalized feedback to improve learning.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          animate="pulse"
          viewport={{ once: true, margin: "-50px" }}
          className="bg-cyan-500 rounded-xl shadow-xl overflow-hidden text-center p-12"
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
            Ready to transform your educational experience?
          </h2>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto mb-10">
            Join thousands of teachers and students already benefiting from AI-enhanced feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleStudentDashboard}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-cyan-500 bg-white hover:bg-gray-50 transition"
            >
              Sign Up as Student
            </motion.button>
            <motion.a
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              href="/teacher-signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white bg-cyan-900 hover:bg-cyan-800 transition"
            >
              Sign Up as Teacher
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
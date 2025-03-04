import React from 'react';
import { 
  BookOpen, 
  Clock, 
  MessageCircle, 
  CheckCircle, 
  Zap, 
  Users 
} from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Empower Teachers, Personalize Learning
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          An AI-powered assistant that automates grading, provides personalized feedback, 
          and helps educators focus on what matters most - teaching and mentoring students.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Challenge in Education
              </h2>
              <p className="text-gray-600 mb-4">
                Teachers are overwhelmed with administrative tasks, spending countless hours 
                on manual grading and providing feedback. This leaves limited time for 
                personalized instruction and student mentorship.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <Clock className="mr-3 text-blue-600" />
                  Time-consuming manual grading processes
                </li>
                <li className="flex items-center">
                  <Users className="mr-3 text-blue-600" />
                  Large classroom sizes limiting individual attention
                </li>
                <li className="flex items-center">
                  <MessageCircle className="mr-3 text-blue-600" />
                  Lack of personalized, timely feedback
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="/api/placeholder/600/400" 
                alt="Classroom Challenge" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Solution Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our AI-Powered Solution
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            TeacherAI Assistant leverages artificial intelligence to transform 
            the educational experience for both teachers and students.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen size={48} className="text-blue-600 mb-4" />,
              title: "Automated Grading",
              description: "Instantly grade assignments with precise, consistent scoring."
            },
            {
              icon: <CheckCircle size={48} className="text-green-600 mb-4" />,
              title: "Personalized Feedback",
              description: "Generate detailed, constructive feedback for each student."
            },
            {
              icon: <Zap size={48} className="text-yellow-600 mb-4" />,
              title: "Time Saving",
              description: "Free up educators to focus on teaching and student interaction."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-all">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Transform Education Today
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join our mission to support teachers, personalize learning, 
          and contribute to UN SDG 4: Quality Education.
        </p>
        <button className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors">
          Start Your Free Trial
        </button>
      </div>
    </div>
  );
};

export default Home;
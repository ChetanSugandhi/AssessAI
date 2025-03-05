import React from 'react';
import { BookOpen, Brain, Lightbulb, Users, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-indigo-900 tracking-tight sm:text-6xl mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              AssessAI
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Revolutionizing education with AI-powered feedback that helps teachers provide personalized, 
            timely assessments and empowers students to excel.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/authform" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out"
            >
              Student Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="/teacher-login" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition duration-150 ease-in-out shadow-sm"
            >
              Teacher Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How AssessAI Transforms Education
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-5">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Our advanced AI analyzes student work to provide detailed, constructive feedback that identifies strengths and areas for improvement.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-5">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Learning</h3>
            <p className="text-gray-600">
              Students receive tailored feedback that addresses their specific needs, helping them progress at their own pace.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-5">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Teacher Empowerment</h3>
            <p className="text-gray-600">
              Teachers save time on routine grading while gaining deeper insights into student performance and class-wide trends.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-xl shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About AssessAI</h2>
            <p className="text-gray-600 mb-6">
              AssessAI was developed by educators and AI specialists with a shared vision: to create a tool that enhances the educational experience for both teachers and students.
            </p>
            <p className="text-gray-600 mb-6">
              Our platform uses state-of-the-art natural language processing to analyze student submissions, providing detailed feedback that goes beyond simple grading.
            </p>
            <p className="text-gray-600">
              By automating routine assessment tasks, we free teachers to focus on what matters most—meaningful interactions with students and creative teaching strategies.
            </p>
          </div>
          
          <div className="relative h-64 lg:h-auto overflow-hidden rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="Students learning with technology" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16 text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl mb-6">
              Ready to transform your educational experience?
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
              Join thousands of teachers and students already benefiting from AI-enhanced feedback.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/student-signup" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                Sign Up as Student
              </a>
              <a 
                href="/teacher-signup" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-800 transition duration-150 ease-in-out"
              >
                Sign Up as Teacher
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Users Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                <p className="text-sm text-gray-500">English Teacher</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "AssessAI has revolutionized how I provide feedback. I can now give detailed comments on every student's work without staying up all night grading papers."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold">Michael Chen</h4>
                <p className="text-sm text-gray-500">Math Teacher</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "The insights I get from AssessAI help me identify patterns in student understanding that I might have missed otherwise. It's like having a teaching assistant who never gets tired."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold">Emily Rodriguez</h4>
                <p className="text-sm text-gray-500">Student, Grade 11</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "I love getting feedback right away instead of waiting days for my assignments to be returned. The specific suggestions help me understand exactly what I need to improve."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
import React from 'react';
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
                <div className="col-span-1 md:col-span-1">
                <div className="flex items-center">
                <img 
              src="education.png" 
              alt="AssessAI Logo" 
              className="h-10 w-10"
            />
                  <span className="ml-2 text-2xl font-bold text-gray-200">
                  Assess<span className="text-cyan-500">AI</span>
                  </span>
                </div>
                <p className="mt-4 text-gray-400">
                  Revolutionizing education with AI-powered feedback for teachers and students.
                </p>
                </div>
                
                {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>
          
          {/* Portal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-500">Portals</h3>
            <ul className="space-y-2">
              <li>
                <a href="/student-login" className="text-gray-400 hover:text-white transition-colors">
                  Student Login
                </a>
              </li>
              <li>
                <a href="/student-signup" className="text-gray-400 hover:text-white transition-colors">
                  Student Sign Up
                </a>
              </li>
              <li>
                <a href="/teacher-login" className="text-gray-400 hover:text-white transition-colors">
                  Teacher Login
                </a>
              </li>
              <li>
                <a href="/teacher-signup" className="text-gray-400 hover:text-white transition-colors">
                  Teacher Sign Up
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-500">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-cyan-500 mr-2" />
                <span className="text-gray-400">123 Education Ave, Learning City</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cyan-500 mr-2" />
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cyan-500 mr-2" />
                <a href="mailto:info@assessai.com" className="text-gray-400 hover:text-white transition-colors">
                  info@assessai.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AssessAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
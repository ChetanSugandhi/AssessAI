import React from 'react';
import { BookOpen, Users, GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
          <GraduationCap size={36} className="text-white" />
          <h1 className="text-2xl font-bold">TeacherAI Assistant</h1>
        </div>
        <nav className="flex space-x-6">
          <a href="/signup" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
            <BookOpen size={20} />
            <span>Features</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
            <Users size={20} />
            <span>About</span>
          </a>
          <a href="#" className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors">
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
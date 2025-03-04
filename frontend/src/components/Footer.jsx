import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto grid md:grid-cols-3 gap-8 px-4">
        <div>
          <h3 className="text-xl font-bold mb-4">TeacherAI Assistant</h3>
          <p className="text-gray-400">
            Empowering educators through intelligent technology, supporting personalized learning 
            and reducing administrative burdens.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-300 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-blue-300 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-blue-300 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-blue-300 transition-colors">Support</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Mail size={24} />
            </a>
          </div>
          <div className="mt-4">
            <p className="text-gray-400">© 2024 TeacherAI Assistant. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
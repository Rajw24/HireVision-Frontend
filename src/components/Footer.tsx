import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Twitter, Linkedin, Github } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                          <img src="./src/assests/logo.png" alt="HireVision.AI" className="h-12" />
                        </Link>
              <span className="ml-2 text-xl font-bold">HireVision.AI</span>
            </div>
            <p className="mt-4 text-gray-400">
              Empowering your interview journey with AI-powered tools and insights.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/resume-builder" className="text-gray-400 hover:text-white">AI Resume Builder</Link></li>
              <li><Link to="/mock-interview" className="text-gray-400 hover:text-white">AI Mock Interview</Link></li>
              <li><Link to="/question-bank" className="text-gray-400 hover:text-white">Question Bank</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} HireVision.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
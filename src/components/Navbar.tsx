import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left: Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <img
                src="./src/assests/logo-tr.png"
                alt="HireVision.AI"
                className="h-12"
              />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex justify-center space-x-8 whitespace-nowrap">
            <Link
              to="/resume-builder"
              className="text-[#024aad] hover:text-[#41b0f8] transition-colors duration-300"
            >
              AI Resume Builder
            </Link>
            <Link
              to="/aptitude-test"
              className="text-[#024aad] hover:text-[#41b0f8] transition-colors duration-300"
            >
              Aptitude Test
            </Link>
            <Link
              to="/mock-interview"
              className="text-[#024aad] hover:text-[#41b0f8] transition-colors duration-300"
            >
              AI Mock Interview
            </Link>
            <Link
              to="/question-bank"
              className="text-[#024aad] hover:text-[#41b0f8] transition-colors duration-300"
            >
              Question Bank
            </Link>
          </div>

          {/* Right: Authentication */}
          <div className="flex justify-end space-x-4 items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-[#024aad] hover:text-[#41b0f8] transition-colors duration-300 px-4 py-2"
                >
                  <User size={20} />
                  <span>{user.first_name || 'My Account'}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#024aad] hover:text-[#41b0f8] transition-colors duration-300 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#024aad] text-white px-4 py-2 rounded-lg hover:bg-[#41b0f8] transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

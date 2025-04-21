import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
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
                className="h-12 transform transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex justify-center space-x-8 whitespace-nowrap">
            <NavLink to="/resume-builder" isActive={isActive('/resume-builder')}>
              AI Resume Builder
            </NavLink>
            <NavLink to="/aptitude-test" isActive={isActive('/aptitude-test')}>
              Aptitude Test
            </NavLink>
            <NavLink to="/mock-interview" isActive={isActive('/mock-interview')}>
              AI Mock Interview
            </NavLink>
            <NavLink to="/question-bank" isActive={isActive('/question-bank')}>
              Question Bank
            </NavLink>
          </div>

          {/* Right: Authentication */}
          <div className="flex justify-end space-x-4 items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-[#024aad] hover:text-[#41b0f8] transition-all duration-300 px-4 py-2 rounded-md hover:bg-blue-50"
                >
                  <User size={20} />
                  <span>{user.first_name || 'My Account'}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#41b0f8] transition-colors duration-300"
                      onClick={() => setShowDropdown(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300 flex items-center"
                    >
                      <LogOut size={16} className="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative text-[#024aad] hover:text-[#41b0f8] transition-colors duration-300 px-4 py-2 overflow-hidden group"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#41b0f8] group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#024aad] text-white px-4 py-2 rounded-lg hover:bg-[#41b0f8] transition-all duration-300 transform hover:scale-105 hover:shadow-md"
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

// Custom NavLink component with animation
function NavLink({ to, isActive, children }: { to: string; isActive: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`relative py-5 px-1 transition-colors duration-300 group ${
        isActive ? 'text-[#41b0f8]' : 'text-[#024aad] hover:text-[#41b0f8]'
      }`}
    >
      <span>{children}</span>
      <span 
        className={`absolute bottom-0 left-0 h-0.5 bg-[#41b0f8] transition-all duration-300 ease-out ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      ></span>
    </Link>
  );
}

export default Navbar;
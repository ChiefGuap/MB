import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, History, LogOut, LogIn, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-sage flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">MB</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Mental Boost</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-sage transition-colors">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/session" className="text-gray-700 hover:text-sage transition-colors">
                  Start Session
                </Link>
                <Link to="/history" className="text-gray-700 hover:text-sage transition-colors">
                  History
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-sage transition-colors">
                  Profile
                </Link>
                <button 
                  onClick={logout} 
                  className="text-gray-700 hover:text-sage transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" /> 
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-sage transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-white shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-fluid py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="flex items-center py-2 text-gray-700 hover:text-sage transition-colors">
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              {user ? (
                <>
                  <Link to="/session" className="flex items-center py-2 text-gray-700 hover:text-sage transition-colors">
                    <User className="w-5 h-5 mr-2" />
                    Start Session
                  </Link>
                  <Link to="/history" className="flex items-center py-2 text-gray-700 hover:text-sage transition-colors">
                    <History className="w-5 h-5 mr-2" />
                    History
                  </Link>
                  <Link to="/profile" className="flex items-center py-2 text-gray-700 hover:text-sage transition-colors">
                    <User className="w-5 h-5 mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={logout} 
                    className="flex items-center py-2 text-gray-700 hover:text-sage transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center py-2 text-gray-700 hover:text-sage transition-colors">
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
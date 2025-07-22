// src/components/layout/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Access authentication context

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Get user state and logout function
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle user logout
  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Application Logo/Title, links to home (dashboard if logged in) */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors duration-200">
          DeepSearch
        </Link>
        
        {/* Navigation links (conditional based on authentication status) */}
        <div className="flex items-center space-x-6">
          {user ? (
            // If user is logged in, show welcome message and Logout button
            <>
              <span className="text-lg font-medium">Welcome, {user.email || 'User'}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is not logged in, show Login and Signup links
            <>
              <Link
                to="/login"
                className="text-lg font-medium hover:text-blue-400 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

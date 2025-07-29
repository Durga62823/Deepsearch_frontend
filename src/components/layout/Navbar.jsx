// src/components/layout/Navbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Upload, Bell, UserCircle, Plus } from "lucide-react";

// Navbar component displays the top application bar.
// It now takes an 'onUploadClick' prop to trigger the upload modal.
const Navbar = ({ onUploadClick }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Reset welcome message visibility and set timeout when user changes (e.g., on login/logout)
  useEffect(() => {
    let timer;
    if (user) {
      setShowWelcomeMessage(true); // Show message when user logs in
      // Set a timer to hide the message after 5 seconds
      timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000); // 5000 milliseconds = 5 seconds
    } else {
      setShowWelcomeMessage(false); // Hide message when user logs out
    }

    // Cleanup function to clear the timer if the component unmounts or user logs out
    return () => {
      clearTimeout(timer);
    };
  }, [user]);

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 text-foreground py-4 px-6 md:px-20 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: DeepSearch Logo (always visible) */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 font-semibold text-2xl text-foreground hover:text-gray-700 transition-colors duration-200">
            Deep<span className="text-red-600">Search</span>
          </Link>
        </div>

        {/* Center Section: Welcome Message (conditional and hideable) */}
        {user && showWelcomeMessage && (
          <h1
            className="text-xl font-semibold tracking-tight cursor-pointer mx-auto"
            onClick={() => setShowWelcomeMessage(false)} // Still allows manual hiding
            title="Click to hide message"
          >
            Welcome back, {user.name || user.email || 'User'}! 👋
          </h1>
        )}

        {/* Right Section: Upload, Notifications, User Profile (conditional on user login) */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button onClick={onUploadClick} className="flex items-center gap-2 rounded-lg px-4 py-2">
                <Plus className="h-4 w-4" /> Upload
              </Button>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-8 w-8 text-gray-600" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-lg px-4 py-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-medium hover:text-blue-600 transition-colors duration-200">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200">
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

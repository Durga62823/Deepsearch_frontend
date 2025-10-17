import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Upload, Bell, UserCircle, Plus, Menu, X, LogOut, Settings, User, Mail, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = ({ onUploadClick }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (user) {
      setShowWelcomeMessage(true);
      timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
    } else {
      setShowWelcomeMessage(false);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserEmail = () => {
    return user?.email || 'No email available';
  };

  const getUserName = () => {
    return user?.name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <nav className="bg-white border-b border-gray-200 text-foreground py-3 px-4 sm:py-4 sm:px-6 lg:px-20 shadow-sm relative z-[1000]">
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl sm:text-2xl text-foreground hover:text-gray-700 transition-colors duration-200">
            Deep<span className="text-red-600">Search</span>
          </Link>
        </div>

        {user && showWelcomeMessage && (
          <h1
            className="hidden sm:block text-lg sm:text-xl font-semibold tracking-tight cursor-pointer mx-auto"
            onClick={() => setShowWelcomeMessage(false)}
            title="Click to hide message"
          >
            Welcome back, {user.name || user.email || 'User'}! 👋
          </h1>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {/* The upload button for desktop has been removed */}
              
              <Button variant="ghost" size="icon" className="relative rounded-full hidden sm:flex">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </Button>

              {/* Added a prominent Logout button for desktop views */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
              
              {/* Profile dropdown container */}
              <div>
                {/* Removed manual hover logic and let DropdownMenu handle its own state */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex hover:bg-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={getUserName()} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                          {getUserInitials(getUserName())}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-80 z-[10000]"
                    align="end"
                    sideOffset={8}
                    avoidCollisions={true}
                    collisionPadding={8}
                  >
                    {/* User Profile Header */}
                    <div className="flex items-center space-x-3 p-4 border-b border-gray-100">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.avatar} alt={getUserName()} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                          {getUserInitials(getUserName())}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {getUserName()}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate">{getUserEmail()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <DropdownMenuLabel className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem className="cursor-pointer flex items-center px-4 py-3 hover:bg-gray-50">
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Profile</p>
                        <p className="text-xs text-gray-500">View and edit your profile</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer flex items-center px-4 py-3 hover:bg-gray-50">
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Settings</p>
                        <p className="text-xs text-gray-500">Manage your preferences</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer flex items-center px-4 py-3 hover:bg-gray-50">
                      <Shield className="mr-3 h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Security</p>
                        <p className="text-xs text-gray-500">Password and security settings</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* The Logout button within the dropdown is still available */}
                    <DropdownMenuLabel className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer flex items-center px-4 py-3 hover:bg-red-50 text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sign Out</p>
                        <p className="text-xs text-red-500">End your current session</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="sm:hidden"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm sm:text-lg font-medium hover:text-blue-600 transition-colors duration-200">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && user && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile User Profile */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={getUserName()} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                  {getUserInitials(getUserName())}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getUserName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getUserEmail()}
                </p>
              </div>
            </div>

            {/* The upload button for mobile has been removed */}
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start rounded-lg px-3 py-2 bg-black hover:bg-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
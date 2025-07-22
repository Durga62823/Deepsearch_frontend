// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  console.log('AuthContext: Initializing, user:', user, 'loading:', loading);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user'); // User data could include email, ID, name etc.

    console.log('AuthContext useEffect: Checking localStorage...');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Basic validation for parsed user object, e.g., check if it has an 'id' or 'email'
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          console.log('AuthContext useEffect: User found in localStorage:', parsedUser);
        } else {
          // If userData is not valid, clear it
          console.warn('AuthContext useEffect: Invalid user data in localStorage, clearing it.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (e) {
        // Handle case where userData is not valid JSON
        console.error("AuthContext useEffect: Failed to parse user data from localStorage:", e);
        // Clear invalid data to prevent persistent errors
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null); // Ensure user is null if data is bad
      }
    } else {
      console.log('AuthContext useEffect: No token or user data found in localStorage.');
      setUser(null);
    }
    setLoading(false);
    console.log('AuthContext useEffect: Initial check complete, loading set to false.');
  }, []); 

  // Log state whenever it changes (for debugging purposes)
  useEffect(() => {
    console.log('AuthContext State Changed: user:', user, 'loading:', loading);
  }, [user, loading]);


  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data as a string
    setUser(userData);
    console.log('AuthContext: User logged in:', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('AuthContext: User logged out.');
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

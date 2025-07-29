// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// --- FIX 1: The missing useAuth hook ---
// This is the custom hook that your other components will use to get the context data.
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // --- FIX 2: Add state for the token
  const [loading, setLoading] = useState(true);

  // This effect runs once on app load to check for a persisted session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && (parsedUser.id || parsedUser.email)) {
          setUser(parsedUser);
          setAccessToken(token); // Set the token from localStorage into state
        } else {
          // Clear invalid data from storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []); 

  // Log state for debugging
  useEffect(() => {
    console.log('AuthContext State Changed:', { user, accessToken, loading });
  }, [user, accessToken, loading]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setAccessToken(token); // Set the token in state on login
    console.log('AuthContext: User logged in:', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAccessToken(null); // Clear the token from state on logout
    console.log('AuthContext: User logged out.');
  };

  const value = {
    user,
    accessToken, // --- FIX 2: Provide the accessToken to the rest of your app ---
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Layout from './components/layout/Layout'; // Main layout component
import LoginPage from './pages/LoginPage';         // Login page
import SignupPage from './pages/SignupPage';       // Signup page
import DashboardPage from './pages/DashboardPage'; // User dashboard page
import DocumentViewPage from './pages/DocumentViewPage'; // Page to view a single document
import { AuthContext } from './context/AuthContext'; // Authentication context for user state


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); 
  const location = useLocation(); 

  console.log(`PrivateRoute: Path: ${location.pathname}, User: ${user ? user.email : 'null'}, Loading: ${loading}`);

  if (loading) {
    console.log('PrivateRoute: Still loading authentication status...');
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-xl text-gray-700">Loading application...</p>
      </div>
    );
  }

  if (!user) {
    console.log('PrivateRoute: User not authenticated, redirecting to /login');

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: User authenticated, rendering children.');
  return children;
};


function App() {
  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/" element={<Layout />}>

        <Route 
          path="dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage /> 
            </PrivateRoute>
          } 
        />
        <Route 
          path="documents/:id" 
          element={
            <PrivateRoute>
              <DocumentViewPage />
            </PrivateRoute>
          } 
        />
      
        <Route index element={<Navigate to="/login" replace />} />
       
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

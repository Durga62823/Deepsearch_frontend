import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AskAIPage from './pages/AskAIPage';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DocumentViewPage from './pages/DocumentViewPage';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); 
  const location = useLocation(); 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-xl text-gray-700">Loading application...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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
            <Route
          path="ask-ai"
          element={
            <PrivateRoute>
              <AskAIPage />
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

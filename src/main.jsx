// src/main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

// Import your global CSS files
import './index.css';
import './App.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Log a critical error if the root element is not found
  console.error("Critical Error: Root element with ID 'root' not found in index.html!");
} else {
  // Render the React application into the root element
  createRoot(rootElement).render(
    <StrictMode>
      {/* BrowserRouter provides routing context to the entire application */}
      <BrowserRouter>
        {/* AuthProvider makes authentication state globally accessible */}
        <AuthProvider>
          <App /> {/* The main App component, where layouts and routes are defined */}
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

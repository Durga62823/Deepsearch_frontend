// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    // Keep a simple wrapper div
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navbar />

      {/* Main content area - simplified styles */}
      <main style={{ flexGrow: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Outlet /> {/* THIS IS WHERE YOUR PAGE CONTENT SHOULD RENDER */}
      </main>

      {/* Footer - simplified styles */}
      <footer style={{ backgroundColor: 'black', color: 'white', padding: '15px', textAlign: 'center', fontSize: '14px' }}>
        © {new Date().getFullYear()} DeepSearch. All rights reserved.
      </footer>
    </div>
    
  );
};

export default Layout;

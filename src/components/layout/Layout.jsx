// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import UploadModal from '@/components/dashboard/UploadModal';
import { ToastContainer, toast } from 'react-toastify';

const Layout = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadSuccess = (newDocument) => {
    setShowUploadModal(false);
    toast.success('Document uploaded successfully!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      <Navbar onUploadClick={() => setShowUploadModal(true)} />

      <main className="flex-grow w-full px-4 py-4 sm:px-6 lg:px-8 xl:px-20">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center text-xs sm:text-sm">
        © {new Date().getFullYear()} DeepSearch. All rights reserved.
      </footer>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        className="text-xs sm:text-sm"
      />
    </div>
  );
};

export default Layout;

// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import UploadModal from '@/components/dashboard/UploadModal'; // Changed import path to use alias
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

      <main className="flex-grow container mx-auto px-6 py-8 md:px-20">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        © {new Date().getFullYear()} DeepSearch. All rights reserved.
      </footer>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Layout;

// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import UploadModal from '@/components/dashboard/UploadModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadSuccess = (newDocument) => {
    setShowUploadModal(false);
    toast.success('Document uploaded successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-inter">
      {/* <Navbar onUploadClick={() => setShowUploadModal(true)} /> */}

      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DS</span>
                </div>
                <h3 className="text-xl font-bold">DeepSearch</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                AI-powered document analysis and intelligent search platform for modern teams.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/ask-ai" className="text-gray-300 hover:text-white transition-colors">Ask AI</a></li>
                <li><a href="/documents" className="text-gray-300 hover:text-white transition-colors">Documents</a></li>
                <li><a href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>📧 support@deepsearch.com</p>
                <p>🌐 www.deepsearch.com</p>
                <p>📱 +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} DeepSearch. All rights reserved. | 
              <a href="/privacy" className="ml-2 hover:text-white transition-colors">Privacy Policy</a> | 
              <a href="/terms" className="ml-2 hover:text-white transition-colors">Terms of Service</a>
            </p>
          </div>
        </div>
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
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="text-sm"
        toastClassName="bg-white border border-gray-200 shadow-lg rounded-lg"
        bodyClassName="text-gray-800"
        progressClassName="bg-gradient-to-r from-blue-500 to-purple-600"
      />
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { documentAPI } from '../services/api';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toast } from 'react-toastify';
import ChatWindow from '../components/chat/ChatWindow';
import { MessageSquare, X } from 'lucide-react';

export default function DocumentViewPage() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await documentAPI.getById(id);
        setDocument(response.data.document);
      } catch (err) {
        setError('Failed to load document. It might not exist or you do not have access.');
        toast.error('Failed to load document.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDocument();
    } else {
      setLoading(false);
      setError('No document ID provided in the URL.');
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="ml-4 text-gray-600">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!document || !document.cloudinaryUrl || !document._id) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
        <p>Document data is incomplete or missing. Cannot display PDF.</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        <p>Authentication token is missing. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* PDF Viewer Section */}
        <div className="flex-1 lg:w-2/3 p-4 relative">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center lg:text-left">
            {document.title}
          </h1>
          <div className="h-[calc(100vh-200px)] lg:h-[calc(100vh-120px)] w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <Viewer
                fileUrl={document.cloudinaryUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>

          {/* Floating Chat Button - Only visible on mobile/tablet */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
            aria-label="Toggle chat"
          >
            {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </button>
        </div>

        {/* Chat Section - Desktop: Always visible, Mobile: Overlay */}
        <div className={`w-full lg:w-1/3 p-4 transition-all duration-300 ${
          isChatOpen ? 'block' : 'hidden lg:block'
        }`}>
          <div className="h-[calc(100vh-200px)] lg:h-[calc(100vh-120px)]">
            <ChatWindow documentId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

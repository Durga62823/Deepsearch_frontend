// src/components/dashboard/PDFViewer.jsx

import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { Download, RotateCw, ZoomIn, ZoomOut, Maximize2, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PDFViewer({ documentId, accessToken, entities }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const defaultLayout = defaultLayoutPlugin();

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);
      setError('');

      try {
        // --- THIS IS THE CRITICAL CHANGE ---
        // The URL now points to the correct /download endpoint on your backend.
        const res = await fetch(`https://deepsearch-backend-n99w.onrender.com/api/documents/${documentId}/download`, {
          headers: {
            // Sends the token in the format your authMiddleware expects
            'x-auth-token': accessToken,
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ msg: `Request failed with status ${res.status}` }));
          throw new Error(errorData.msg || 'Failed to download PDF.');
        }

        const blob = await res.blob();

        if (blob.type !== 'application/pdf') {
          throw new Error(`Invalid file type received: ${blob.type}. Expected a PDF.`);
        }

        setFileUrl(URL.createObjectURL(blob));

      } catch (err) {
        console.error('Failed to fetch and load PDF:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (documentId && accessToken) {
      fetchPdf();
    } else {
      setLoading(false);
      setError("Document ID or access token is missing.");
    }
  }, [documentId, accessToken]);

  const handleZoom = (type) => {
    setScale((prev) => type === 'in' ? prev + 0.1 : Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `document-${documentId}.pdf`;
      link.click();
    }
  };

  const handleFullscreen = () => {
    const viewerElement = document.querySelector('.rpv-core__viewer');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (viewerElement) {
      viewerElement.requestFullscreen();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleZoom('in')} 
              disabled={!fileUrl}
              className="hover:bg-blue-100 hover:border-blue-300"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleZoom('out')} 
              disabled={!fileUrl}
              className="hover:bg-blue-100 hover:border-blue-300"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRotate} 
              disabled={!fileUrl}
              className="hover:bg-blue-100 hover:border-blue-300"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownload} 
            disabled={!fileUrl}
            className="hover:bg-green-100 hover:border-green-300 hover:text-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            disabled={!fileUrl} 
            onClick={handleFullscreen}
            className="hover:bg-purple-100 hover:border-purple-300 hover:text-purple-700"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto rpv-core__viewer bg-gray-50">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <FileText className="h-6 w-6 text-blue-300 absolute top-3 left-3" />
            </div>
            <p className="mt-4 text-lg font-medium">Loading PDF...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your document</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load PDF</h3>
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : fileUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayout]}
              defaultScale={scale}
              initialRotation={rotation}
            />
          </Worker>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg">No PDF to display</p>
          </div>
        )}
      </div>
    </div>
  );
}

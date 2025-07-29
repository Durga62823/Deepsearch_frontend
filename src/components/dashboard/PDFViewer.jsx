// src/components/dashboard/PDFViewer.jsx

import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { Download, RotateCw, ZoomIn, ZoomOut, Maximize2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";


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
        // This URL now points to the correct /download endpoint on your backend
        const res = await fetch(`https://deepsearch-backend-n99w.onrender.com/api/documents/${documentId}/download`, {
          headers: {
            // Sends the token in the format your middleware expects
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

  return (
    <div className="flex flex-col h-[75vh] border rounded-xl shadow-md bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleZoom('in')} disabled={!fileUrl}><ZoomIn className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => handleZoom('out')} disabled={!fileUrl}><ZoomOut className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={handleRotate} disabled={!fileUrl}><RotateCw className="w-4 h-4" /></Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => window.open(fileUrl, '_blank')} disabled={!fileUrl}><Download className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" disabled={!fileUrl} onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.querySelector('.rpv-core__viewer')?.requestFullscreen()}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto rpv-core__viewer">
        {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading PDF...
            </div>
        ) : error ? (
            <div className="p-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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
        ) : null}
      </div>
    </div>
  );
}

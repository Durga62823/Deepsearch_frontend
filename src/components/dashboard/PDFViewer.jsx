import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { Download, RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const highlightKeywords = (textLayer, entities) => {
  if (!textLayer || !entities) return;

  entities.forEach(({ value }) => {
    const spans = Array.from(textLayer.querySelectorAll('span')); 
    spans.forEach((span) => {
      if (span.textContent === value) {
        span.style.backgroundColor = '#facc15';
        span.style.borderRadius = '4px';
        span.style.padding = '0 2px';
      }
    });
  });
};

export default function PDFViewer({ documentId, accessToken, entities }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const defaultLayout = defaultLayoutPlugin();
  const highlight = highlightPlugin();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch(`https://deepsearch-backend.vercel.app/api/documents/${documentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const blob = await res.blob();
        setFileUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error('Failed to fetch PDF:', err);
      }
    };
    fetchPdf();
  }, [documentId, accessToken]);

  const handleZoom = (type) => {
    setScale((prev) => type === 'in' ? prev + 0.1 : Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => setRotation((prev) => prev + 90);

  return (
    <div className="flex flex-col h-full border rounded-xl shadow-md bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleZoom('in')}><ZoomIn className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => handleZoom('out')}><ZoomOut className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={handleRotate}><RotateCw className="w-4 h-4" /></Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => window.open(fileUrl, '_blank')}><Download className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {fileUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="px-4 py-2">
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayout, highlight]}
                renderPageLayer={({ canvasLayer, textLayer }) => {
                  highlightKeywords(textLayer, entities);
                  return (
                    <>
                      {canvasLayer}
                      {textLayer}
                    </>
                  );
                }}
                defaultScale={scale}
                rotation={rotation}
              />
            </div>
          </Worker>
        ) : (
          <div className="p-4 text-sm text-muted-foreground">Loading PDF...</div>
        )}
      </div>
    </div>
  );
}

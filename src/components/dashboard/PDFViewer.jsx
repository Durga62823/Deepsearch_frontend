import React, { useState, useEffect } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

const PDFViewer = ({ fileUrl, entities, onEntityClick, rawText, documentId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPDF = async () => {
      if (!documentId) {
        console.log('PDFViewer: No documentId provided, using direct fileUrl:', fileUrl);
        setPdfUrl(fileUrl);
        setLoading(false);
        return;
      }

      try {
        console.log('PDFViewer: Loading PDF for documentId:', documentId);
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const apiUrl = `${import.meta.env.VITE_API_URL}/documents/${documentId}/download`;
        console.log('PDFViewer: API URL:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/pdf',
          },
        });

        console.log('PDFViewer: Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error('PDFViewer: Failed to load PDF:', err);
        setError(`Failed to load PDF document: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [documentId, fileUrl]);

  const highlightPluginInstance = highlightPlugin({
    renderHighlights: (props) =>
      (props.highlights || []).map((highlight, index) => {
        const entity = entities?.find((e) => e.text === highlight.content.text);

        if (entity) {
          const getHighlightColor = (type) => {
            switch (type) {
              case 'PERSON':
                return 'var(--primary)';
              case 'ORG':
                return 'var(--secondary)';
              case 'LOCATION':
                return 'var(--accent)';
              default:
                return 'var(--muted)';
            }
          };

          return (
            <div
              key={`${highlight.id}-${index}`}
              className="absolute pointer-events-none"
              style={{
                left: `${highlight.left}%`,
                top: `${highlight.top}%`,
                height: `${highlight.height}%`,
                width: `${highlight.width}%`,
                backgroundColor: `color-mix(in srgb, ${getHighlightColor(entity.type)} 30%, transparent)`,
                border: `1px dashed ${getHighlightColor(entity.type)}`,
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
              onClick={() => onEntityClick(entity)}
              title={`Entity: ${entity.text} (${entity.type})`}
            />
          );
        }
        return null;
      }),
    highlights: entities
      ? entities.map((entity, index) => ({
          pages: [],
          content: {
            text: entity.text,
          },
          id: `${entity.type}-${entity.text}-${index}`,
          key: entity.text,
          type: entity.type,
        }))
      : [],
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading PDF...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative border rounded-md overflow-hidden h-[80vh] border-border bg-background">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[highlightPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
          onPageChange={(e) => setCurrentPage(e.currentPage)}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
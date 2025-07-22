// src/pages/DocumentViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { documentAPI } from '../services/api'; // Import document API service
import PDFViewer from '../components/dashboard/PDFViewer'; // Component for PDF display
import EntitySidebar from '../components/dashboard/EntitySidebar'; // Component for displaying entities
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DocumentViewPage = () => {
  const { id } = useParams(); // Get document ID from URL parameters
  const [document, setDocument] = useState(null); // State to store the fetched document
  const [loading, setLoading] = useState(true); // Loading state for fetching document
  const [error, setError] = useState(''); // Error state for fetch operations
  const [selectedEntity, setSelectedEntity] = useState(null); // State to track selected entity in sidebar

  // useEffect to fetch the specific document based on its ID
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true); // Start loading
      setError(''); // Clear previous errors
      try {
        const res = await documentAPI.getById(id); // Fetch document by ID
        setDocument(res.data); // Update document state
      } catch (err) {
        console.error('Failed to load document:', err);
        setError(err.response?.data?.message || 'Failed to load document.'); // Set error message
      } finally {
        setLoading(false); // End loading
      }
    };
    
    // Fetch only if an ID is provided
    if (id) {
      fetchDocument();
    } else {
      setLoading(false);
      setError('No document ID provided.'); // Set error if no ID is in URL
    }
  }, [id]); // Re-run when 'id' parameter changes

  // Handler for when an entity is clicked in the sidebar or PDF viewer
  const handleEntityClick = (entity) => {
    setSelectedEntity(entity); // Set the selected entity
  };

  // Conditional rendering based on loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading document...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-6 py-8 md:px-20">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-6 py-8 md:px-20">
        <Alert variant="default" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">Document not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render the document view with PDF viewer and entity sidebar
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 md:px-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel: PDF Viewer */}
          <Card className="flex-1">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {document.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PDFViewer 
                fileUrl={document.cloudinaryUrl} // URL of the PDF to display
                entities={document.entities} // Entities to highlight in the PDF
                onEntityClick={handleEntityClick} // Callback for entity clicks
                rawText={document.rawText} // Raw text for context (if needed by PDF viewer)
                documentId={document._id} // Pass document ID for proxy route
              />
            </CardContent>
          </Card>
          
          {/* Right panel: Entity Sidebar */}
          <Card className="w-full lg:w-96">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-bold">
                Entities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <EntitySidebar 
                  entities={document.entities} // Entities to display in the sidebar
                  selectedEntity={selectedEntity} // Currently selected entity
                  onSelect={setSelectedEntity} // Callback to update selected entity
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewPage;

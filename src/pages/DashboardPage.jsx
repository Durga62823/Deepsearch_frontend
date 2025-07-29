import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentAPI } from '../services/api';
import DocumentCard from '../components/dashboard/DocumentCard';
import UploadModal from '../components/dashboard/UploadModal';
import { AuthContext } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, LayoutGrid, LayoutList } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await documentAPI.getAll();  // No filter passed
        setDocuments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load documents.');
        toast.error('Failed to load documents.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDocuments();
    } else {
      setLoading(false);
      setDocuments([]);
    }
  }, [user]);

  const handleUploadSuccess = (newDocument) => {
    setDocuments(prev => [newDocument, ...prev]);
    setShowUploadModal(false);
    toast.success('Document uploaded successfully!');
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      setDeletingId(id);
      await documentAPI.delete(id);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      toast.success('Document deleted successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete document.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = async (id, newIsFavorite) => {
    try {
      await documentAPI.updateFavoriteStatus(id, newIsFavorite);
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc._id === id ? { ...doc, isFavorite: newIsFavorite } : doc
        )
      );
      const toastMessage = newIsFavorite ? "Added to favorites!" : "Removed from favorites.";
      toast.success(toastMessage);
    } catch (err) {
      toast.error("Failed to update favorite status.");
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by most recent uploaded document by default
  const sortedDocuments = filteredDocuments.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  return (
    <div className="min-h-screen bg-background font-inter">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="container mx-auto px-6 py-8 md:px-20 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Your PDF Documents</h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documents..."
                className="pl-9 pr-3 py-2 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Removed Filter Dropdown here */}
            <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              {sortedDocuments.length} total
            </Badge>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <FaSpinner className="animate-spin text-blue-500 text-3xl mr-3" />
            <div className="text-muted-foreground text-lg">Loading documents...</div>
          </div>
        ) : sortedDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
            <p className="text-xl text-muted-foreground">No documents found</p>
            <p className="text-muted-foreground">Upload your first PDF to get started</p>
            <Button variant="outline" size="lg" className="mt-2" onClick={() => setShowUploadModal(true)}>
              <Upload className="mr-2 h-5 w-5" />
              Upload your first document
            </Button>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {sortedDocuments.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDeleteDocument}
                isDeleting={deletingId === doc._id}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={handleUploadSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

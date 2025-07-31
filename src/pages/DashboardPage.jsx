import React, { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import DocumentCard from '../components/dashboard/DocumentCard';
import UploadModal from '../components/dashboard/UploadModal';
import { Plus, Search, List, Grid } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setIsUploadModalOpen(false);
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await documentAPI.getAll(filter);
      setDocuments(Array.isArray(response.data.documents) ? response.data.documents : []);
    } catch (err) {
      setError('Failed to load documents. Please try again.');
      setDocuments([]);
      toast.error('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  const handleDocumentUploaded = (newDocument) => {
    fetchDocuments();
    setIsUploadModalOpen(false);
    toast.success('Document uploaded successfully!');
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.delete(id);
        toast.success('Document deleted successfully!');
        fetchDocuments();
      } catch (err) {
        toast.error('Failed to delete document.');
      }
    }
  };

  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      await documentAPI.updateFavoriteStatus(id, !currentStatus);
      toast.success(`Document ${!currentStatus ? 'added to' : 'removed from'} favorites.`);
      fetchDocuments();
    } catch (err) {
      toast.error('Failed to update favorite status.');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-6">
          Your PDF Documents
        </h1>

        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Documents</option>
              <option value="favorites">Favorites</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={18} className="sm:w-5 sm:h-5" />
              </button>
              <button
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" /> 
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-sm sm:text-base">No documents found. Upload your first PDF!</p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
              : 'space-y-3 sm:space-y-4'
          }`}>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDeleteDocument}
                onToggleFavorite={handleToggleFavorite}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleDocumentUploaded}
      />
    </div>
  );
}

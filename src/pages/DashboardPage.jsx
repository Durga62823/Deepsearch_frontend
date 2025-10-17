import React, { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import DocumentCard from '../components/dashboard/DocumentCard';
import UploadModal from '../components/dashboard/UploadModal';
import { Plus, Search, List, Grid, FileText, Sparkles, Filter, SortAsc, TrendingUp, Clock, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Layout from '@/components/layout/Layout';

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

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

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt || b.uploadedAt) - new Date(a.createdAt || a.uploadedAt);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'favorites':
        return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      default:
        return 0;
    }
  });

  const getStats = () => {
    const total = documents.length;
    const favorites = documents.filter(doc => doc.isFavorite).length;
    const recent = documents.filter(doc => {
      const docDate = new Date(doc.createdAt || doc.uploadedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return docDate > weekAgo;
    }).length;
    
    return { total, favorites, recent };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full sm:p-2 ">
        {/* Header Section */}
            <Navbar/>

        {/* Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 cursor-pointer"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Documents</option>
                  <option value="favorites">Favorites Only</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Name A-Z</option>
                  <option value="favorites">Favorites First</option>
                </select>
                <SortAsc className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-red-200 to-red-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-red-500 to-red-200 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Upload Button */}
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-red-400 to-red-200 hover:from-red-400 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 shadow-lg">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Documents</h3>
              <p className="text-gray-600">Please wait while we fetch your documents...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-red-200 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Documents</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={fetchDocuments}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : sortedDocuments.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Upload your first PDF document to get started with AI-powered analysis'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Your First Document
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {sortedDocuments.length} Document{sortedDocuments.length !== 1 ? 's' : ''}
                </h2>
                {searchTerm && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    "{searchTerm}"
                  </Badge>
                )}
                {filter !== 'all' && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {filter === 'favorites' ? 'Favorites' : filter}
                  </Badge>
                )}
              </div>
            </div>

            {/* Documents Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}>
              {sortedDocuments.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  onDelete={handleDeleteDocument}
                  onToggleFavorite={handleToggleFavorite}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}
      </div>
 <Layout/>
    </div>
  );
}

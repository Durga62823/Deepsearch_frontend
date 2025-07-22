// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { documentAPI } from '../services/api';
import DocumentCard from '../components/dashboard/DocumentCard'; 
import UploadModal from '../components/dashboard/UploadModal';
import { AuthContext } from '../context/AuthContext'; // Use AuthContext
import { Button } from "@/components/ui/button"; // From shadcn/ui
import { Upload } from "lucide-react"; // From lucide-react for icons
import { FaTrash, FaSpinner, FaFilePdf } from 'react-icons/fa'; // Import trash icon, spinner, and PDF icon
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext); // Get user and logout from AuthContext
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // State for general errors on the page
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // State to track document being deleted

  useEffect(() => {
    const fetchDocuments = async () => {
      console.log('DashboardPage: fetchDocuments initiated.');
      setLoading(true);
      try {
        const res = await documentAPI.getAll();
        setDocuments(res.data);
        console.log('DashboardPage: Successfully fetched documents:', res.data);
        if (res.data.length > 0) {
          console.log("DashboardPage: First fetched document (ID):", res.data[0]._id);
        }
      } catch (err) {
        console.error('DashboardPage: Failed to fetch documents during getAll API call:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Failed to load documents. Please try again.');
        toast.error('Failed to load documents.'); // Display toast notification on error
      } finally {
        setLoading(false);
        console.log('DashboardPage: setLoading(false) completed.');
      }
    };
    
    if (user) {
      console.log('DashboardPage: User is authenticated, attempting to fetch documents.');
      fetchDocuments();
    } else {
      console.log('DashboardPage: User not authenticated, skipping document fetch.');
      setLoading(false);
      setDocuments([]); 
    }
  }, [user]);

  const handleUploadSuccess = (newDocument) => {
    console.log('DashboardPage: handleUploadSuccess called with new document:', newDocument);
    setDocuments((prevDocs) => [newDocument, ...prevDocs]); // Add new document to the top
    setShowUploadModal(false);
    console.log('DashboardPage: Documents state updated and modal closed.');
    toast.success('Document uploaded successfully!'); // Display toast notification on success
  };

  const handleDeleteDocument = async (documentId) => {
    // Confirmation dialog (can be replaced with a custom modal later)
    if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(documentId);
      await documentAPI.delete(documentId);
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== documentId));
    } catch (err) {
      console.error('Error deleting document:', err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || 'Failed to delete document. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeletingId(null); 
    }
  };

  const handleDocumentClick = (documentId) => {
    navigate(`/documents/${documentId}`); 
  };

  return (
    <div className="min-h-screen bg-background">
   
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="container mx-auto px-6 py-8 md:px-20 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Your Documents</h1>
            <p className="text-muted-foreground">
              Manage and analyze your uploaded documents
            </p>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto"
            variant="default"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload PDF
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <FaSpinner className="animate-spin text-blue-500 text-3xl mr-3" /> {/* Spinner icon */}
            <div className="text-muted-foreground text-lg">Loading documents...</div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
            <p className="text-xl text-muted-foreground">No documents found</p>
            <p className="text-muted-foreground">Upload your first PDF to get started</p>
            <Button
              onClick={() => setShowUploadModal(true)}
              variant="outline"
              size="lg"
              className="mt-2"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload your first document
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {documents.map(doc => (
              <div
                key={doc._id}
                className="bg-card text-card-foreground border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div 
                  className="flex-grow p-5 flex items-center cursor-pointer"
                  onClick={() => handleDocumentClick(doc._id)} // Navigate on card click
                >
                  <FaFilePdf className="text-red-500 text-4xl mr-4 flex-shrink-0" /> {/* PDF icon */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-800 truncate" title={doc.title}>
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    {doc.entities && doc.entities.length > 0 && ( // Check if entities array exists and has length
                      <p className="text-sm text-gray-600">Entities: {doc.entities.length}</p>
                    )}
                  </div>
                </div>
                {/* Delete Button Section */}
                <div className="px-5 py-3 border-t flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      handleDeleteDocument(doc._id); // Call delete function
                    }}
                    className={`p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition duration-150
                      ${deletingId === doc._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Delete Document"
                    disabled={deletingId === doc._id} // Disable button while deleting
                  >
                    {deletingId === doc._id ? (
                      <FaSpinner className="animate-spin text-lg" /> // Show spinner
                    ) : (
                      <FaTrash className="text-lg" /> // Show trash icon
                    )}
                  </button>
                </div>
              </div>
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

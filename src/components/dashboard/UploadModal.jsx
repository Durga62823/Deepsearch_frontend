// src/components/dashboard/UploadModal.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone'; // Hook for drag-and-drop file upload
import { documentAPI } from '../../services/api'; // API service for document uploads

// UploadModal component for handling PDF file uploads
const UploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null); // State to store the selected file
  const [uploading, setUploading] = useState(false); // State to indicate upload in progress
  const [error, setError] = useState(''); // State for displaying error messages
  const [message, setMessage] = useState(''); // State for displaying success messages

  // useDropzone hook for handling drag-and-drop functionality
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { // Specify accepted file types (only PDF)
      'application/pdf': ['.pdf']
    },
    maxFiles: 1, // Allow only one file to be dropped
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]); // Set the first accepted file
        setError(''); // Clear any errors
        setMessage(''); // Clear any messages
      } else {
        setFile(null); // Clear file if none accepted
        setError('Only PDF files are accepted.'); // Set error if wrong file type dropped
        setMessage('');
      }
    },
    noClick: true, // Prevent opening file dialog on container click
    noKeyboard: true // Prevent opening file dialog on keyboard interaction
  });

  // Handler for manual file selection via file input
  const handleManualFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        setFile(event.target.files[0]);
        setError('');
        setMessage('');
      } else {
        setFile(null);
        setError('Please select a valid PDF file.');
        setMessage('');
      }
    }
  };

  // Handler for submitting the file upload
  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload.'); // Prompt user if no file selected
      return;
    }
    
    setUploading(true); // Set uploading state to true
    setError(''); // Clear errors
    setMessage(''); // Clear messages

    // --- NEW DEBUG LOG HERE ---
    console.log('UploadModal: Preparing to send file.');
    console.log('UploadModal: File object details:', {
      name: file.name,
      size: file.size, // Crucial: Check if size is > 0
      type: file.type,
      lastModified: file.lastModified,
      instance: file instanceof File // Should be true
    });
    // --- END NEW DEBUG LOG ---

    try {
      const res = await documentAPI.upload(file); // Call the document upload API
      setMessage(res.data.message || 'Document uploaded successfully!'); // Set success message
      onSuccess(res.data.document); // Call onSuccess callback with the new document data
    } catch (err) {
      console.error('Upload failed:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to upload document. Please try again.'); // Set error message
      setMessage('');
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  return (
    // Modal background overlay
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      {/* Modal content container */}
      <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload PDF</h2>
        
        {/* Drag-and-drop area */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-200 cursor-pointer mb-4
            ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          `}
        >
          <input {...getInputProps()} /> {/* Hidden input for drag-and-drop */}
          
          {file ? (
            <p className="text-lg text-gray-800 font-medium">Selected: <span className="text-blue-700">{file.name}</span></p>
          ) : isDragActive ? (
            <p className="text-lg text-blue-600 font-semibold">Drop your PDF here!</p>
          ) : (
            <p className="text-lg text-gray-600">Drag & drop a PDF here, or <span className="text-blue-600 hover:underline cursor-pointer" onClick={open}>click to select</span></p>
          )}
           {/* Manual file input (hidden, triggered by click on 'click to select' span) */}
           <input
             type="file"
             accept="application/pdf"
             className="hidden"
             onChange={handleManualFileSelect}
             ref={ref => ref && (ref.value = null)} // Clear input value after selection
           />
        </div>
        
        {/* Error and Success message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={uploading} // Disable during upload
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${file && !uploading // Button active if file selected and not uploading
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
            disabled={!file || uploading} // Disable if no file or uploading
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

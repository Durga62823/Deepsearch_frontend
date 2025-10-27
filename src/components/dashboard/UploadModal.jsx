import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentAPI } from '../../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError('');
        setMessage('');
      } else {
        setFile(null);
        setError('Only PDF files are accepted.');
        setMessage('');
      }
    },
    noClick: true,
    noKeyboard: true
  });

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

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    console.log('🚀 Starting upload for file:', file.name, 'Size:', file.size);
    setUploading(true);
    setError('');
    setMessage('');
    try {
      console.log('📤 Calling documentAPI.upload...');
      const res = await documentAPI.upload(file);
      console.log('✅ Upload response:', res);
      console.log('✅ Upload response data:', res.data);
      
      // Handle both response formats for backward compatibility
      const responseMessage = res.data?.message || 'Document uploaded successfully!';
      const documentData = res.data?.document || res.data;
      
      console.log('📄 Document data:', documentData);
      
      setMessage(responseMessage);
      setFile(null); // Clear the file
      
      // Wait a moment to show success message, then close and trigger callback
      setTimeout(() => {
        if (documentData && (documentData._id || documentData.id)) {
          onSuccess(documentData);
          onClose();
        } else {
          console.error('⚠️ No valid document data in response');
          setError('Upload completed but document data is missing. Please refresh the page.');
        }
      }, 1500);
    } catch (err) {
      console.error('❌ Upload error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error response data:', err.response?.data);
      console.error('❌ Error message:', err.message);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          'Failed to upload document. Please try again.';
      setError(errorMessage);
      setMessage('');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r bg-red-600 rounded-full">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r bg-red-600  bg-clip-text text-transparent">
              Upload Document
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-base">
            Upload your PDF document to start analyzing and chatting with AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-red-400 bg-blue-50 scale-105' 
                : file 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-800 mb-1">File Selected</p>
                  <p className="text-sm text-green-700 font-medium break-all">{file.name}</p>
                  <p className="text-xs text-green-600 mt-1">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setError('');
                    setMessage('');
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Remove File
                </Button>
              </div>
            ) : isDragActive ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Upload className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 font-semibold text-lg">Drop your PDF here!</p>
                <p className="text-red-500 text-sm">Release to upload</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium text-lg mb-2">
                    Drag & drop your PDF here
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    or{' '}
                    <span 
                      className="text-red-600 underline cursor-pointer hover:text-red-700 font-medium" 
                      onClick={open}
                    >
                      click to browse
                    </span>
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• Maximum file size: 10MB</p>
                    <p>• Supported format: PDF only</p>
                  </div>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleManualFileSelect}
              ref={ref => ref && (ref.value = null)}
            />
          </div>

          {/* Status Messages */}


          {message && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={uploading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r bg-red-500  hover:bg-red-600  text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Uploading...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> 
                Upload & Analyze
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
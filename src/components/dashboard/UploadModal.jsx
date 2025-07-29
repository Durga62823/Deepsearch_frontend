// src/components/dashboard/UploadModal.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentAPI } from '../../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UploadModal = ({ onClose, onSuccess }) => {
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
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const res = await documentAPI.upload(file);
      setMessage(res.data.message || 'Document uploaded successfully!');
      onSuccess(res.data.document);
    } catch (err) {
      console.error('Upload failed:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to upload document. Please try again.');
      setMessage('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer mb-4
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted hover:bg-muted/80'}
          `}
        >
          <input {...getInputProps()} />
          {file ? (
            <p className="text-sm">Selected: <span className="font-medium text-primary">{file.name}</span></p>
          ) : isDragActive ? (
            <p className="text-primary font-medium">Drop your PDF here!</p>
          ) : (
            <p className="text-muted-foreground text-sm">Drag & drop a PDF here, or <span className="text-primary underline cursor-pointer" onClick={open}>click to select</span></p>
          )}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleManualFileSelect}
            ref={ref => ref && (ref.value = null)}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
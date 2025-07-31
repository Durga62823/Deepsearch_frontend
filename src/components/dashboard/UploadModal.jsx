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
import { Loader2, Upload } from 'lucide-react';

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
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const res = await documentAPI.upload(file);
      setMessage(res.data.message || 'Document uploaded successfully!');
      onSuccess(res.data.document);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document. Please try again.');
      setMessage('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Upload PDF</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Drag and drop your PDF file here, or click to select a file.
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-10 text-center transition-colors cursor-pointer mb-4
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted hover:bg-muted/80'}
          `}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="space-y-2">
              <p className="text-sm sm:text-base">Selected:</p>
              <p className="font-medium text-primary text-sm sm:text-base break-all">{file.name}</p>
            </div>
          ) : isDragActive ? (
            <p className="text-primary font-medium text-sm sm:text-base">Drop your PDF here!</p>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm sm:text-base">
                Drag & drop a PDF here, or{' '}
                <span className="text-primary underline cursor-pointer" onClick={open}>
                  click to select
                </span>
              </p>
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

        {error && (
          <Alert variant="destructive">
            <AlertTitle className="text-sm sm:text-base">Error</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
            <AlertTitle className="text-sm sm:text-base">Success</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">{message}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
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
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;

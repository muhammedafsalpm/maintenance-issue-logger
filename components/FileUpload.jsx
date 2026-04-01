'use client';

import { useState } from 'react';
import { Upload, X, FileImage, FileText, CheckCircle } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = 'image/*,.pdf', maxSize = 10 * 1024 * 1024 }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    if (!selectedFile) return;
    
    if (selectedFile.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    
    setUploading(true);
    setFile(selectedFile);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        onFileSelect({
          file: selectedFile,
          url: result.url
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setError(error.message);
      setFile(null);
      onFileSelect(null);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      {!file ? (
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            disabled={uploading}
            className="w-full px-5 py-3 border-2 border-dashed border-gray-300 rounded-xl 
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                       file:text-sm file:font-semibold file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="text-xs text-gray-500 mt-2">
            Supports images and PDFs (Max {maxSize / (1024 * 1024)}MB)
          </p>
          {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
        </div>
      ) : (
        <div className="border border-green-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {file.type.startsWith('image/') ? (
                <FileImage className="h-8 w-8 text-blue-500" />
              ) : (
                <FileText className="h-8 w-8 text-gray-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-red-500 transition"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-600">File uploaded successfully</p>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

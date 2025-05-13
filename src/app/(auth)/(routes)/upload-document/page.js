"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadDocumentPage() {
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
    setErrorMessage(''); // Clear error message when a new file is selected
  };

  const handleUpload = async () => {
    if (!document) {
      setErrorMessage('Please select a document to upload.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', document);

      // Make API call to upload the document (replace this with your actual API)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect to dashboard after successful upload
        router.push('/dashboard');
      } else {
        setErrorMessage('Error uploading the document. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setErrorMessage('An error occurred while uploading the document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Upload Your Document
        </h1>

        {/* File Input with Label */}
        <div className="mb-4">
          <label htmlFor="document" className="block text-lg text-gray-700">
            Select Document
          </label>
          <input
            id="document"
            type="file"
            onChange={handleDocumentChange}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
}

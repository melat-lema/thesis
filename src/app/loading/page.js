// app/loading/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Loading() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 1000;

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          cache: 'no-store',
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          if (data.ready) {
            router.push(data.role === 'TEACHER' 
              ? '/dashboard' 
              : '/students-dashboard');
          } else if (retryCount < MAX_RETRIES) {
            setTimeout(checkStatus, RETRY_DELAY);
            setRetryCount(c => c + 1);
          } else {
            setError('Account setup is taking longer than expected');
          }
        } else {
          setError(data.error || 'Authentication check failed');
        }
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(checkStatus, RETRY_DELAY);
          setRetryCount(c => c + 1);
        } else {
          setError('Cannot connect to server. Please refresh.');
        }
      }
    };

    checkStatus();
  }, [retryCount, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      
      {error ? (
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-2">
            Attempt {retryCount + 1} of 10
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      ) : (
        <>
          <p className="text-lg">Setting up your account...</p>
          <p className="text-sm text-gray-500">
            {retryCount > 0 && `Checking... (${retryCount})`}
          </p>
        </>
      )}
    </div>
  );
}
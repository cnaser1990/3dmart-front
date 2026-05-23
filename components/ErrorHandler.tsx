'use client';

import { useEffect } from 'react';

export default function ErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      // Suppress MetaMask and Web3 wallet connection errors
      if (
        (error instanceof Error && 
          (error.message.includes('MetaMask') || 
           error.message.includes('Failed to connect') ||
           error.message.includes('window.ethereum') ||
           error.message.includes('Web3'))) ||
        (typeof error === 'string' && 
          (error.includes('MetaMask') || 
           error.includes('Failed to connect') ||
           error.includes('window.ethereum') ||
           error.includes('Web3')))
      ) {
        // Prevent the error from being logged
        event.preventDefault();
        return;
      }
      
      // Let other errors propagate normally
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}

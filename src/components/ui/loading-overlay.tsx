import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Processing...' 
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
      <p className="text-white text-sm">{message}</p>
    </div>
  );
}; 
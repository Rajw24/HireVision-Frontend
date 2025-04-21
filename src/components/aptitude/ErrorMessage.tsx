import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
      <span className="block sm:inline">{message}</span>
    </div>
  </div>
);

export default ErrorMessage;
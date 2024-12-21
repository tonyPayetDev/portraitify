import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
}

export function StatusMessage({ type, message }: StatusMessageProps) {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-green-50/80',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: 'bg-red-50/80',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} ${style.text} backdrop-blur-sm border ${style.border} rounded-lg p-4 flex items-center gap-3`}>
      {style.icon}
      <p>{message}</p>
    </div>
  );
}
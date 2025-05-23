
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. border-blue-500
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'border-brand-light-blue', text }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${color}`}
      ></div>
      {text && <p className="mt-3 text-sm text-brand-slate-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

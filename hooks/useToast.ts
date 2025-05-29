import { useContext, createContext } from 'react';
import { ToastType } from '../types';

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

// Create the context for toast functionality
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook for components to access the toast functionality
export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

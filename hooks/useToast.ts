
// Fix: Import React and useContext
import React, { useState, useCallback, useContext, createContext } from 'react';
import { ToastMessage, ToastType } from '../types';

const TOAST_TIMEOUT = 5000; // 5 seconds

interface UseToastReturnType {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

let toastIdCounter = 0;

export const useToast = (): UseToastReturnType => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = ToastType.Info) => {
    const id = `toast-${toastIdCounter++}`;
    const newToast: ToastMessage = { id, message, type };
    setToasts(prevToasts => [...prevToasts, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, TOAST_TIMEOUT);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

// Use the named import 'createContext' directly.
// This was previously React.createContext, but since 'createContext' is also a named import,
// using it directly might be more robust if the default 'React' object has issues resolving.
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export default useToast;

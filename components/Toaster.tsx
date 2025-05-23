import React, { useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType } from '../types';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastContext } from '../hooks/useToast';

const TOAST_TIMEOUT = 5000;
let toastIdCounter = 0;

// The Toaster component now acts as a Provider for its children,
// and also handles the rendering of the toast notifications.
export const Toaster: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = ToastType.Info) => {
    const id = `toast-${toastIdCounter++}`;
    const newToast: ToastMessage = { id, message, type };
    setToasts(prevToasts => [newToast, ...prevToasts].slice(0, 5)); // Keep max 5 toasts, new ones on top

    setTimeout(() => {
      removeToast(id);
    }, TOAST_TIMEOUT);
  }, [removeToast]);


  const getIcon = (type: ToastType) => {
    switch (type) {
      case ToastType.Success:
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case ToastType.Error:
        return <XCircle className="w-6 h-6 text-red-500" />;
      case ToastType.Info:
        return <Info className="w-6 h-6 text-blue-500" />;
      case ToastType.Warning:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case ToastType.Success: return 'bg-green-50 border-green-300 text-green-700';
      case ToastType.Error: return 'bg-red-50 border-red-300 text-red-700';
      case ToastType.Info: return 'bg-blue-50 border-blue-300 text-blue-700';
      case ToastType.Warning: return 'bg-yellow-50 border-yellow-300 text-yellow-700';
      default: return 'bg-blue-50 border-blue-300 text-blue-700';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children} {/* Render the application content that needs the context */}
      
      {/* This part is for displaying toasts visually */}
      <div className="fixed bottom-5 right-5 z-[100] space-y-3 w-full max-w-xs sm:max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg flex items-start space-x-3 border ${getBgColor(toast.type)} animate-fadeInRight`}
          >
            <div className="flex-shrink-0">{getIcon(toast.type)}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 ${
                toast.type === ToastType.Success ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                toast.type === ToastType.Error ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' :
                toast.type === ToastType.Warning ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                'text-blue-500 hover:bg-blue-100 focus:ring-blue-600' // Info or default
              }`}
            >
              <span className="sr-only">Close</span>
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      {/* Keyframes for animation */}
      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInRight { animation: fadeInRight 0.3s ease-out forwards; }
      `}</style>
    </ToastContext.Provider>
  );
};

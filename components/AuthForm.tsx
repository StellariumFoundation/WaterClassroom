
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { useToastContext } from '../hooks/useToast';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';
// Fix: Import ToastType
import { ToastType } from '../types';

interface AuthFormProps {
  isLoginMode?: boolean;
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLoginMode: initialLoginMode = true, onSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialLoginMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth(); // Assuming login handles both login/signup for mock
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isLoginMode && !name) {
      setError('Name is required for signup.');
      setIsLoading(false);
      return;
    }
    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, login and signup would be different API calls
      // For this mock, login also creates a user if they don't exist (simplified)
      await login(email, isLoginMode ? 'Logged In User' : name); // Pass name for signup
      // Fix: Use ToastType.Success instead of "success"
      addToast(`Successfully ${isLoginMode ? 'logged in' : 'signed up'}!`, ToastType.Success);
      if (onSuccess) {
        onSuccess();
      } else {
        // If no curriculum selected, go to selection, else dashboard
        // This logic should be in AuthContext or App.tsx based on user.selectedCurriculumId
        navigate(APP_ROUTES.CURRICULUM_SELECT); 
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      // Fix: Use ToastType.Error instead of "error"
      addToast(`Authentication failed: ${errorMessage}`, ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-brand-slate-dark rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-brand-slate-light">
        {isLoginMode ? 'Welcome Back!' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLoginMode && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-slate-medium">
              Full Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required={!isLoginMode}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 pl-10 border border-brand-slate-medium bg-brand-navy rounded-md placeholder-gray-500 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm text-white"
                placeholder="Your Name"
              />
            </div>
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-slate-medium">
            Email address
          </label>
           <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 pl-10 border border-brand-slate-medium bg-brand-navy rounded-md placeholder-gray-500 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm text-white"
                placeholder="you@example.com"
              />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brand-slate-medium">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 pl-10 border border-brand-slate-medium bg-brand-navy rounded-md placeholder-gray-500 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm text-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-light-blue hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-navy focus:ring-brand-light-blue disabled:opacity-50 transition-opacity"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (isLoginMode ? <LogIn className="mr-2 h-5 w-5"/> : <UserPlus className="mr-2 h-5 w-5"/>)}
            {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-brand-slate-medium">
        {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
        <button
          onClick={() => {setIsLoginMode(!isLoginMode); setError('');}}
          className="ml-1 font-medium text-brand-light-blue hover:text-opacity-80"
        >
          {isLoginMode ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
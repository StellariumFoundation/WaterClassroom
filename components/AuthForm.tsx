
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
  // const [error, setError] = useState(''); // Replaced by context error

  const { login, signup, error: authError, clearError, user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  // Effect to display auth errors from context via toast
  useEffect(() => {
    if (authError) {
      addToast(authError, ToastType.Error);
      // clearError(); // Clear error after showing, or let user dismiss
    }
  }, [authError, addToast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // setError(''); // Local error state removed
    if(authError) clearError(); // Clear previous auth errors before new attempt


    if (!isLoginMode && !name.trim()) {
      addToast('Name is required for signup.', ToastType.Warning);
      setIsLoading(false);
      return;
    }
    if (!email.trim() || !password.trim()) {
      addToast('Email and password are required.', ToastType.Warning);
      setIsLoading(false);
      return;
    }

    let success = false;
    if (isLoginMode) {
      success = await login(email, password);
    } else {
      success = await signup(name, email, password);
    }

    if (success) {
      addToast(`Successfully ${isLoginMode ? 'logged in' : 'signed up'}!`, ToastType.Success);
      if (onSuccess) {
        onSuccess();
      } else {
        // Check user from context for selectedCurriculumId after successful login/signup
        // This navigation logic might be better placed in a wrapper component or useEffect watching `user`
        navigate(APP_ROUTES.CURRICULUM_SELECT); // Default to curriculum select, actual user object will be available in next render.
      }
    } else {
      // Error toast is handled by the useEffect watching authError
      // If authError is not set (e.g. network error before context update), show a generic one.
      // However, the context should set an error for API failures.
      if (!authError) { // This check might be redundant if context always sets error
         addToast(`Authentication failed. Please try again.`, ToastType.Error);
      }
    }

    setIsLoading(false);
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

        {/* Removed local error display, relying on toast for authError from context */}
        {/* {error && <p className="text-sm text-red-400">{error}</p>} */}

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
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              // setError(''); // Local error removed
              if(authError) clearError(); // Clear context error on mode switch
            }}
          className="ml-1 font-medium text-brand-light-blue hover:text-opacity-80"
        >
          {isLoginMode ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
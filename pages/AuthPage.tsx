
import React from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';

const AuthPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-brand-navy"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-light-blue"></div></div>;
  }

  if (user) {
    return <Navigate to={APP_ROUTES.DASHBOARD} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-deep-blue to-brand-indigo py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
         <img src="https://picsum.photos/seed/logo-edu/150/50" alt="Water Classroom Logo" className="mx-auto h-12 w-auto mb-8" />
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;


import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CurriculumPage from './pages/CurriculumPage';
import LecturePage from './pages/LecturePage';
import TutorPage from './pages/TutorPage';
import AssessmentPage from './pages/AssessmentPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from './components/Toaster'; // Toaster now acts as the provider
import { APP_ROUTES } from './constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-light-blue"></div></div>;
  }
  return user ? <>{children}</> : <Navigate to={APP_ROUTES.LOGIN} />;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-brand-navy"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-light-blue"></div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-navy">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<LandingPage />} />
          <Route path={APP_ROUTES.AUTH} element={<AuthPage />} />
          <Route 
            path={APP_ROUTES.DASHBOARD} 
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
          />
          <Route 
            path={APP_ROUTES.CURRICULUM_SELECT} 
            element={<ProtectedRoute><CurriculumPage /></ProtectedRoute>} 
          />
          <Route 
            path={`${APP_ROUTES.LECTURE}/:lectureId`}
            element={<ProtectedRoute><LecturePage /></ProtectedRoute>} 
          />
          <Route 
            path={APP_ROUTES.TUTOR}
            element={<ProtectedRoute><TutorPage /></ProtectedRoute>} 
          />
          <Route 
            path={APP_ROUTES.ASSESSMENT}
            element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} 
          />
           <Route 
            path={`${APP_ROUTES.ASSESSMENT}/:assessmentId`}
            element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} 
          />
          <Route 
            path={APP_ROUTES.PROFILE}
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
          />
          <Route path="*" element={<Navigate to={user ? APP_ROUTES.DASHBOARD : APP_ROUTES.HOME} />} />
        </Routes>
      </main>
      <Footer />
      {/* Toaster visual elements are rendered by the Toaster provider wrapper now, so it's removed from here */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Toaster> {/* Toaster now wraps AppContent to provide context */}
          <AppContent />
        </Toaster>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
import React, { useEffect } from 'react'; // Added useEffect
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'; // Added useLocation, useNavigate
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CurriculumPage from './pages/CurriculumPage';
import LecturePage from './pages/LecturePage';
import TutorPage from './pages/TutorPage';
import AssessmentPage from './pages/AssessmentPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import OnboardingPage from './pages/OnboardingPage'; // Import the new OnboardingPage
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Ensure APP_ROUTES.ONBOARDING and APP_ROUTES.OAUTH_CALLBACK are defined
      const onboardingRoute = APP_ROUTES.ONBOARDING || '/onboarding';
      const oauthCallbackRoute = APP_ROUTES.OAUTH_CALLBACK || '/auth/oauth-callback';

      if (!user.onboarding_complete &&
          location.pathname !== onboardingRoute &&
          location.pathname !== oauthCallbackRoute &&
          !location.pathname.startsWith(APP_ROUTES.AUTH) // Also don't redirect if on login/signup page itself
          ) {
        navigate(onboardingRoute, { replace: true });
      } else if (user.onboarding_complete && location.pathname === onboardingRoute) {
        navigate(APP_ROUTES.DASHBOARD, { replace: true }); // Or CURRICULUM_SELECT
      }
    }
  }, [user, loading, navigate, location.pathname]);
  
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
          <Route path={APP_ROUTES.OAUTH_CALLBACK} element={<OAuthCallbackPage />} />
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
          <Route
            path={APP_ROUTES.ONBOARDING} // Define APP_ROUTES.ONBOARDING in constants.ts
            element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>}
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
      <I18nProvider initialLanguage="en">
        <AuthProvider> {/* AuthProvider should be inside HashRouter but outside Toaster if Toaster uses useAuth or similar */}
          <Toaster> {/* Toaster now wraps AppContent to provide context */}
            <AppContent />
          </Toaster>
        </AuthProvider>
      </I18nProvider>
    </HashRouter>
  );
};

export default App;

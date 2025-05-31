import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { TutorWidgetProvider, useTutorWidget } from './contexts/TutorWidgetContext'; // Import useTutorWidget
import LandingPage from './pages/LandingPage';
import TutorOverlayButton from './components/TutorOverlayButton'; // Import TutorOverlayButton
import TutorWidget from './components/TutorWidget'; // Import TutorWidget
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
  const { user, loading: authLoading } = useAuth(); // Renamed loading to authLoading for clarity
  const { isTutorWidgetOpen, toggleTutorWidget, closeTutorWidget } = useTutorWidget();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && user) {
      const onboardingRoute = APP_ROUTES.ONBOARDING || '/onboarding';
      const oauthCallbackRoute = APP_ROUTES.OAUTH_CALLBACK || '/auth/oauth-callback';

      if (!user.onboarding_complete &&
          location.pathname !== onboardingRoute &&
          location.pathname !== oauthCallbackRoute &&
          !location.pathname.startsWith(APP_ROUTES.AUTH)
          ) {
        navigate(onboardingRoute, { replace: true });
      } else if (user.onboarding_complete && location.pathname === onboardingRoute) {
        navigate(APP_ROUTES.DASHBOARD, { replace: true });
      }
    }
  }, [user, authLoading, navigate, location.pathname]);

  if (authLoading) { // Use authLoading here
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
            path={APP_ROUTES.ONBOARDING}
            element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>}
          />
          {/* TODO: Add route for PricingPage: <Route path="/pricing" element={<PricingPage />} /> */}
          {/* Example: <Route path={APP_ROUTES.PRICING} element={<ProtectedRoute><PricingPage /></ProtectedRoute>} /> */}
          <Route path="*" element={<Navigate to={user ? APP_ROUTES.DASHBOARD : APP_ROUTES.HOME} />} />
        </Routes>
      </main>
      <Footer />
      {/* TODO: Add link to Navbar for PricingPage: <Link to="/pricing">Pricing</Link> (in Navbar.tsx) */}

      {/* Render TutorButton only if user is logged in and onboarding is complete, or on specific non-auth pages */}
      {user && user.onboarding_complete && (
         <>
            <TutorOverlayButton onClick={toggleTutorWidget} />
            <TutorWidget isOpen={isTutorWidgetOpen} onClose={closeTutorWidget} />
         </>
      )}
      {/* Or, if you want it available more broadly but not on auth/onboarding:
      {!authLoading && user && !location.pathname.startsWith(APP_ROUTES.AUTH) && location.pathname !== APP_ROUTES.ONBOARDING && (
        <>
          <TutorOverlayButton onClick={toggleTutorWidget} />
          <TutorWidget isOpen={isTutorWidgetOpen} onClose={closeTutorWidget} />
        </>
      )}
      */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <I18nProvider initialLanguage="en">
        <AuthProvider>
          <TutorWidgetProvider> {/* Wrap with TutorWidgetProvider */}
            <Toaster>
              <AppContent />
            </Toaster>
          </TutorWidgetProvider>
        </AuthProvider>
      </I18nProvider>
    </HashRouter>
  );
};

export default App;

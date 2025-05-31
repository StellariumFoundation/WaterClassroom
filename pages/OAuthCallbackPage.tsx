import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../constants';
import { useToastContext } from '../hooks/useToast';
import { ToastType } from '../types';
import Spinner from '../components/Spinner'; // Assuming a Spinner component exists

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { processOAuthTokens, error: authError, clearError } = useAuth(); // Assuming processOAuthTokens will be added
  const { addToast } = useToastContext();
  const [isLoading, setIsLoading] = useState(true);
  const [processingError, setProcessingError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const errorParam = searchParams.get('error'); // Backend might redirect with an error

    if (authError) clearError(); // Clear any previous context errors

    if (errorParam) {
      addToast(`OAuth failed: ${errorParam}`, ToastType.Error);
      setProcessingError(`OAuth failed: ${errorParam}`);
      navigate(APP_ROUTES.LOGIN, { replace: true });
      setIsLoading(false);
      return;
    }

    if (accessToken && refreshToken) {
      const handleTokenProcessing = async () => {
        setIsLoading(true);
        const success = await processOAuthTokens(accessToken, refreshToken);
        if (success) {
          addToast('Successfully logged in with Google!', ToastType.Success);
          navigate(APP_ROUTES.DASHBOARD, { replace: true }); // Or CURRICULUM_SELECT if that's the flow
        } else {
          addToast(authError || 'Failed to process OAuth tokens. Please try logging in manually.', ToastType.Error);
          setProcessingError(authError || 'Failed to process OAuth tokens.');
          navigate(APP_ROUTES.LOGIN, { replace: true });
        }
        setIsLoading(false);
      };
      handleTokenProcessing();
    } else {
      addToast('OAuth callback is missing tokens.', ToastType.Error);
      setProcessingError('OAuth callback is missing tokens.');
      navigate(APP_ROUTES.LOGIN, { replace: true });
      setIsLoading(false);
    }
  }, [searchParams, processOAuthTokens, navigate, addToast, authError, clearError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-deep-blue text-white">
        <Spinner size="large" />
        <p className="mt-4 text-xl">Processing your login...</p>
      </div>
    );
  }

  if (processingError) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-deep-blue text-white">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Authentication Error</h2>
        <p className="mb-4">{processingError}</p>
        <button
          onClick={() => navigate(APP_ROUTES.LOGIN)}
          className="px-6 py-2 bg-brand-light-blue text-white rounded hover:bg-opacity-80 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Should not be reached if logic is correct, but as a fallback:
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-deep-blue text-white">
      <p>Redirecting...</p>
    </div>
  );
};

export default OAuthCallbackPage;

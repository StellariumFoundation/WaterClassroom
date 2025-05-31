import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToastContext } from '../../hooks/useToast';
import { APP_ROUTES } from '../../constants';
import { ToastType, User } from '../../types'; // Assuming User type might be needed for user.onboarding_complete
import Spinner from '../../components/Spinner'; // Assuming a Spinner component exists

// Placeholder for AuthContext function - will be implemented later
interface AuthContextTypeExtended extends ReturnType<typeof useAuth> {
  updateUserOnboardingDetails?: (userType: string, classroomCode?: string) => Promise<boolean>;
  // Add user type definition if not already in useAuth's return
  user: User | null;
}


const OnboardingPage: React.FC = () => {
  const [userType, setUserType] = useState<string>('');
  const [classroomCode, setClassroomCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    user,
    loading: authLoading,
    updateUserOnboardingDetails, // Assume this will be added to AuthContext
    error: authError,
    clearError: clearAuthError
  } = useAuth() as AuthContextTypeExtended; // Cast for now

  const { addToast } = useToastContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate(APP_ROUTES.LOGIN, { replace: true });
      } else if (user.onboarding_complete) {
        // If user type exists, it means onboarding was done.
        // The field name `onboarding_complete` is from the backend migration.
        addToast('Onboarding already completed!', ToastType.Info);
        navigate(APP_ROUTES.CURRICULUM_SELECT, { replace: true });
      }
    }
  }, [user, authLoading, navigate, addToast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);
    if (authError) clearAuthError?.();


    if (!userType) {
      setLocalError('Please select your role.');
      addToast('Please select your role.', ToastType.Warning);
      setIsLoading(false);
      return;
    }

    if (userType === 'school_student' && !classroomCode.trim()) {
      setLocalError('Please enter your classroom code.');
      addToast('Please enter your classroom code if you are a student at a school.', ToastType.Warning);
      setIsLoading(false);
      return;
    }

    if (!updateUserOnboardingDetails) {
        setLocalError('Onboarding feature is not available at the moment. Please try again later.');
        addToast('Onboarding feature is not available. Please contact support.', ToastType.Error);
        setIsLoading(false);
        return;
    }

    try {
      const success = await updateUserOnboardingDetails(userType, userType === 'school_student' ? classroomCode : undefined);
      if (success) {
        addToast('Onboarding complete! Welcome!', ToastType.Success);
        navigate(APP_ROUTES.CURRICULUM_SELECT, { replace: true }); // Or DASHBOARD
      } else {
        // Error should be set by AuthContext, or use a generic one
        const message = authError || 'Failed to update onboarding details. Please try again.';
        setLocalError(message);
        addToast(message, ToastType.Error);
      }
    } catch (err) {
      console.error("Onboarding submission error:", err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setLocalError(message);
      addToast(message, ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (!user && !authLoading)) { // Show spinner while auth is loading or redirecting
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-deep-blue text-white">
        <Spinner size="large" />
        <p className="mt-4 text-xl">Loading user data...</p>
      </div>
    );
  }

  if (user && user.onboarding_complete) { // Should be caught by useEffect, but as a safeguard
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-deep-blue text-white">
        <p className="mt-4 text-xl">Onboarding already completed. Redirecting...</p>
         <Spinner size="large" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-brand-deep-blue flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-brand-slate-dark shadow-xl rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-slate-light">
            Tell us a bit about yourself
          </h2>
          <p className="mt-2 text-center text-sm text-brand-slate-medium">
            This will help us tailor your learning experience.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-brand-slate-light mb-1">
              I am a...
            </label>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-brand-slate-medium bg-brand-navy rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm text-white"
            >
              <option value="" disabled>Select your role</option>
              <option value="individual">Individual Learner</option>
              <option value="homeschool">Homeschool Student</option>
              <option value="school_student">Student at a School</option>
            </select>
          </div>

          {userType === 'school_student' && (
            <div>
              <label htmlFor="classroomCode" className="block text-sm font-medium text-brand-slate-light mb-1">
                Classroom Code (Optional)
              </label>
              <input
                id="classroomCode"
                name="classroomCode"
                type="text"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-brand-slate-medium bg-brand-navy rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm text-white"
                placeholder="Enter code if you have one"
              />
            </div>
          )}

          {localError && (
            <p className="text-sm text-red-400 text-center">{localError}</p>
          )}
           {authError && !localError && ( // Show auth error if no local error is more specific
            <p className="text-sm text-red-400 text-center">{authError}</p>
          )}


          <div>
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-light-blue hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-navy focus:ring-brand-light-blue disabled:opacity-50 transition-opacity"
            >
              {isLoading ? (
                <Spinner size="small" />
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;

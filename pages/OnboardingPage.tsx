import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToastContext } from '../../hooks/useToast';
import { APP_ROUTES } from '../../constants';
import { ToastType, User } from '../../types'; // Assuming User type might be needed for user.onboarding_complete
import Spinner from '../../components/Spinner';
import { AuthContextType } from '../../contexts/AuthContext'; // Import full type if needed for explicit casting, or rely on useAuth return type

const OnboardingPage: React.FC = () => {
  const [userType, setUserType] = useState<string>('');
  const [classroomCode, setClassroomCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // updateUserOnboardingDetails is now part of AuthContextType from previous step
  const {
    user,
    loading: authLoading,
    updateUserOnboardingDetails,
    error: authError,
    clearError: clearAuthError
  } = useAuth();

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

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700">
        <Spinner size="large" />
        <p className="mt-4 text-xl">Loading user data...</p>
      </div>
    );
  }

  if (user && user.onboarding_complete) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700">
        <p className="mt-4 text-xl">Onboarding already completed. Redirecting...</p>
         <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800">
            Tell us a bit about yourself
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            This will help us tailor your learning experience.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-slate-700 mb-1">
              I am a...
            </label>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900"
            >
              <option value="" disabled>Select your role</option>
              <option value="individual">Individual Learner</option>
              <option value="homeschool">Homeschool Student</option>
              <option value="school_student">Student at a School</option>
            </select>
          </div>

          {userType === 'school_student' && (
            <div>
              <label htmlFor="classroomCode" className="block text-sm font-medium text-slate-700 mb-1">
                Classroom Code (Optional)
              </label>
              <input
                id="classroomCode"
                name="classroomCode"
                type="text"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900"
                placeholder="Enter code if you have one"
              />
            </div>
          )}

          {localError && (
            <p className="text-sm text-red-400 text-center">{localError}</p>
          )}
           {authError && !localError && (
            <p className="text-sm text-red-400 text-center">{authError}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-600 hover:via-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-150 ease-in-out relative overflow-hidden button-shimmer"
            >
              {isLoading ? (
                <Spinner size="small" color="text-white" />
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


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Curriculum, ToastType } from '../types'; // Added ToastType
import { MOCK_CURRICULA_DATA } from '../constants';
// import { useToastContext } from '../hooks/useToast'; // Not available here directly, handle errors via state/return

const API_BASE_URL = 'http://localhost:8080'; // As per subtask instructions

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null; // Added error state
  login: (email: string, password: string) => Promise<boolean>; // Returns true on success
  signup: (name: string, email: string, password: string) => Promise<boolean>; // Returns true on success
  logout: () => void;
  updateUserCurriculum: (curriculumId: string) => void;
  selectedCurriculumDetails: Curriculum | null;
  clearError: () => void; // Utility to clear error
  processOAuthTokens: (accessToken: string, refreshToken: string) => Promise<boolean>; // For OAuth callback
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurriculumDetails, setSelectedCurriculumDetails] = useState<Curriculum | null>(null);
  // const { addToast } = useToastContext(); // Not available, components will use their own toast instance

  const clearError = () => setError(null);

  const fetchUserDetails = async (accessToken: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.error('User details fetch unauthorized (token might be expired)');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user details' }));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }

      // Assuming backend returns { id, name, email, ...other_fields }
      // And User type is { id, name, email, selectedCurriculumId?, ... }
      const backendUser = await response.json();

      // Try to preserve app-specific fields from localStorage if any, or initialize them
      const storedUserStr = localStorage.getItem('waterClassroomUser');
      let appSpecificFields: Partial<User> = {
        progress: { completedLectures: [], assessmentScores: {} },
        subscription: { planName: 'Free Trial', isActive: true },
        badges: [],
        streak: 0,
        points: 0,
      };
      if (storedUserStr) {
        const localUser = JSON.parse(storedUserStr) as User;
        appSpecificFields = {
            selectedCurriculumId: localUser.selectedCurriculumId,
            progress: localUser.progress || appSpecificFields.progress,
            subscription: localUser.subscription || appSpecificFields.subscription,
            badges: localUser.badges || appSpecificFields.badges,
            streak: localUser.streak || 0,
            points: localUser.points || 0,
        }
      }

      const fullUser: User = {
        id: backendUser.id,
        name: backendUser.name || backendUser.display_name, // Adapt to backend field
        email: backendUser.email,
        avatarUrl: backendUser.avatar_url || `https://i.pravatar.cc/150?u=${backendUser.email}`, // Use backend avatar or fallback
        ...appSpecificFields,
      };

      localStorage.setItem('waterClassroomUser', JSON.stringify(fullUser)); // Store combined user
      return fullUser;

    } catch (err) {
      console.error('Fetch user details error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const fetchedUser = await fetchUserDetails(accessToken);
        if (fetchedUser) {
          setUser(fetchedUser);
          if (fetchedUser.selectedCurriculumId) {
            const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === fetchedUser.selectedCurriculumId) || null;
            setSelectedCurriculumDetails(curriculum as Curriculum | null);
          }
        } else {
          setUser(null);
          setSelectedCurriculumDetails(null);
          localStorage.removeItem('waterClassroomUser'); // Clear user profile if token invalid
        }
      } else {
        setUser(null);
        setSelectedCurriculumDetails(null);
        localStorage.removeItem('waterClassroomUser');
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Login failed with status: ${response.status}`);
      }

      const { access_token, refresh_token } = data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      const fetchedUser = await fetchUserDetails(access_token);
      if (fetchedUser) {
        setUser(fetchedUser);
         if (fetchedUser.selectedCurriculumId) {
            const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === fetchedUser.selectedCurriculumId) || null;
            setSelectedCurriculumDetails(curriculum as Curriculum | null);
          } else {
            setSelectedCurriculumDetails(null); // Reset curriculum on new login if not set
          }
        setLoading(false);
        return true;
      } else {
        // This case implies fetchUserDetails failed even with a new token, which is unlikely but possible
        setError('Login successful, but failed to retrieve user details.');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An unknown login error occurred.');
      setLoading(false);
      return false;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) { // Status 201 is also OK for registration
        throw new Error(data.error || `Signup failed with status: ${response.status}`);
      }

      // Registration successful (e.g. 201 Created), proceed to login
      // addToast('Signup successful! Logging you in...', ToastType.Success); // Component will show this
      return await login(email, password); // Automatically log in the user

    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An unknown signup error occurred.');
      setLoading(false);
      return false;
    }
  }, [login]); // Added login as dependency


  const processOAuthTokens = useCallback(async (accessToken: string, refreshToken: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const fetchedUser = await fetchUserDetails(accessToken);
      if (fetchedUser) {
        setUser(fetchedUser);
        if (fetchedUser.selectedCurriculumId) {
          const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === fetchedUser.selectedCurriculumId) || null;
          setSelectedCurriculumDetails(curriculum as Curriculum | null);
        } else {
          setSelectedCurriculumDetails(null);
        }
        setLoading(false);
        return true;
      } else {
        setError('OAuth login successful, but failed to retrieve user details.');
        // Tokens are stored, but user details fetch failed. Consider clearing tokens if this is critical.
        // For now, let's keep tokens and let initAuth or next action try again.
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Process OAuth tokens error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during OAuth processing.');
      // Clear potentially bad tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setLoading(false);
      return false;
    }
  }, [fetchUserDetails]); // Added fetchUserDetails

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('waterClassroomUser'); // Clear the user profile
    setUser(null);
    setSelectedCurriculumDetails(null);
    // No backend call for logout as per requirements
    // addToast('Logged out successfully.', ToastType.Info); // Component can show this
  }, []);

  const updateUserCurriculum = useCallback((curriculumId: string) => {
    if (user) {
      const updatedUser = { ...user, selectedCurriculumId: curriculumId };
      localStorage.setItem('waterClassroomUser', JSON.stringify(updatedUser)); // Persist this app-specific change
      setUser(updatedUser);
      const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === curriculumId) || null;
      setSelectedCurriculumDetails(curriculum as Curriculum | null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateUserCurriculum, selectedCurriculumDetails, clearError, processOAuthTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

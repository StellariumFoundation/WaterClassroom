
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Curriculum, LoginResponse, RegisterResponse } from '../types'; // Added LoginResponse, RegisterResponse
import { MOCK_CURRICULA_DATA, API_BASE_URL } from '../constants'; // Assuming API_BASE_URL is defined

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // login: (email: string, name: string) => Promise<void>; // Old mock login
  registerUser: (email: string, password_hash: string, name: string) => Promise<RegisterResponse>; // Hashed password not used here, backend does it.
  loginUser: (email: string, password_hash: string) => Promise<LoginResponse>; // Hashed password not used here
  logout: () => void;
  updateUserCurriculum: (curriculumId: string) => void;
  selectedCurriculumDetails: Curriculum | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'waterClassroomUser';
const ACCESS_TOKEN_KEY = 'waterClassroomAccessToken';
const REFRESH_TOKEN_KEY = 'waterClassroomRefreshToken';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCurriculumDetails, setSelectedCurriculumDetails] = useState<Curriculum | null>(null);

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    // const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY); // Not used for initial load decision directly

    if (storedUser && accessToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        if (parsedUser.selectedCurriculumId) {
          const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === parsedUser.selectedCurriculumId) || null;
          setSelectedCurriculumDetails(curriculum as Curriculum | null);
        }
        // TODO: Optionally, validate token with a /me endpoint here and refresh user data
        // For now, we trust localStorage. If token is invalid, subsequent API calls will fail.
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        // Clear potentially corrupted storage
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const registerUser = useCallback(async (email: string, password_hash: string, name: string): Promise<RegisterResponse> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password_hash, display_name: name }), // map name to display_name, password to password
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Registration failed with status ${response.status}`);
      }
      // Registration successful, data is RegisterResponse. User should login next.
      setLoading(false);
      return data as RegisterResponse;
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      throw error; // Re-throw to be caught by AuthForm
    }
  }, []);

  const loginUser = useCallback(async (email: string, password_hash: string): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password_hash }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Login failed with status ${response.status}`);
      }

      const loginData = data as LoginResponse;

      const loggedInUser: User = {
        id: loginData.user_id,
        email: loginData.email,
        name: loginData.display_name, // Map display_name to name
        role: loginData.role,
        accessToken: loginData.access_token,
        refreshToken: loginData.refresh_token,
        // TODO: Fetch or initialize other user details like progress, avatarUrl, etc.
        // For now, keep them minimal or as they were if user existed.
        // If a user object was previously in state or storage, could merge.
        // Here we create a new one based on login response.
        avatarUrl: `https://i.pravatar.cc/150?u=${loginData.email}`, // Placeholder
        progress: { completedLectures: [], assessmentScores: {} }, // Placeholder
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      localStorage.setItem(ACCESS_TOKEN_KEY, loginData.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, loginData.refresh_token);

      setUser(loggedInUser);
      setSelectedCurriculumDetails(null); // Reset curriculum on new login, user might select later
      setLoading(false);
      return loginData;
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      throw error; // Re-throw to be caught by AuthForm
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setSelectedCurriculumDetails(null);
    // TODO: Optionally call a /logout endpoint on the backend
  }, []);

  const updateUserCurriculum = useCallback((curriculumId: string) => {
    if (user) {
      const updatedUser = { ...user, selectedCurriculumId: curriculumId };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser)); // Update stored user
      setUser(updatedUser);
      const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === curriculumId) || null;
      setSelectedCurriculumDetails(curriculum as Curriculum | null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logout, updateUserCurriculum, selectedCurriculumDetails }}>
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

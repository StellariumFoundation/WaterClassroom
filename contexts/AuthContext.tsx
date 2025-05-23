
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Curriculum } from '../types';
import { MOCK_CURRICULA_DATA } from '../constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserCurriculum: (curriculumId: string) => void;
  selectedCurriculumDetails: Curriculum | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCurriculumDetails, setSelectedCurriculumDetails] = useState<Curriculum | null>(null);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('waterClassroomUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      if (parsedUser.selectedCurriculumId) {
        const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === parsedUser.selectedCurriculumId) || null;
        setSelectedCurriculumDetails(curriculum as Curriculum | null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, name: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
      progress: { completedLectures: [], assessmentScores: {} },
      subscription: { planName: 'Free Trial', isActive: true, expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
      badges: [],
      streak: 0,
      points: 0,
    };
    localStorage.setItem('waterClassroomUser', JSON.stringify(newUser));
    setUser(newUser);
    setSelectedCurriculumDetails(null); // Reset curriculum details on new login
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('waterClassroomUser');
    setUser(null);
    setSelectedCurriculumDetails(null);
  }, []);

  const updateUserCurriculum = useCallback((curriculumId: string) => {
    if (user) {
      const updatedUser = { ...user, selectedCurriculumId: curriculumId };
      localStorage.setItem('waterClassroomUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === curriculumId) || null;
      setSelectedCurriculumDetails(curriculum as Curriculum | null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserCurriculum, selectedCurriculumDetails }}>
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

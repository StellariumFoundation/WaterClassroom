import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface TutorWidgetContextType {
  isTutorWidgetOpen: boolean;
  openTutorWidget: () => void;
  closeTutorWidget: () => void;
  toggleTutorWidget: () => void;
}

const TutorWidgetContext = createContext<TutorWidgetContextType | undefined>(undefined);

export const TutorWidgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openTutorWidget = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeTutorWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleTutorWidget = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const value = {
    isTutorWidgetOpen: isOpen,
    openTutorWidget,
    closeTutorWidget,
    toggleTutorWidget,
  };

  return (
    <TutorWidgetContext.Provider value={value}>
      {children}
    </TutorWidgetContext.Provider>
  );
};

export const useTutorWidget = (): TutorWidgetContextType => {
  const context = useContext(TutorWidgetContext);
  if (context === undefined) {
    throw new Error('useTutorWidget must be used within a TutorWidgetProvider');
  }
  return context;
};

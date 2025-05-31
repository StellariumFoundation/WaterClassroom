import React from 'react';
import { MessageSquarePlus } from 'lucide-react'; // Or another suitable icon like Bot or Brain

interface TutorOverlayButtonProps {
  onClick: () => void;
}

const TutorOverlayButton: React.FC<TutorOverlayButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-brand-light-blue text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:bg-opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-navy focus:ring-brand-light-blue active:scale-95 transition-all duration-150 ease-in-out"
      aria-label="Open AI Tutor"
      title="Open AI Tutor"
    >
      <MessageSquarePlus size={32} />
    </button>
  );
};

export default TutorOverlayButton;

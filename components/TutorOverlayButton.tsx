import React from 'react';
import { MessageSquarePlus } from 'lucide-react'; // Or another suitable icon like Bot or Brain

interface TutorOverlayButtonProps {
  onClick: () => void;
}

const TutorOverlayButton: React.FC<TutorOverlayButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-40
                 text-white
                 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700
                 hover:from-blue-500 hover:via-blue-600 hover:to-blue-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-100
                 active:scale-95
                 transition-all duration-150 ease-in-out transform hover:scale-105
                 tutor-fab-shine button-shimmer" // Added button-shimmer
      aria-label="Open AI Tutor"
      title="Open AI Tutor"
    >
      <MessageSquarePlus size={32} />
    </button>
  );
};

export default TutorOverlayButton;

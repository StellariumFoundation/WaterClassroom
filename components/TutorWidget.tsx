import React from 'react';
import ChatInterface from './ChatInterface'; // Assuming ChatInterface is in the same directory
import { X } from 'lucide-react';
import { ChatMessage } from '../types';

interface TutorWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorWidget: React.FC<TutorWidgetProps> = ({ isOpen, onClose }) => {
  const widgetInitialMessages: ChatMessage[] = [
    {
      id: 'widget-intro-1',
      sender: 'ai' as const,
      text: "Aqua here! How can I help you dive deeper into your studies?",
      timestamp: new Date()
    },
  ];

  const baseClasses = "fixed w-[calc(100vw-2.5rem)] max-w-md h-[70vh] max-h-[500px] bg-brand-slate-darker rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out";
  const positionClasses = "bottom-24 right-5 md:bottom-20 md:right-8";

  const openClasses = "transform translate-y-0 opacity-100";
  // Using translate-y-[105%] to ensure it's definitely off-screen, as translate-y-full can be exactly at the edge.
  const closedClasses = "transform translate-y-[105%] opacity-0 pointer-events-none";

  return (
    <div className={`${baseClasses} ${positionClasses} ${isOpen ? openClasses : closedClasses}`}>
      <header className="flex justify-between items-center p-3 border-b border-brand-slate-medium flex-shrink-0">
        <h3 className="text-lg font-semibold text-brand-slate-light">AI Tutor</h3>
        <button
          onClick={onClose}
          className="text-brand-slate-light hover:text-brand-light-blue p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-light-blue"
          aria-label="Close tutor widget"
        >
          <X size={20} />
        </button>
      </header>
      <div className="flex-grow overflow-hidden p-1"> {/* Apply padding here if ChatInterface itself doesn't have it */}
        {/*
          Wrapper div to constrain ChatInterface's height.
          ChatInterface's internal styling for height might still conflict or need adjustment.
          Ideally, ChatInterface would adapt to a flex parent or take a height prop.
        */}
        <div className="h-full w-full">
          <ChatInterface initialMessages={widgetInitialMessages} />
        </div>
      </div>
    </div>
  );
};

export default TutorWidget;

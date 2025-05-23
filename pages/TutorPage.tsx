
import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { MessageSquareDashed } from 'lucide-react';

const TutorPage: React.FC = () => {
  const initialMessages = [
    { 
      id: 'intro-1', 
      sender: 'ai' as const, 
      text: "Hello! I'm Aqua, your AI Tutor. How can I help you with your studies today?", 
      timestamp: new Date() 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <MessageSquareDashed size={48} className="mx-auto text-brand-light-blue mb-4" />
        <h1 className="text-4xl font-bold text-brand-slate-light">AI Tutor</h1>
        <p className="text-brand-slate-medium mt-2">Your personal AI assistant for learning and homework help.</p>
      </header>
      <ChatInterface initialMessages={initialMessages} />
      <div className="mt-6 p-4 bg-brand-slate-dark rounded-lg text-sm text-brand-slate-medium">
        <h3 className="font-semibold text-brand-slate-light mb-2">Tips for using Aqua:</h3>
        <ul className="list-disc list-inside space-y-1">
            <li>Ask specific questions about topics you're studying.</li>
            <li>If you're stuck on a problem, explain what you've tried so far.</li>
            <li>Use the "Google Search" toggle if your query relates to recent events or requires up-to-date web information.</li>
            <li>You can ask for explanations, examples, or practice problems.</li>
        </ul>
      </div>
    </div>
  );
};

export default TutorPage;

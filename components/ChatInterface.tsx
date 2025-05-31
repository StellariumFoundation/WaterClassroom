
import React, { useState, useRef, useEffect, useCallback } from 'react';
// Fix: Import ToastType
import { ChatMessage, GroundingChunk, GeminiApiResponse, ToastType } from '../types';
import { getTutorResponseStream } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { Send, User, Cpu, Zap, Link as LinkIcon, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToastContext } from '../hooks/useToast';


interface ChatInterfaceProps {
  initialMessages?: ChatMessage[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSendMessage = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = `msg_${Date.now()}_ai`;
    // Add a placeholder for AI's response for streaming
    const aiPlaceholderMessage: ChatMessage = {
      id: aiMessageId,
      sender: 'ai',
      text: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    try {
      const stream = await getTutorResponseStream([...messages, userMessage], input, useGoogleSearch);
      let accumulatedText = '';
      let finalGroundingMetadata: GroundingChunk[] | undefined = undefined;

      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        if (chunk.groundingMetadata?.groundingChunks?.length) {
           finalGroundingMetadata = chunk.groundingMetadata.groundingChunks;
        }
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedText, isStreaming: true, groundingMetadata: finalGroundingMetadata } : msg
          )
        );
      }
      
      // Final update to mark streaming as complete and add grounding metadata if any
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: accumulatedText, isStreaming: false, groundingMetadata: finalGroundingMetadata } : msg
        )
      );

    } catch (error) {
      console.error('Error getting tutor response:', error);
      // Fix: Use ToastType.Error instead of "error"
      addToast(error instanceof Error ? error.message : 'Failed to get response from AI tutor.', ToastType.Error);
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId)); // Remove placeholder on error
       const errorResponseMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLoading, messages, useGoogleSearch, addToast]);


  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-slate-100 shadow-xl rounded-lg overflow-hidden"> {/* Adjusted height for widget context */}
      <div className="p-4 border-b border-slate-300 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">AI Tutor (Aqua)</h2>
        <label htmlFor="googleSearchToggle" className="flex items-center cursor-pointer">
          <Search size={18} className={`mr-2 ${useGoogleSearch ? 'text-blue-600': 'text-slate-500'}`} />
          <span className={`text-sm mr-2 ${useGoogleSearch ? 'text-blue-600': 'text-slate-600'}`}>Google Search</span>
          <div className="relative">
            <input 
              type="checkbox" 
              id="googleSearchToggle" 
              className="sr-only" 
              checked={useGoogleSearch}
              onChange={() => setUseGoogleSearch(!useGoogleSearch)}
            />
            <div className={`block w-10 h-6 rounded-full ${useGoogleSearch ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useGoogleSearch ? 'translate-x-full' : ''}`}></div>
          </div>
        </label>
      </div>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-white"> {/* Changed message area bg */}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-lg p-3 rounded-xl shadow ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none' // User bubble with gradient
                  : 'bg-slate-200 text-slate-800 rounded-bl-none' // AI bubble
              }`}
            >
              <div className="flex items-center mb-1">
                {msg.sender === 'user' ? <User size={16} className="mr-2 text-current" /> : <Cpu size={16} className="mr-2 text-slate-700" />}
                <span className={`text-xs font-semibold ${msg.sender === 'user' ? 'text-white/90' : 'text-slate-700'}`}>{msg.sender === 'user' ? 'You' : 'Aqua'}</span>
              </div>
              <div className={`prose prose-sm max-w-none ${msg.sender === 'ai' ? 'text-slate-800' : 'text-white'}`}> {/* Removed prose-invert for AI */}
                <ReactMarkdown
                    components={{
                        p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                    }}
                >
                    {msg.text}
                </ReactMarkdown>
                {msg.isStreaming && <span className="inline-block w-2 h-2 ml-1 bg-current rounded-full animate-pulse"></span>}
              </div>
               {msg.sender === 'ai' && msg.groundingMetadata && msg.groundingMetadata.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-300"> {/* Adjusted border color */}
                  <h4 className="text-xs font-semibold mb-1 text-slate-500">Sources:</h4> {/* Adjusted text color */}
                  <ul className="space-y-1">
                    {msg.groundingMetadata.map((chunk, index) => (
                      <li key={index} className="text-xs">
                        <a 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center text-blue-600 hover:text-blue-700 hover:underline break-all" // Adjusted link color
                        >
                          <LinkIcon size={12} className="mr-1 flex-shrink-0" />
                          {chunk.web.title || chunk.web.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length -1].sender === 'user' && (
           <div className="flex justify-start"> <LoadingSpinner size="sm" text="Aqua is thinking..." className="text-slate-600" /></div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-300 bg-slate-100"> {/* Adjusted input area bg and border */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Ask Aqua anything..."
            className="flex-grow p-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ''}
            className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-600 hover:via-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out relative overflow-hidden button-shimmer"
            aria-label="Send message"
          >
            {isLoading ? <Zap size={20} className="animate-pulse" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
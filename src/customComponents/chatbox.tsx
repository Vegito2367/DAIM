import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image, Paperclip, X, Maximize2, Minimize2 } from 'lucide-react';

// Types
type MessageSender = 'user' | 'ai';

interface Message {
  id: number;
  text: string;
  sender: MessageSender;
  timestamp?: Date;
}

interface AIChatboxProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  aiName?: string;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const AIChatbox: React.FC<AIChatboxProps> = ({
  initialMessages = [],
  onSendMessage,
  aiName = "AI Assistant",
  placeholder = "Type a message...",
  isLoading = false,
  className = "",
  expanded = false,
  onToggleExpand
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [
    { id: 1, text: "Hello! How can I help you today?", sender: "ai", timestamp: new Date() },
    { id: 2, text: "I have a question about my project.", sender: "user", timestamp: new Date() },
    { id: 3, text: "Sure, I'd be happy to help with your project. What would you like to know?", sender: "ai", timestamp: new Date() }
  ]);
  
  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    const currentMessage = inputText;
    setInputText('');
    
    if (onSendMessage) {
      // Use the provided callback
      await onSendMessage(currentMessage);
    } else {
      // Simulate AI response (in a real app, you'd call your AI API here)
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: "Thanks for your message. This is a simulated response from the AI assistant.",
          sender: "ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus the input field when the component mounts
  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  return (
    <div className={`${expanded ? 'w-full h-[70vh]' : 'w-full max-w-2xl h-full'} 
      bg-white dark:bg-gray-900 rounded-md shadow-md overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center">
            <span className="text-white font-medium text-lg">{aiName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{aiName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by NextAI</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleExpand && (
            <button 
              onClick={onToggleExpand} 
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              aria-label={expanded ? "Minimize chat" : "Maximize chat"}
            >
              {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          )}
          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950 h-[calc(100%-140px)]">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center mr-3 mt-1">
                <span className="text-white font-medium text-xs">{aiName.charAt(0)}</span>
              </div>
            )}
            <div className="max-w-[80%]">
              <div 
                className={`px-4 py-3 rounded-md ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {message.text}
              </div>
              {message.timestamp && (
                <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {new Intl.DateTimeFormat('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  }).format(message.timestamp)}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center mr-3 mt-1">
              <span className="text-white font-medium text-xs">{aiName.charAt(0)}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-3">
          <div className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden flex items-end">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="w-full resize-none border-0 bg-transparent py-3 px-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-0 focus:outline-none max-h-40 min-h-[50px]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' || isLoading}
            className={`px-4 py-3 rounded-md flex items-center justify-center ${
              inputText.trim() === '' || isLoading
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        
        {/* <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Messages are processed by our AI to provide assistance
        </div> */}
      </div>
    </div>
  );
};

export default AIChatbox;
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader } from 'lucide-react';
import { apiCall } from '../../utils/api';
import toast from 'react-hot-toast';

const ChatModal = ({ workflowId, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Workflow loaded successfully! Ask me anything.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add timeout to the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
      
      // Show progress
      setLoadingProgress('Processing your request...');
      
      setTimeout(() => {
        if (isLoading) setLoadingProgress('Connecting to AI model...');
      }, 3000);
      
      setTimeout(() => {
        if (isLoading) setLoadingProgress('Generating response...');
      }, 8000);
      
      // Call the backend API to process the message through the workflow
      const response = await Promise.race([
        apiCall('post', `/api/workflows/${workflowId}/chat`, {
          message: inputValue,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 45000)
        )
      ]);
      
      clearTimeout(timeoutId);

      if (response && response.success !== false) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: response.data?.response || response.response || 'I received your message but couldn\'t generate a response.',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response?.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorContent = 'Sorry, I encountered an error processing your request.';
      
      if (error.message === 'Request timeout') {
        errorContent = 'The request is taking longer than expected. Please try again with a shorter question.';
      } else if (error.message.includes('rate limit')) {
        errorContent = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message.includes('quota')) {
        errorContent = 'API quota exceeded. Please check the API configuration.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: errorContent,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
      setLoadingProgress('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-float w-full max-w-4xl h-[85vh] max-h-screen flex flex-col animate-fade-in">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-heading">Chat with AI Stack</h3>
              <p className="text-caption">Powered by your custom workflow</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Connected</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 focus-visible"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className="flex items-start space-x-3 max-w-2xl">
                {message.type !== 'user' && (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                    message.type === 'system' 
                      ? 'bg-gradient-to-br from-gray-400 to-gray-500' 
                      : 'bg-gradient-to-br from-primary-500 to-primary-600'
                  }`}>
                    {message.type === 'system' ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white ml-auto'
                      : message.type === 'system'
                      ? 'bg-gray-100 text-gray-700 border border-gray-200'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2">
                        <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-3 max-w-2xl">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="bg-white text-gray-900 border border-gray-200 shadow-md px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Loader className="w-4 h-4 animate-spin text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {loadingProgress || 'AI is thinking...'}
                    </span>
                  </div>
                  <div className="mt-2 flex space-x-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="form-input pr-12 py-4 text-base resize-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="flex items-center space-x-2">
                    {inputValue.trim() && (
                      <div className="text-xs text-gray-400 font-medium">
                        {inputValue.length} chars
                      </div>
                    )}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        inputValue.trim() && !isLoading
                          ? 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 shadow-md'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-caption flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd>
              <span>to send</span>
              <span className="text-gray-300">•</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Shift + Enter</kbd>
              <span>for new line</span>
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Workflow active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
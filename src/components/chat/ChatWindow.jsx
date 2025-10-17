import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { documentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Bot, User, Loader2, RefreshCw } from 'lucide-react';

export default function ChatWindow({ documentId = null }) {
  const [messages, setMessages] = useState([
    { 
      id: 0, 
      sender: 'ai', 
      text: documentId
        ? `Hello! I'm ready to help you explore this document. What would you like to know? 🤗`
        : 'Hello! I\'m your AI assistant. Ask me anything about your uploaded documents and I\'ll help you find the information you need.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    setMessages([
      { 
        id: 0, 
        sender: 'ai', 
        text: documentId
          ? `Hello! I'm ready to help you explore this document. What would you like to know? 🤗`
          : 'Hello! I\'m your AI assistant. Ask me anything about your uploaded documents and I\'ll help you find the information you need.',
        timestamp: new Date()
      }
    ]);
  }, [documentId]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      sender: 'user', 
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const payload = { question: text };
      if (documentId) {
        payload.documentId = documentId;
      }

      console.log('🤖 Sending question to AI:', text);
      const response = await documentAPI.ask(payload);
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: response.data.answer,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
      toast.success("Answer received!");
    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorMessageText = error.response?.data?.message || 'Sorry, I encountered an error while processing your question. Please try again.';
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        text: errorMessageText,
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(errorMessageText);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        id: 0, 
        sender: 'ai', 
        text: documentId
          ? `Hello! I'm ready to help you explore this document. What would you like to know? 🤗`
          : 'Hello! I\'m your AI assistant. Ask me anything about your uploaded documents and I\'ll help you find the information you need.',
        timestamp: new Date()
      }
    ]);
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[82vh] min-h-[500px] ">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r bg-rose-700 rounded-full">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Chat About this Document</h3>
            <p className="text-sm text-gray-600">
              {documentId ? 'Document-specific chat' : 'General document chat'}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Clear chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
      >
        <MessageList messages={messages} />
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="ml-2 text-sm">thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <MessageInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

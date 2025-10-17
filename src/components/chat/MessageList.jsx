import React from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUser = message.sender === 'user';
  const isError = message.isError;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r bg-rose-700' 
          : isError 
            ? 'bg-red-100' 
            : 'bg-gradient-to-r bg-rose-700'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className={`w-4 h-4 ${isError ? 'text-red-600' : 'text-white'}`} />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-to-r bg-rose-700 text-white'
            : isError
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          {/* Message Text */}
          <div className="prose prose-sm max-w-none">
            <p className={`whitespace-pre-wrap break-words ${
              isUser ? 'text-white' : isError ? 'text-red-800' : 'text-gray-900'
            }`}>
              {message.text}
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`absolute -top-2 -right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ${
              isUser 
                ? 'bg-white text-gray-600 hover:bg-gray-50' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <span className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default function MessageList({ messages }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}

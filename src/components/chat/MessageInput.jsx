import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { FaSearch, FaSearchPlus } from 'react-icons/fa';

export default function MessageInput({ onSend, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileUpload = () => {
    // Placeholder for file upload functionality
    console.log('File upload clicked');
  };

  const handleVoiceRecord = () => {
    // Placeholder for voice recording functionality
    setIsRecording(!isRecording);
    console.log('Voice recording:', !isRecording);
  };

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!inputValue && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputValue]);

  return (
    <div className="p-4 ">
      <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        {/* File Upload Button */}
        <button
          onClick={handleFileUpload}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          title="Attach file"
          disabled={disabled}
        >
          <FaSearch className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            className="w-full resize-none border-0 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 text-base leading-6 min-h-[24px] max-h-[120px]"
            rows={1}
            placeholder="Ask me anything about your documents..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            style={{ height: '24px' }}
          />
        </div>



        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          className={`p-3 rounded-full transition-all duration-200 ${
            inputValue.trim() && !disabled
              ? 'bg-gradient-to-r from-blue-500 bg-rose-700 text-white hover:from-blue-600 hover:bg-rose-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setInputValue("What is this document about?")}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          disabled={disabled}
        >
          Summarize
        </button>
        <button
          onClick={() => setInputValue("What are the key points in this document?")}
          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
          disabled={disabled}
        >
          Key Points
        </button>
        <button
          onClick={() => setInputValue("Find specific information about...")}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
          disabled={disabled}
        >
          Search
        </button>
      </div>
    </div>
  );
}

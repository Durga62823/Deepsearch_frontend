import React, { useState } from 'react';

export default function MessageInput({ onSend, disabled }) {
  const [inputValue, setInputValue] = useState('');

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

  return (
    <div className="flex gap-2">
      <textarea
        className="flex-grow p-2 sm:p-3 border rounded resize-none focus:outline-none focus:ring focus:border-blue-300 text-sm sm:text-base min-h-[40px] max-h-[120px]"
        rows={1}
        placeholder="Ask a question..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded disabled:bg-blue-300 text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors"
        onClick={handleSend}
        disabled={disabled || !inputValue.trim()}
      >
        Send
      </button>
    </div>
  );
}

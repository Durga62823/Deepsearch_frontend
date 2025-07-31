import React from 'react';

export default function MessageList({ messages }) {
  return (
    <ul className="space-y-2 sm:space-y-3">
      {messages.map(({ id, sender, text }) => (
        <li
          key={id}
          className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
              sender === 'user' ? 'bg-red-400 text-white hover:bg-red-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <p className="break-words">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';

export default function AskAIPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 h-full min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">Ask AI About Your Documents</h1>
      <ChatWindow />
    </div>
  );
}

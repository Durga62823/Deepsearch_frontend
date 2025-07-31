import React from "react";
import ChatWindow from "./ChatWindow";

export default function ChatModal({ isOpen, onClose, documentId }) {
  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">AI Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-grow p-4 ">
          <ChatWindow documentId={documentId} />
        </div>
      </div>
    </div>
  );
}

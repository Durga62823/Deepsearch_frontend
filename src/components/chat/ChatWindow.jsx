import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { documentAPI } from '../../services/api';
import { toast } from 'react-toastify';

export default function ChatWindow({ documentId = null }) {
  const [messages, setMessages] = useState([
    { id: 0, sender: 'ai', text: 'Hello! Ask me anything about your documents.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    setMessages([
      { id: 0, sender: 'ai', text: documentId
          ? `Hello! Ask me anything about this document.🤗`
          : 'Hello! Ask me anything about your documents.'
      }
    ]);
  }, [documentId]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const payload = { question: text };
      if (documentId) {
        payload.documentId = documentId;
      }

      const response = await documentAPI.ask(payload);
      const aiMessage = { id: Date.now() + 1, sender: 'ai', text: response.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
      toast.success("Answer received!");
    } catch (error) {
      const errorMessageText = error.response?.data?.message || 'Sorry, something went wrong while getting the answer. Please try again.';
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        text: errorMessageText
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(errorMessageText);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-inner p-2 sm:p-4 bg-gray-50">
      <div
        ref={messageListRef}
        className="overflow-y-auto mb-3 sm:mb-4 flex-grow space-y-2 sm:space-y-3 p-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
      >
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex justify-center items-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 text-sm sm:text-base">typing...</span>
          </div>
        )}
      </div>

      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}

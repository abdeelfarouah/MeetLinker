import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  read: boolean;
};

type ChatBoxProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const ChatBox: React.FC<ChatBoxProps> = ({ messages = [], setMessages }) => {
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: newMessage.trim(), read: false },
    ]);
    setNewMessage('');
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-[400px]">
      <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.read
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p className="break-words">{msg.text}</p>
            </div>
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          disabled={!newMessage.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
import { useState } from 'react';
import { toast } from 'sonner';
import { encryptMessage } from '@/utils/crypto';
import type { Message } from '@/types/chat';

export const useMessages = (currentUserName: string, userId: string, avatarUrl: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    try {
      const encryptedContent = encryptMessage(content);
      const newMessage: Message = {
        id: Date.now().toString(),
        content: encryptedContent,
        sender: {
          id: userId,
          name: currentUserName,
          avatar: avatarUrl
        },
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      console.log('Message sent:', { content, encrypted: encryptedContent });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
    }
  };

  return {
    messages,
    handleSendMessage
  };
};
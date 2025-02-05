import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRoomMessages, sendMessage, subscribeToMessages } from '../lib/supabase';
import type { Message } from '../types/supabase';

export const useMessages = (roomId: string, userId: string) => {
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getRoomMessages(roomId),
  });

  const { mutate: sendMessageMutation } = useMutation({
    mutationFn: (content: string) => sendMessage(content, roomId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    },
  });

  useEffect(() => {
    if (!isSubscribed && roomId) {
      const subscription = subscribeToMessages(roomId, (newMessage) => {
        queryClient.setQueryData(['messages', roomId], (old: Message[] = []) => [
          ...old,
          newMessage,
        ]);
      });

      setIsSubscribed(true);

      return () => {
        subscription.unsubscribe();
        setIsSubscribed(false);
      };
    }
  }, [roomId, queryClient, isSubscribed]);

  return {
    messages,
    isLoading,
    sendMessage: sendMessageMutation,
  };
};
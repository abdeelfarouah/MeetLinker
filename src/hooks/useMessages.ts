import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useMessages = (roomId: string, userId: string) => {
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch messages for the room
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      console.log('Fetching messages for room:', roomId);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      return data;
    },
    enabled: !!roomId,
  });

  // Send message mutation
  const { mutate: sendMessageMutation } = useMutation({
    mutationFn: async (content: string) => {
      console.log('Sending message:', { content, roomId, userId });
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content,
            room_id: roomId,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isSubscribed && roomId && !subscriptionRef.current) {
      console.log('Setting up subscription for room:', roomId);
      
      const channel = supabase
        .channel(`room-${roomId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            console.log('New message received:', payload);
            queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
          }
        )
        .subscribe();

      subscriptionRef.current = channel;
      setIsSubscribed(true);

      return () => {
        console.log('Cleaning up subscription for room:', roomId);
        if (subscriptionRef.current) {
          supabase.removeChannel(subscriptionRef.current);
          subscriptionRef.current = null;
          setIsSubscribed(false);
        }
      };
    }
  }, [roomId, queryClient, isSubscribed]);

  return {
    messages,
    isLoading,
    sendMessage: sendMessageMutation,
  };
};
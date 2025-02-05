import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ChatLayout from '@/features/chat/components/ChatLayout';
import { toast } from 'sonner';

const ChatRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { user } = useAuth();

  // Fetch or create room
  const { data: room, isLoading: isRoomLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      if (roomId === 'new') {
        // Create a new room
        console.log('Creating new room');
        const { data: newRoom, error: createError } = await supabase
          .from('rooms')
          .insert([
            {
              name: `Room ${new Date().toISOString()}`,
              created_by: user.id,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating room:', createError);
          toast.error('Failed to create room');
          throw createError;
        }

        // Redirect to the new room
        navigate(`/chat/${newRoom.id}`, { replace: true });
        return newRoom;
      } else {
        // Fetch existing room
        console.log('Fetching room:', roomId);
        const { data: existingRoom, error: fetchError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching room:', fetchError);
          toast.error('Failed to fetch room');
          throw fetchError;
        }

        if (!existingRoom) {
          toast.error('Room not found');
          navigate('/chat/new', { replace: true });
          return null;
        }

        return existingRoom;
      }
    },
    enabled: !!user,
  });

  if (!user) {
    return <div>Please log in to access chat rooms.</div>;
  }

  if (isRoomLoading) {
    return <div>Loading room...</div>;
  }

  if (!room) {
    return null;
  }

  return (
    <ChatLayout 
      roomId={room.id} 
      userId={user.id} 
    />
  );
};

export default ChatRoom;
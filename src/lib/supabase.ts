import { createClient } from '@supabase/supabase-js';
import type { Message, Profile, Room } from '../types/supabase';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getRoomMessages = async (roomId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const sendMessage = async (content: string, roomId: string, userId: string) => {
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

  if (error) throw error;
  return data;
};

export const subscribeToMessages = (
  roomId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};
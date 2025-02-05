import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://dtflzvuhfvkvftjhyqay.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Zmx6dnVoZnZrdmZ0amh5cWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NTg1MDYsImV4cCI6MjA1NDMzNDUwNn0.b06q8JGR5Ntw0yKP9SMI5zPgLPT0x6lfUuqAL42BZeg';

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'app-supabase-auth',
  },
});

// Export reusable database functions
export const getRoomMessages = async (roomId: string) => {
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
  callback: (message: Database['public']['Tables']['messages']['Row']) => void
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
        callback(payload.new as Database['public']['Tables']['messages']['Row']);
      }
    )
    .subscribe();
};

export const createRoom = async (name: string, userId: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert([
      {
        name,
        created_by: userId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: { username?: string; avatar_url?: string }) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};

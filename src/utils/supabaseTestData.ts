import { supabase } from '../lib/supabase';
import { faker } from '@faker-js/faker/locale/fr';

export const insertTestData = async () => {
  console.log('Starting test data insertion...');
  
  try {
    // Create a test user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: faker.string.uuid(),
          username: faker.internet.userName(),
          avatar_url: faker.image.avatar(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (profileError) throw profileError;
    console.log('Test profile created:', profile);

    // Create a test room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .upsert([
        {
          name: 'Test Room',
          created_by: profile[0].id,
        }
      ])
      .select();

    if (roomError) throw roomError;
    console.log('Test room created:', room);

    // Create test messages
    const { data: messages, error: messageError } = await supabase
      .from('messages')
      .upsert([
        {
          content: 'Hello, this is a test message!',
          user_id: profile[0].id,
          room_id: room[0].id,
        },
        {
          content: 'Another test message',
          user_id: profile[0].id,
          room_id: room[0].id,
        }
      ])
      .select();

    if (messageError) throw messageError;
    console.log('Test messages created:', messages);

    return { profile, room, messages };
  } catch (error) {
    console.error('Error inserting test data:', error);
    throw error;
  }
};